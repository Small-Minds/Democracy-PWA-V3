import React, { Fragment } from 'react';
import { useContext } from 'react';
import Gravatar from 'react-gravatar';
import { useHistory } from 'react-router-dom';
import { Button } from 'rsuite';
import { User } from '../utils/api/User';

export default function ManageAccount() {
  const user = useContext(User);
  const history = useHistory();
  return (
    <Fragment>
      <h1>Account</h1>
      <p>Update or delete your Democracy account.</p>
      <br />
      <p>
      <Gravatar email={user?.user.email}/>
      <br />
      <Button onClick={()=>{window.location.href=`https://en.gravatar.com/`}}>manage you accout with gravatar</Button>
      </p>
    </Fragment>
  );
}
