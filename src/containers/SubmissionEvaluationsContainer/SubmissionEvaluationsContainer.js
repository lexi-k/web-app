import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchSubmissionEvaluationsForSolution } from '../../redux/modules/submissionEvaluations';
import { getSubmissionEvaluationsByIdsSelector } from '../../redux/selectors/submissionEvaluations';
import ResourceRenderer from '../../components/helpers/ResourceRenderer';
import ReferenceSolutionEvaluations from '../../components/ReferenceSolutions/ReferenceSolutionEvaluations';

class SubmissionEvaluationsContainer extends Component {
  componentWillMount() {
    SubmissionEvaluationsContainer.loadData(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.submissionId !== newProps.submissionId) {
      SubmissionEvaluationsContainer.loadData(newProps);
    }
  }

  static loadData = ({ fetchEvaluationsOnLoad }) => {
    fetchEvaluationsOnLoad();
  };

  render() {
    const { submissionId, assignmentId, evaluations } = this.props;

    return (
      <ResourceRenderer resource={evaluations.toArray()}>
        {(...evaluations) =>
          <ReferenceSolutionEvaluations
            referenceSolutionId={submissionId}
            evaluations={evaluations}
            exerciseId={assignmentId}
          />}
      </ResourceRenderer>
    );
  }
}

SubmissionEvaluationsContainer.propTypes = {
  submissionId: PropTypes.string.isRequired,
  submission: PropTypes.object.isRequired,
  assignmentId: PropTypes.string.isRequired,
  evaluations: ImmutablePropTypes.map,
  fetchEvaluationsOnLoad: PropTypes.func.isRequired
};

export default connect(
  (state, { submission }) => ({
    evaluations: getSubmissionEvaluationsByIdsSelector(submission.submissions)(
      state
    )
  }),
  (dispatch, { submissionId }) => ({
    fetchEvaluationsOnLoad: () =>
      dispatch(fetchSubmissionEvaluationsForSolution(submissionId))
  })
)(SubmissionEvaluationsContainer);
