import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  Notification,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Schema,
  List,
  Divider,
  Avatar,
  FlexboxGrid,
  Grid,
  Col,
  RadioGroup,
  Radio,
  Modal,
} from 'rsuite';
import CandidateInfo from '../components/CandidateInfo';
import CandidateInfoModal from '../components/CandidateInfo';
import { Position, PositionDetails } from '../utils/api/ElectionManagement';
import {
  getPosition,
  PositionApplicationParams,
  submitPositionApplication,
} from '../utils/api/PositionApplication';
import { EmptyBallot, getEmptyBallot } from '../utils/api/Voting';
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
    //Return early if no context is provided.
    if (!ctx || !ctx.credentials.authenticated) return;
    //If logged in, attempt to get the position details
    getEmptyBallot(id).then((value: EmptyBallot) => {
      setBallot(value);
    });
  }, []);

  // While we fetch the ballot, show the spinner.
  if (!ballot)
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );

  const validate = (newErrors: Record<string, any>): boolean => {
    if (!ballot || !formData || !formErrors) return false;
    const formDataKeys = Object.keys(formData);
    const missingPositions: PositionDetails[] = [];
    ballot.positions.forEach((position) => {
      if (formDataKeys.indexOf(position.id) === -1) {
        missingPositions.push(position);
      }
    });

    if (missingPositions.length !== 0) {
      const errors: any = {};
      missingPositions.forEach((position) => {
        errors[position.id] = 'Required.';
      });
      setFormErrors({ ...newErrors, ...errors });
      return false;
    }
    return true;
  };

  const submitBallot = () => {
    console.log(formData);
    // Remove errors and set button to loading state.

    // First, check the form for errors.
    if (!form.check()) {
      console.log('Form has errors.');
      console.log(formErrors);
      return;
    }
  };

  return (
    <div>
      <h2>Ballot for {ballot.title}</h2>
      <p>
        Elect a candidate for{' '}
        {ballot.positions.map((pos) => pos.title).join(', ')}.
      </p>
      <br />
      <Form
        onChange={(newData) => setFormData(newData)}
        onCheck={(newErrors) => validate(newErrors)}
        formValue={formData}
        formError={formErrors}
        ref={(ref: any) => (form = ref)}
        fluid
      >
        {ballot.positions.map((pos, index) => (
          <FormGroup key={index}>
            <Divider>
              <h3>{pos.title}</h3>
            </Divider>
            <br />
            <h5>Position Description:</h5>
            <p>{pos.description}</p>
            <br />
            <h5>Candidates:</h5>
            <FlexboxGrid justify="space-around">
              {pos.candidates.map((candidate, index) => (
                <FlexboxGrid.Item key={index}>
                  <CandidateInfo candidate={candidate} />
                </FlexboxGrid.Item>
              ))}
            </FlexboxGrid>
            <br />
            <h5>Choose the candidate: </h5>
            <FormControl name={pos.id} accepter={RadioGroup} required>
              <FlexboxGrid justify="space-around">
                {pos.candidates.map((candidate, index) => (
                  <FlexboxGrid.Item key={index}>
                    <Radio value={candidate.id}>{candidate.user.name}</Radio>
                  </FlexboxGrid.Item>
                ))}
                <FlexboxGrid.Item>
                  <Radio value={`abstain`}>abstain</Radio>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FormControl>
          </FormGroup>
        ))}
        <ButtonToolbar>
          <Divider />
          <Button
            appearance="primary"
            type="submit"
            onClick={() => submitBallot()}
          >
            Submit
          </Button>
          <Button>Cancel</Button>
        </ButtonToolbar>
      </Form>
    </div>
  );
}
