import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
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
} from 'rsuite';
import { Position } from '../utils/api/ElectionManagement';
import {
  getPosition,
  PositionApplicationParams,
  submitPositionApplication,
} from '../utils/api/PositionApplication';
import { Credentials } from '../utils/Authentication';
import Loading from './Loading';

function PositionApply() {
  const [t] = useTranslation();
  const history = useHistory();
  let { positionId } = useParams<any>();
  const [position, setPosition] = useState<Position>();
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

  useEffect(() => {
    //Return early if no context is provided.
    if (!ctx || !ctx.credentials.authenticated) return;
    //If logged in, attempt to get the position details
    getPosition(positionId)
      .then((res) => {
        setPosition(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [positionId]);

  function submitApplication() {
    //Process form input, check for form errors
    if (!form.check()) {
      console.log('Application form has errors.');
      console.error(formErrors);
      return;
    }

    let application: PositionApplicationParams = {
      platform: formData.personalStatement,
      position: positionId,
    };
    submitPositionApplication(application)
      .then(() => {
        Notification['success']({
          title: 'Congrats',
          description: 'You have successfully submit your application',
        });
        history.goBack();
      })
      .catch((x) => {
        console.log(x.response.data);
        console.error(x);
        Notification['error']({
          title: 'Failed',
          description: 'Failed to submit your application',
        });
      });
  }
  return (
    <div>
      {position ? (
        <div>
          <h1>{position.title}</h1>
          <br />
          <h4>Position Description</h4>
          <p>{position.description}</p>
          <br />
          <h4>Application Form</h4>
          <Form
            onChange={(newData) => setFormData(newData)}
            onCheck={(newErrors) => setFormErrors(newErrors)}
            formValue={formData}
            formError={formErrors}
            model={model}
            ref={(ref: any) => (form = ref)}
            fluid
          >
            <FormGroup>
              <ControlLabel>Personal Statement</ControlLabel>
              <FormControl
                row={5}
                name="personalStatement"
                componentClass="textarea"
              />
            </FormGroup>
            <ButtonToolbar>
              <Button appearance="primary" onClick={() => submitApplication()}>
                Submit
              </Button>
              <Button onClick={() => history.goBack()}>Cancel</Button>
            </ButtonToolbar>
          </Form>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default PositionApply;
