import React from 'react';
import { connect } from 'react-redux';
import LoggedIn from '../../components/Sidebar/LoggedIn';
import { loggedInUserIdSelector } from '../../redux/selectors/auth';
import { memberOfInstances } from '../../redux/selectors/instances';
import { studentOfSelector, supervisorOfSelector } from '../../redux/selectors/groups';
import { notificationsSelector } from '../../redux/selectors/users';

const mapStateToProps = state => {
  const userId = loggedInUserIdSelector(state);
  return {
    instances: memberOfInstances(userId)(state),
    studentOf: studentOfSelector(userId)(state),
    supervisorOf: supervisorOfSelector(userId)(state),
    notifications: notificationsSelector(state)
  };
};

export default connect(mapStateToProps)(LoggedIn);
