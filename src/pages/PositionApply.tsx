import { AxiosError } from 'axios';
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
  const msg_required = t('positionApplyPage.fieldIsRequiredMsg');
  const model = Schema.Model({
    platform: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    platform: '',
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
      platform: formData.platform,
      position: positionId,
    };
    submitPositionApplication(application)
      .then(() => {
        Notification['success']({
          title: t('positionApplyPage.subSuccessModalTitle'),
          description: t('positionApplyPage.subSuccessModalBody'),
        });
        history.goBack();
      })
      .catch((x: AxiosError) => {
        if (x.response && x.response.status === 406) {
          // If the code is 424,
          Notification['error']({
            title: t('positionApplyPage.subLimitationModalTitle'),
            description: t('positionApplyPage.subLimitationModalBody'),
          });
          return;
        } else if (x.response && x.response.status === 417) {
          Notification['error']({
            title: t('v2.errors.notOnWhitelist.title'),
            description: t('v2.errors.notOnWhitelist.description'),
          });
          return;
        }
        console.error(x);
        Notification['error']({
          title: t('positionApplyPage.subFailModalTitle'),
          description: t('positionApplyPage.subFailModalBody'),
        });
      });
  }
  return (
    <div>
      {position ? (
        <div>
          <h1>{position.title}</h1>
          <br />
          <h4>{t('positionApplyPage.positionSectionTitle')}</h4>
          <p>{position.description}</p>
          <br />
          <h4>{t('positionApplyPage.posAppFormTitle')}</h4>
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
              <ControlLabel>
                {t('positionApplyPage.posAppFormPlatform')}
              </ControlLabel>
              <FormControl row={5} name="platform" componentClass="textarea" />
            </FormGroup>
            <ButtonToolbar>
              <Button appearance="primary" onClick={() => submitApplication()}>
                {t('positionApplyPage.posAppFormSubBtn')}
              </Button>
              <Button onClick={() => history.goBack()}>
                {t('positionApplyPage.posAppFormCancelBtn')}
              </Button>
            </ButtonToolbar>
          </Form>
        </div>
      ) : (
        <Loading half />
      )}
    </div>
  );
}

export default PositionApply;
