import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import {
  Col,
  Container,
  Content,
  FlexboxGrid,
  Icon,
  IconButton,
  Notification,
} from 'rsuite';
import './App.css';
import InfoModal from './components/InfoModal';
import Navigation from './components/Navigation';
import Election from './pages/Election';
import EmptyPage from './pages/Empty';
import Base from './pages/Home';
import HomeSetup from './pages/HomeSetup';
import HomeVote from './pages/HomeVote';
import Info from './pages/Landing';
import Loading from './pages/Loading';
import ManageAccount from './pages/ManageAccount';
import PositionApply from './pages/PositionApply';
import ReturnToLogin from './pages/ReturnToLogin';
import Vote from './pages/Vote';
import { getAccessToken, getRefreshToken, isAuthenticated } from './utils/API';
import { alive } from './utils/api/Alive';
import { blankUserInfo, getUserInfo, User, UserInfo } from './utils/api/User';
import {
  blankCredentialData,
  CredentialData,
  Credentials,
} from './utils/Authentication';

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
  const [info, showInfo] = useState<boolean>(false);
  //Set Up Localization Hook
  const [t] = useTranslation();
  const history = useHistory();

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
      return;
    }

    getUserInfo()
      .then((res) => setUser(res))
      .catch((err) => {
        console.log('Could not get user info.');
        setUser(blankUserInfo);
      });
  }, [credentials]);

  // Set Page Title
  useEffect(() => {
    document.title = t('general.app.name');
  }, [t, user, credentials]);

  // Check if backend is up by calling 'alive' endpoint when app starts.
  useEffect(() => {
    alive().catch((err) => {
      console.error(err);
    });
  }, []);

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
                  style={{ maxWidth: '800px', padding: 10 }}
                >
                  <Container>
                    <br />
                    <Content style={{ minHeight: '70vh' }}>
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
                            <Route path="/election/:id/vote" component={Vote} />
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
                            <Route
                              path="/email-verified"
                              component={() => (
                                <ReturnToLogin
                                  title={t(
                                    'emailVerification.title.emailVerified'
                                  )}
                                />
                              )}
                            />
                            <Route
                              path="/email-already-verified"
                              component={() => (
                                <ReturnToLogin
                                  title={t(
                                    'emailVerification.title.emailAlreadyVerified'
                                  )}
                                />
                              )}
                            />
                            <Route
                              path="/email-verification-error"
                              component={() => (
                                <ReturnToLogin
                                  title={t(
                                    'emailVerification.title.emailVerificationError'
                                  )}
                                  subtitle={t(
                                    'emailVerification.subtitle.emailVerificationError'
                                  )}
                                />
                              )}
                            />
                            <Route path="/" component={Info} />
                          </Switch>
                        </Fragment>
                      )}
                    </Content>
                    <InfoModal open={info} setOpen={showInfo} />
                    <FlexboxGrid justify="center" align="middle">
                      <FlexboxGrid.Item>
                        <IconButton
                          appearance="subtle"
                          size="lg"
                          icon={<Icon icon="info-circle" />}
                          onClick={() => showInfo(true)}
                        ></IconButton>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
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
