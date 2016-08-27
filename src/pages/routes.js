import React from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { DASHBOARD_URI, LOGIN_URI } from '../links';
import { isLoggedIn } from '../redux/selectors/auth';

/* container components */
import LayoutContainer from '../containers/LayoutContainer';
import App from '../containers/App';
import Dashboard from './Dashboard';
import Home from './Home';
import Group from './Group';
import instance from './Instance';
import Login from './Login';
import Assignment from './Assignment';
import NotFound from './NotFound';
import Submission from './Submission';
import Registration from './Registration';
import User from './User';

import SourceCodeViewerContainer from '../containers/SourceCodeViewerContainer';

const createRoutes = (getState) => {
  const requireAuth = (nextState, replace) => {
    if (!isLoggedIn(getState())) {
      replace(LOGIN_URI);
    }
  };

  const onlyUnauth = (nextState, replace) => {
    if (isLoggedIn(getState())) {
      replace(DASHBOARD_URI);
    }
  };

  return (
    <Route path='/:lang' component={LayoutContainer}>
      <IndexRoute component={Home} />
      <Route path='login' component={Login} onEnter={onlyUnauth} />
      <Route path='registration' component={Registration} onEnter={onlyUnauth} />
      <Route path='app' onEnter={requireAuth} component={App}>
        <IndexRoute component={Dashboard} />
        <Route path='assignment/:assignmentId' component={Assignment} />
        <Route path='assignment/:assignmentId/submission/:submissionId' component={Submission}>
          <Route path='file/:fileId' component={SourceCodeViewerContainer} />
        </Route>
        <Route path='group/:groupId' component={Group} />
        <Route path='instance/:instanceId' component={instance} />
        <Route path='user/:userId' component={User} />
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  );
};

export default createRoutes;
