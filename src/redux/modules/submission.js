import { fromJS } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import { createApiAction } from '../middleware/apiMiddleware';

export const submissionStatus = {
  NONE: 'NONE',
  CREATING: 'CREATING',
  SENDING: 'SENDING',
  FAILED: 'FAILED',
  PROCESSING: 'PROCESSING',
  FINISHED: 'FINISHED'
};

export const actionTypes = {
  INIT: 'recodex/submission/INIT',
  CANCEL: 'recodex/submission/CANCEL',
  CHANGE_NOTE: 'recodex/submission/CHANGE_NOTE',
  UPLOAD: 'recodex/submission/UPLOAD',
  UPLOAD_PENDING: 'recodex/submission/UPLOAD_PENDING',
  UPLOAD_FULFILLED: 'recodex/submission/UPLOAD_FULFILLED',
  UPLOAD_FAILED: 'recodex/submission/UPLOAD_REJECTED',
  REMOVE_FILE: 'recodex/submission/REMOVE_FILE',
  RETURN_FILE: 'recodex/submission/RETURN_FILE',
  REMOVE_FAILED_FILE: 'recodex/submission/REMOVE_FAILED_FILE',
  SUBMIT: 'recodex/submission/SUBMIT',
  SUBMIT_PENDING: 'recodex/submission/SUBMIT_PENDING',
  SUBMIT_FULFILLED: 'recodex/submission/SUBMIT_FULFILLED',
  SUBMIT_REJECTED: 'recodex/submission/SUBMIT_REJECTED',
  PROCESSING_FINISHED: 'recodex/submission/PROCESSING_FINISHED'
};

export const initialState = fromJS({
  submissionId: null,
  userId: null,
  assignmentId: null,
  submittedOn: null,
  note: '',
  files: {
    uploading: [],
    failed: [],
    removed: [],
    uploaded: []
  },
  monitor: null,
  status: submissionStatus.NONE,
  warningMsg: null
});

/**
 * Actions
 */

export const init = createAction(
  actionTypes.INIT,
  (userId, assignmentId) => ({ userId, assignmentId })
);
export const cancel = createAction(actionTypes.CANCEL);

export const changeNote = createAction(actionTypes.CHANGE_NOTE);

export const uploadFile = file =>
  createApiAction({
    type: actionTypes.UPLOAD,
    method: 'POST',
    endpoint: '/uploaded-files',
    body: { [file.name]: file },
    meta: { fileName: file.name }
  });

const wrapWithName = file => ({ [file.name]: file });
export const addFile = createAction(actionTypes.UPLOAD_PENDING, wrapWithName, file => ({ fileName: file.name }));
export const removeFile = createAction(actionTypes.REMOVE_FILE);
export const returnFile = createAction(actionTypes.RETURN_FILE);
export const removeFailedFile = createAction(actionTypes.REMOVE_FAILED_FILE);
export const uploadSuccessful = createAction(actionTypes.UPLOAD_FULFILLED);
export const uploadFailed = createAction(actionTypes.UPLOAD_FAILED, wrapWithName, file => ({ fileName: file.name }));

export const submitSolution = (assignmentId, note, files) =>
  createApiAction({
    type: actionTypes.SUBMIT,
    method: 'POST',
    endpoint: `/exercise-assignments/${assignmentId}/submit`,
    body: { files: files.map(file => file.id), note }
  });

export const finishProcessing = createAction(actionTypes.PROCESSING_FINISHED);

/**
 * Reducer takes mainly care about all the state of individual attachments
 */

const reducer = handleActions({
  [actionTypes.INIT]: (state, { payload: { userId, assignmentId } }) =>
    initialState
      .set('userId', userId)
      .set('assignmentId', assignmentId)
      .set('status', submissionStatus.CREATING),

  [actionTypes.CHANGE_NOTE]: (state, { payload }) =>
    state.set('note', payload).set('status', submissionStatus.CREATING),

  [actionTypes.UPLOAD_PENDING]: (state, { payload, meta: { fileName } }) =>
    state
      .set('status', submissionStatus.CREATING)
      .updateIn([ 'files', 'uploading' ], list => list.push({ name: fileName, file: payload[fileName] }))
      .updateIn([ 'files', 'failed' ], list => list.filter(item => item.name !== payload.name))
      .updateIn([ 'files', 'removed' ], list => list.filter(item => item.name !== payload.name))
      .updateIn([ 'files', 'uploaded' ], list => list.filter(item => item.name !== payload.name)),

  [actionTypes.REMOVE_FILE]: (state, { payload }) =>
    state
      .set('status', submissionStatus.CREATING)
      .updateIn([ 'files', 'uploaded' ], list => list.filter(item => item.name !== payload.name))
      .updateIn([ 'files', 'removed' ], list => list.push(payload)),

  [actionTypes.RETURN_FILE]: (state, { payload }) =>
    state
      .set('status', submissionStatus.CREATING)
      .updateIn([ 'files', 'removed' ], list => list.filter(item => item.name !== payload.name))
      .updateIn([ 'files', 'uploaded' ], list => list.push(payload)),

  [actionTypes.REMOVE_FAILED_FILE]: (state, { payload }) =>
    state
      .set('status', submissionStatus.CREATING)
      .updateIn([ 'files', 'failed' ], list => list.filter(item => item.name !== payload.name)),

  [actionTypes.UPLOAD_FULFILLED]: (state, { payload }) =>
    state
      .updateIn([ 'files', 'uploading' ], list => list.filter(item => item.name !== payload.name))
      .updateIn([ 'files', 'uploaded' ], list => list.push({ name: payload.name, file: payload })),

  [actionTypes.UPLOAD_FAILED]: (state, { meta: { fileName } }) => {
    const file = state.getIn([ 'files', 'uploading' ]).find(item => item.name === fileName);
    return state
      .set('status', submissionStatus.FAILED)
      .updateIn([ 'files', 'uploading' ], list => list.filter(item => item.name !== fileName))
      .updateIn([ 'files', 'failed' ], list => list.push(file));
  },

  [actionTypes.SUBMIT_PENDING]: (state) =>
    state.set('status', submissionStatus.SENDING),

  [actionTypes.SUBMIT_REJECTED]: (state) =>
    state.set('status', submissionStatus.FAILED),

  [actionTypes.SUBMIT_FULFILLED]: (state, { payload }) =>
    state
      .set('submissionId', payload.submission.id)
      .set('monitor', {
        url: payload.webSocketChannel.monitorUrl,
        id: payload.webSocketChannel.id
      })
      .set('status', submissionStatus.PROCESSING),

  [actionTypes.CANCEL]: (state, { payload }) =>
    initialState,

  [actionTypes.PROCESSING_FINISHED]: (state, { payload }) =>
    state.set('status', submissionStatus.FINISHED)

}, initialState);

export default reducer;
