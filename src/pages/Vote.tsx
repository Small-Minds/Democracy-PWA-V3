import { AxiosResponse } from 'axios';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  Divider,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Notification,
  Radio,
  RadioGroup,
} from 'rsuite';
import CandidateInfo from '../components/CandidateInfo';
import { PositionDetails } from '../utils/api/ElectionManagement';
import {
  EmptyBallot,
  getEmptyBallot,
  submitBallot,
  VoteParams,
} from '../utils/api/Voting';
import { Credentials } from '../utils/Authentication';
import Loading from './Loading';

export default function Vote() {
  const [t] = useTranslation();
  const history = useHistory();
  let { id } = useParams<any>();
  const ctx = useContext(Credentials);
  //set up required variable for rsuite forms.
  let form: any = undefined;

  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const [ballot, setBallot] = useState<EmptyBallot>();

  useEffect(() => {
    console.log('Getting ballot...');
    //Return early if no context is provided.
    if (!ctx || !ctx.credentials.authenticated) return;
    if (ballot) return;
    //If logged in, attempt to get the position details
    getEmptyBallot(id).then((value: EmptyBallot) => {
      setBallot(value);
    });
  }, []);

  const submit = () => {
    // First, check the form for errors.
    if (!ballot) return;
    const formDataKeys = Object.keys(formData);
    console.log(formData);

    // Place all missing keys into an array.
    const missingPositions: PositionDetails[] = [];
    ballot.positions.forEach((position) => {
      if (formDataKeys.indexOf(position.id) === -1) {
        missingPositions.push(position);
      }
    });

    // Add all missing keys to the form errors.
    if (missingPositions.length !== 0) {
      console.log('Missing positions detected.');
      const errors: any = {};
      missingPositions.forEach((position) => {
        errors[position.id] = 'Required.';
      });
      setFormErrors(errors);
      console.log('Form is missing election fields.');
      console.log(errors);
      return;
    } else {
      setFormErrors({});
    }

    if (!form.check()) {
      console.log('Form has errors.');
      console.log(formErrors);
      return;
    }

    console.log('Form has NO ERRORS, submitting...');
    const votes: VoteParams[] = [];
    ballot.positions.forEach((position) => {
      const choice = formData[position.id];
      if (choice === 'abstain') return;
      votes.push({
        position: position.id,
        candidate: choice,
      });
    });
    console.log(votes);
    submitBallot({
      election: id.toString().trim(),
      votes: votes,
    })
      .then((res: AxiosResponse) => {
        console.log(res);
        setFormData({});
        setFormErrors({});
        history.push(`/election/${id}`);
        Notification['success']({
          title: t('votePage.ballotSubSuccessModalTitle'),
          description: t('votePage.ballotSubSuccessModalBody'),
        });
      })
      .catch((err) => {
        Notification['error']({
          title: t('votePage.ballotSubFailModalTitle'),
          description: t('votePage.ballotSubFailModalBody'),
        });
        console.log(err);
        if (err && err.response) console.log(err.response);
        if (err && err.response && err.response.data)
          console.log(err.response.data);
      });
  };

  // While we fetch the ballot, show the spinner.
  if (!ballot)
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );

  return (
    <div>
      <h2>{`${t('votePage.ballotElectionTitle')} ${ballot.title}`}</h2>
      <p>
        {`${t('votePage.ballotPositionTitle')} ${ballot.positions
          .map((pos) => pos.title)
          .join(', ')}`}
      </p>
      <p>{t('votePage.ballotViewCandidateInfo')}</p>
      <br />
      <Form
        onChange={(newData) => setFormData(newData)}
        checkTrigger="none"
        formValue={formData}
        formError={formErrors}
        ref={(ref: any) => (form = ref)}
        fluid
      >
        <FormGroup>
          {ballot.positions.map((pos, index) => (
            <div key={index}>
              <Divider>
                <h3>{pos.title}</h3>
              </Divider>
              <br />
              <h5>{t('votePage.ballotPosDecriptionTitle')}</h5>
              <p>{pos.description}</p>
              <br />
              <h5>{t('votePage.ballotPosCandidateTitle')}</h5>
              <br />
              <FlexboxGrid justify="start" align="middle">
                {pos.candidates.map((candidate, index) => (
                  <FlexboxGrid.Item key={index}>
                    <CandidateInfo candidate={candidate} />
                  </FlexboxGrid.Item>
                ))}
              </FlexboxGrid>
              <br />
              <h5>{t('votePage.ballotVoteSectionTitle')}</h5>
              <br />
              <FormControl name={pos.id} accepter={RadioGroup} required>
                {pos.candidates.map((candidate, index) => (
                  <div key={index}>
                    <Radio value={candidate.id}>{candidate.user.name}</Radio>
                  </div>
                ))}
                <Radio value={`abstain`}>
                  {t('votePage.ballotVoteOption')}
                </Radio>
              </FormControl>
            </div>
          ))}
          <Divider />
          <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  size="lg"
                  type="submit"
                  onClick={() => submit()}
                >
                  {t('votePage.ballotSubBtn')}
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  {t('votePage.ballotCancelBtn')}
                </Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FormGroup>
      </Form>
    </div>
  );
}
