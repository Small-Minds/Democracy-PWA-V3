import React, { Fragment, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, FlexboxGrid, Icon, IconButton } from 'rsuite';

const ReturnToLogin: FC<{ msg: string }> = ({ msg }) => {
  const [t] = useTranslation();
  const history = useHistory();

  return (
    <FlexboxGrid align="middle" justify="center" style={{ height: '50vh' }}>
      <FlexboxGrid.Item>
        <div style={{ textAlign: 'center' }}>
          <br />
          <h2>{msg}</h2>
          <br />
          <br />
          <br />
          <IconButton
            appearance="primary"
            size="lg"
            icon={<Icon icon="arrow-right-line" />}
            onClick={() => {
              history.push('/');
            }}
          >
            Return to Login and Signup Page
          </IconButton>
          <br />
        </div>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default ReturnToLogin;
