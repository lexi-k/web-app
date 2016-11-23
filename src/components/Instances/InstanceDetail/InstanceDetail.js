import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Box from '../../AdminLTE/Box';
import GroupTree from '../../Groups/GroupTree';

const InstanceDetail = ({
  description,
  topLevelGroups,
  groups,
  isAdmin
}) => (
  <Row>
    <Col md={6}>
      <Box title={<FormattedMessage id='app.instance.detailTitle' defaultMessage='Instance description' />}>
        <ReactMarkdown source={description} />
      </Box>
    </Col>
    <Col md={6}>
      <Box title={<FormattedMessage id='app.instance.groupsTitle' defaultMessage='Groups hierarchy' />}>
        <div>
          {topLevelGroups.map(id =>
            <GroupTree
              key={id}
              id={id}
              isAdmin={isAdmin}
              groups={groups} />)}

          {topLevelGroups.length === 0 && (
            <FormattedMessage id='app.instance.groups.noGroups' defaultMessage='There are no groups in this ReCodEx instance.' />
          )}
        </div>
      </Box>
    </Col>
  </Row>
);

InstanceDetail.propTypes = {
  description: PropTypes.string.isRequired,
  topLevelGroups: PropTypes.array.isRequired,
  groups: ImmutablePropTypes.map.isRequired,
  isAdmin: PropTypes.bool
};

export default InstanceDetail;
