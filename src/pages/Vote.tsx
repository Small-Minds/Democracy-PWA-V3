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
  const msg_required = 'This field is required';
  const model = Schema.Model({
    personalStatement: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    personalStatement: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const [ballot, setBallot] = useState<EmptyBallot>();

  useEffect(() => {
    //Return early if no context is provided.
    if (!ctx || !ctx.credentials.authenticated) return;
    //If logged in, attempt to get the position details
    getEmptyBallot(id).then((value: EmptyBallot) => {
      setBallot(value);
    })
  }, []);

  // While we fetch the ballot, show the spinner.
  if (!ballot)
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  
  const submitBallot = () => {
    console.log(ballot);
  }

  return (
    <div>
      <h2>Ballot for {ballot.title}</h2>
      <p>
        Elect a candidate for{' '}
        {ballot.positions.map((pos) => pos.title).join(', ')}.
      </p>
      <br />
      <Form>
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
            <FormControl accepter={RadioGroup} required>
              <FlexboxGrid justify="space-around">
                {pos.candidates.map((candidate, index) => (
                  <FlexboxGrid.Item key={index}>
                    <Radio value={candidate.id}>{candidate.user.name}</Radio>
                  </FlexboxGrid.Item>
                ))}
                <FlexboxGrid.Item>
                  <Radio value="">abstain</Radio>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FormControl>
          </FormGroup>
        ))}
        <ButtonToolbar>
          <Divider />
          <Button appearance="primary" type="submit" onClick={() => submitBallot()}>
            Submit
          </Button>
          <Button>Cancel</Button>
        </ButtonToolbar>
      </Form>
    </div>
  );
}
