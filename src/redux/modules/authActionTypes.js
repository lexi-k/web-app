// action types declaration was moved outside the auth module to break cyclic import dependencies
const actionTypes = {
  LOGIN: 'recodex/auth/LOGIN',
  LOGIN_PENDING: 'recodex/auth/LOGIN_PENDING',
  LOGIN_FULFILLED: 'recodex/auth/LOGIN_FULFILLED',
  LOGIN_REJECTED: 'recodex/auth/LOGIN_REJECTED',
  RESET_PASSWORD: 'recodex/auth/RESET_PASSWORD',
  RESET_PASSWORD_PENDING: 'recodex/auth/RESET_PASSWORD_PENDING',
  RESET_PASSWORD_FULFILLED: 'recodex/auth/RESET_PASSWORD_FULFILLED',
  RESET_PASSWORD_REJECTED: 'recodex/auth/RESET_PASSWORD_REJECTED',
  CHANGE_PASSWORD: 'recodex/auth/CHANGE_PASSWORD',
  CHANGE_PASSWORD_PENDING: 'recodex/auth/CHANGE_PASSWORD_PENDING',
  CHANGE_PASSWORD_FULFILLED: 'recodex/auth/CHANGE_PASSWORD_FULFILLED',
  CHANGE_PASSWORD_REJECTED: 'recodex/auth/CHANGE_PASSWORD_REJECTED',
  LOGOUT: 'recodex/auth/LOGOUT',
  GENERATE_TOKEN: 'recodex/auth/GENERATE_TOKEN',
  GENERATE_TOKEN_FULFILLED: 'recodex/auth/GENERATE_TOKEN_FULFILLED',
  SELECT_INSTANCE: 'recodex/auth/SELECT_INSTANCE',
};

export default actionTypes;
