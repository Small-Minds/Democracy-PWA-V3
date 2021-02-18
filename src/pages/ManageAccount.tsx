import React, { Fragment } from 'react';
import { useContext } from 'react';
import Gravatar from 'react-gravatar';
import { useHistory } from 'react-router-dom';
import { Avatar, Button } from 'rsuite';
import { User } from '../utils/api/User';

export default function ManageAccount() {
  const user = useContext(User);
  const history = useHistory();
  return (
    <Fragment>
      <h1>Account</h1>
      <p>Update or delete your Democracy account.</p>
      <br />
      <Avatar style={{ marginTop: 20, marginBottom: 20 }}>
        <Gravatar email={user?.user.email} size={40} rating="pg" />
      </Avatar>
      <br />
      <Button
        onClick={() => {
          window.location.href = `https://en.gravatar.com/`;
        }}
        primary
      >
        Change profile image with Gravatar
      </Button>
    </Fragment>
  );
}
