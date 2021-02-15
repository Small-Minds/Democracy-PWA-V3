import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Dropdown,
  Navbar,
  Icon,
  Nav,
  Notification,
  FlexboxGrid,
  Avatar,
} from 'rsuite';
import DropdownMenuItem from 'rsuite/lib/Dropdown/DropdownMenuItem';
import { clearTokens } from '../utils/API';
import { getUserInfo, User, UserInfo } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import LanguagePicker from './LanguagePicker';

function AccountMenu() {
  const ctx = useContext(Credentials);
  const history = useHistory();
  const [t] = useTranslation();
  const user = useContext(User);

  /**
   * Extracts initials from the present userInfo
   */
  const initials = (): string => {
    if (!user || !user.user.name) return '';
    const elems = user.user.name.split(' ');
    if (elems.length == 1) {
      return elems[0].charAt(0).toUpperCase();
    } else if (elems.length >= 2) {
      return (
        elems[0].charAt(0).toUpperCase() + elems[1].charAt(0).toUpperCase()
      );
    }
    return '';
  };

  return (
    <Dropdown
      placement="bottomEnd"
      renderTitle={() => (
        <Avatar style={{ margin: 7, marginLeft: 2, marginRight: 2 }}>
          {/** Render initials or avatar as fallback */}
          <b>{initials() || <Icon icon="avatar" />}</b>
        </Avatar>
      )}
    >
      <Dropdown.Item panel style={{ padding: 10 }}>
        <p>
          <b>{user?.user.name}</b>
        </p>
        <p>{user?.user.email}</p>
      </Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item
        icon={<Icon icon="gear-circle" />}
        onSelect={() => {
          history.push('/account');
        }}
      >
        Account Setting
      </Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item
        icon={<Icon icon="sign-out" />}
        onSelect={() => {
          clearTokens();
          if (!ctx) return;
          ctx.setCredentials({
            authenticated: false,
            token: '',
            tokenExpiry: undefined,
            refreshToken: '',
            refreshTokenExpiry: undefined,
          });
          history.push('/');
          Notification['success']({
            title: t('mainPage.logoutSuccessTitle'),
            description: t('mainPage.logoutSuccessDescription'),
          });
        }}
      >
        {t('mainPage.logoutButton')}
      </Dropdown.Item>
    </Dropdown>
  );
}

function Navigation() {
  const ctx = useContext(Credentials);
  const [t, i18n] = useTranslation();
  const history = useHistory();
  const location = useLocation();

  return (
    <Navbar>
      <Navbar.Body style={{ maxWidth: '800px', margin: '0 auto' }}>
        {ctx && ctx?.credentials.authenticated && (
          <Nav
            appearance="subtle"
            activeKey={location.pathname}
            onSelect={(key: string) => history.push(key)}
            className="democracy-nav"
          >
            <Nav.Item eventKey="/" icon={<Icon icon="home" />}>
              {t('mainPage.homeLink')}
            </Nav.Item>
            <Nav.Item eventKey="/vote" icon={<Icon icon="check2" />}>
              {t('mainPage.voteLink')}
            </Nav.Item>
            <Nav.Item eventKey="/setup" icon={<Icon icon="gears2" />}>
              {t('mainPage.setupLink')}
            </Nav.Item>
          </Nav>
        )}
        <Nav pullRight>
          <LanguagePicker />
          {ctx && ctx.credentials.authenticated && <AccountMenu />}
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}

export default Navigation;
