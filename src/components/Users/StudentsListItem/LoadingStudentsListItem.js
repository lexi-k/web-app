import React, { PropTypes } from 'react';
import { LoadingUsersName } from '../../Users/UsersName';

const LoadingStudentsListItem = ({ withActions }) => (
  <tr>
    <td colSpan={withActions ? 4 : 3}>
      <LoadingUsersName />
    </td>
  </tr>
);

LoadingStudentsListItem.propTypes = {
  withActions: PropTypes.bool
};

export default LoadingStudentsListItem;
