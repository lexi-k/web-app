
export const linksFactory = lang => {
  const prefix = `/${lang}`;

  // basic links
  const HOME_URI = prefix;
  const DASHBOARD_URI = `${prefix}/app`;
  const LOGIN_URI = `${prefix}/login`;
  const REGISTRATION_URI = `${prefix}/registration`;
  const LOGOUT_URI = '/logout';
  const RESET_PASSWORD_URI = `${prefix}/forgotten-password`;

  // instance detail
  const INSTANCE_URI_FACTORY = (id) => `${prefix}/app/instance/${id}`;

  // group details
  const GROUP_URI_FACTORY = (id) => `${prefix}/app/group/${id}`;
  const GROUP_EDIT_URI_FACTORY = (id) => `${GROUP_URI_FACTORY(id)}/edit`;

  // user details
  const USER_URI_FACTORY = (id) => `${prefix}/app/user/${id}`;
  const EDIT_USER_URI_FACTORY = (id) => `${USER_URI_FACTORY(id)}/edit`;

  // exercise details
  const EXERCISES_URI = `${prefix}/app/exercises`;
  const EXERCISE_CREATE_URI_FACTORY = () => `${EXERCISES_URI}`;
  const EXERCISE_URI_FACTORY = (id) => `${EXERCISES_URI}/${id}`;
  const EXERCISE_EDIT_URI_FACTORY = (id) => `${EXERCISE_URI_FACTORY(id)}/edit`;

  // assignments and solution submissions
  const ASSIGNMENT_DETAIL_URI_FACTORY = (id) => `${prefix}/app/assignment/${id}`;
  const ASSIGNMENT_DETAIL_SPECIFIC_USER_URI_FACTORY = (id, userId) => `${ASSIGNMENT_DETAIL_URI_FACTORY(id)}/user/${userId}`;
  const ASSIGNMENT_EDIT_URI_FACTORY = (id) => `${ASSIGNMENT_DETAIL_URI_FACTORY(id)}/edit`;
  const SUBMIT_SOLUTION_URI_FACTORY = (id) =>
    `${prefix}/app/assignment/${id}/submit`;
  const SUBMISSION_DETAIL_URI_FACTORY = (assignmentId, submissionId) =>
    `${prefix}/app/assignment/${assignmentId}/submission/${submissionId}`;
  const SUPERVISOR_STATS_URI_FACTORY = (assignmentId) =>
    `${prefix}/app/assignment/${assignmentId}/stats`;
  const SOURCE_CODE_DETAIL_URI_FACTORY = (assignmentId, submissionId, fileId) =>
    `${prefix}/app/assignment/${assignmentId}/submission/${submissionId}/file/${fileId}`;

  // external links
  const BUGS_URL = 'https://www.github.com/recodex/web-app/issues';

  // administration
  const ADMIN_URI = `${prefix}/admin`;
  const ADMIN_INSTANCES_URI = `${ADMIN_URI}/instances`;
  const ADMIN_EDIT_INSTANCE_URI_FACTORY = (instanceId) => `${ADMIN_INSTANCES_URI}/${instanceId}/edit`;

  return {
    HOME_URI, DASHBOARD_URI, LOGIN_URI, REGISTRATION_URI, LOGOUT_URI, RESET_PASSWORD_URI,
    INSTANCE_URI_FACTORY, GROUP_URI_FACTORY, GROUP_EDIT_URI_FACTORY,
    USER_URI_FACTORY, EDIT_USER_URI_FACTORY,
    EXERCISES_URI, EXERCISE_URI_FACTORY, EXERCISE_EDIT_URI_FACTORY, EXERCISE_CREATE_URI_FACTORY,
    ASSIGNMENT_EDIT_URI_FACTORY, ASSIGNMENT_DETAIL_URI_FACTORY, ASSIGNMENT_DETAIL_SPECIFIC_USER_URI_FACTORY,
    SUBMIT_SOLUTION_URI_FACTORY,
    SUBMISSION_DETAIL_URI_FACTORY, SUPERVISOR_STATS_URI_FACTORY, SOURCE_CODE_DETAIL_URI_FACTORY,
    BUGS_URL,
    ADMIN_INSTANCES_URI, ADMIN_EDIT_INSTANCE_URI_FACTORY
  };
};

const removeFirstSegment = (url) =>
  url.substr(1).indexOf('/') === -1
    ? '/'
    : url.substr(url.substr(1).indexOf('/') + 1);

export const changeLanguage = (url, lang) =>
  `/${lang}${removeFirstSegment(url)}`;

export const extractLanguageFromUrl = (url) => {
  url = url.substr(0, 1) === '/' ? url.substr(1) : url; // trim leading slash
  return url.substr(0, url.indexOf('/'));
};

export const isAbsolute = (url) => url.match('^(https?:)?//.+');
