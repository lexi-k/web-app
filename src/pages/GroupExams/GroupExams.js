import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Page from '../../components/layout/Page';
import { GroupNavigation } from '../../components/layout/Navigation';
import Box from '../../components/widgets/Box';
import GroupArchivedWarning from '../../components/Groups/GroupArchivedWarning';
import GroupExamsTable from '../../components/Groups/GroupExamsTable';
import GroupExamStatus from '../../components/Groups/GroupExamStatus';
import LockedStudentsTable from '../../components/Groups/LockedStudentsTable';
import { GroupExamsIcon } from '../../components/icons';

import { fetchGroup, fetchGroupIfNeeded, setExamPeriod, removeExamPeriod } from '../../redux/modules/groups';
import { fetchByIds } from '../../redux/modules/users';
import { addNotification } from '../../redux/modules/notifications';
import { groupSelector, groupDataAccessorSelector, groupTypePendingChange } from '../../redux/selectors/groups';
import { lockedStudentsOfGroupSelector } from '../../redux/selectors/usersGroups';
import { loggedInUserIdSelector } from '../../redux/selectors/auth';
import { isLoggedAsSuperAdmin, loggedInUserSelector } from '../../redux/selectors/users';

import withLinks from '../../helpers/withLinks';
import { hasPermissions, safeGet } from '../../helpers/common';

const isExam = ({ privateData: { examBegin, examEnd } }) => {
  const now = Date.now() / 1000;
  return examBegin && examEnd && examEnd > now && examBegin <= now;
};

class GroupExams extends Component {
  static loadAsync = ({ groupId }, dispatch) =>
    Promise.all([
      dispatch(fetchGroupIfNeeded(groupId)).then(({ value: group }) =>
        hasPermissions(group, 'viewStudents')
          ? dispatch(fetchByIds(safeGet(group, ['privateData', 'students']) || []))
          : Promise.resolve()
      ),
    ]);

  componentDidMount() {
    this.props.loadAsync();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.groupId !== prevProps.params.groupId) {
      this.props.loadAsync();
    }
  }

  linkFactory = id => {
    const {
      params: { groupId, examId = null },
      links: { GROUP_EXAMS_URI_FACTORY, GROUP_EXAMS_SPECIFIC_EXAM_URI_FACTORY },
    } = this.props;
    return String(id) === String(examId)
      ? GROUP_EXAMS_URI_FACTORY(groupId)
      : GROUP_EXAMS_SPECIFIC_EXAM_URI_FACTORY(groupId, id);
  };

  render() {
    const {
      params: { examId = null },
      group,
      lockedStudents,
      currentUser,
      groupsAccessor,
      examBeginImmediately,
      examEndRelative,
      setExamPeriod,
      removeExamPeriod,
      addNotification,
      links: { GROUP_EDIT_URI_FACTORY },
    } = this.props;

    return (
      <Page
        resource={[group, currentUser]}
        icon={<GroupExamsIcon />}
        title={<FormattedMessage id="app.groupExams.title" defaultMessage="Group Exam Terms" />}>
        {(group, currentUser) => (
          <div>
            {group.privateData && <GroupNavigation group={group} />}

            <GroupArchivedWarning {...group} groupsDataAccessor={groupsAccessor} linkFactory={GROUP_EDIT_URI_FACTORY} />

            <Row>
              <Col xs={12} xl={6}>
                <GroupExamStatus
                  group={group}
                  currentUser={currentUser}
                  examBeginImmediately={examBeginImmediately}
                  examEndRelative={examEndRelative}
                  setExamPeriod={setExamPeriod}
                  removeExamPeriod={removeExamPeriod}
                  addNotification={addNotification}
                />
              </Col>

              <Col xs={12} xl={6}>
                <Box
                  title={<FormattedMessage id="app.groupExams.listBoxTitle" defaultMessage="Previous exams" />}
                  noPadding
                  unlimitedHeight>
                  <GroupExamsTable
                    exams={group.privateData.exams}
                    selected={isExam(group) ? null : examId}
                    linkFactory={isExam(group) ? null : this.linkFactory}
                  />
                </Box>
              </Col>
            </Row>

            {(examId || isExam(group)) && hasPermissions(group, 'viewStudents', 'setExamPeriod') && (
              <Row>
                <Col xs={12}>
                  <Box
                    title={
                      <FormattedMessage id="app.groupExams.studentsBoxTitle" defaultMessage="Participating students" />
                    }
                    noPadding
                    unlimitedHeight>
                    {isExam(group) ? (
                      <LockedStudentsTable
                        groupId={group.id}
                        lockedStudents={lockedStudents}
                        currentUser={currentUser}
                      />
                    ) : (
                      examId
                    )}
                  </Box>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Page>
    );
  }
}

GroupExams.propTypes = {
  links: PropTypes.object.isRequired,
  loadAsync: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  params: PropTypes.shape({
    groupId: PropTypes.string.isRequired,
    examId: PropTypes.number,
  }).isRequired,
  group: ImmutablePropTypes.map,
  currentUser: ImmutablePropTypes.map,
  lockedStudents: PropTypes.array,
  groupsAccessor: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool,
  examBeginImmediately: PropTypes.bool,
  examEndRelative: PropTypes.bool,
  examPendingChange: PropTypes.bool,
  setExamPeriod: PropTypes.func.isRequired,
  removeExamPeriod: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const examFormSelector = formValueSelector('exam');

export default withLinks(
  connect(
    (state, { params: { groupId } }) => ({
      group: groupSelector(state, groupId),
      groupsAccessor: groupDataAccessorSelector(state),
      lockedStudents: lockedStudentsOfGroupSelector(state, groupId),
      userId: loggedInUserIdSelector(state),
      currentUser: loggedInUserSelector(state),
      isSuperAdmin: isLoggedAsSuperAdmin(state),
      examBeginImmediately: examFormSelector(state, 'beginImmediately'),
      examEndRelative: examFormSelector(state, 'endRelative'),
      examPendingChange: groupTypePendingChange(state, groupId),
    }),
    (dispatch, { params: { groupId, examId } }) => ({
      loadAsync: () => GroupExams.loadAsync({ groupId, examId }, dispatch),
      reload: () => dispatch(fetchGroup(groupId)),
      addNotification: (...args) => dispatch(addNotification(...args)),
      setExamPeriod: (begin, end, strict) => dispatch(setExamPeriod(groupId, begin, end, strict)),
      removeExamPeriod: () => dispatch(removeExamPeriod(groupId)),
    })
  )(GroupExams)
);
