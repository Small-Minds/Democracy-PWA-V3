import React, { Fragment, useEffect, useState } from 'react';
import {
  Credentials,
  CredentialData,
  blankCredentialData,
} from './utils/Authentication';
import { getAccessToken, getRefreshToken, isAuthenticated } from './utils/API';
import { useTranslation } from 'react-i18next';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Loading from './pages/Loading';
import Base from './pages/Home';
import Info from './pages/Landing';
import Navigation from './components/Navigation';
import EmptyPage from './pages/Empty';
import Election from './pages/Election';
import { Col, Container, Content, FlexboxGrid } from 'rsuite';
import HomeVote from './pages/HomeVote';
import HomeSetup from './pages/HomeSetup';
import './App.css';
import { User, UserInfo, blankUserInfo, getUserInfo } from './utils/api/User';
import PositionApply from './pages/PositionApply';
import ManageAccount from './pages/ManageAccount';

/**
 * Parent for the entire application.
 * Contains the router and credential provider.
 */
function App() {
  // When the app first starts, it is unauthenticated.
  const [credentials, setCredentials] = useState<CredentialData>(
    blankCredentialData
  );
  const [user, setUser] = useState<UserInfo>(blankUserInfo);
  // If processing credentials, be working.
  const [working, setWorking] = useState<boolean>(true);
  //Set Up Localization Hook
  const [t] = useTranslation();

  // Load JWTs and validate.
  useEffect(() => {
    if (credentials.authenticated === undefined) {
      console.log('Checking for pre-existing credentials...');
      isAuthenticated()
        .then((b) => {
          if (b) {
            const access = getAccessToken();
            const refresh = getRefreshToken();
            const newCreds: CredentialData = {
              authenticated: true,
              token: access.token,
              tokenExpiry: access.expiry,
              refreshToken: refresh.refreshToken,
              refreshTokenExpiry: refresh.refreshTokenExpiry,
            };
            setCredentials(newCreds);
          }
        })
        .catch((err) => {
          console.log("Couldn't authenticate.");
        })
        .finally(() => {
          setWorking(false);
        });
    }
  }, [credentials]);

  // Update User Info
  useEffect(() => {
    if (!credentials) return;
    // Flush user info if unauthenticated.
    if (!credentials.authenticated) {
      setUser(blankUserInfo);
    }
    getUserInfo()
      .then((res) => setUser(res))
      .catch((err) => {
        console.error(err);
        setUser(blankUserInfo);
      });
  }, [credentials]);

  // Set Page Title
  useEffect(() => {
    document.title = t('mainPage.appName');
  }, [t]);

  return (
    <div>
      <Credentials.Provider value={{ credentials, setCredentials }}>
        <User.Provider value={{ user, setUser }}>
          {working === false ? (
            <BrowserRouter>
              <Navigation />
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item
                  componentClass={Col}
                  sm={22}
                  xs={24}
                  colspan={24}
                  style={{ maxWidth: '800px' }}
                >
                  <Container>
                    <br />
                    <Content>
                      {credentials && credentials.authenticated ? (
                        <Fragment>
                          {/* Protected Pages */}
                          <Switch>
                            <Route
                              path="/apply/:positionId"
                              component={PositionApply}
                            />
                            <Route
                              path="/election/:id/positions/:positionId"
                              component={EmptyPage}
                            />
                            <Route
                              path="/election/:id/platforms/:platformId"
                              component={EmptyPage}
                            />
                            <Route
                              path="/election/:id/vote"
                              component={EmptyPage}
                            />
                            <Route path="/election/:id" component={Election} />
                            <Route path="/account" component={ManageAccount} />
                            <Route path="/vote" component={HomeVote} />
                            <Route path="/setup" component={HomeSetup} />
                            <Route path="/" component={Base} />
                          </Switch>
                        </Fragment>
                      ) : (
                        <Fragment>
                          {/* Public Pages */}
                          <Switch>
                            <Route path="/" component={Info} />
                          </Switch>
                        </Fragment>
                      )}
                    </Content>
                    <br />
                  </Container>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </BrowserRouter>
          ) : (
            <Loading />
          )}
        </User.Provider>
      </Credentials.Provider>
      <br />
    </div>
  );
}

export default App;
