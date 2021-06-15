import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Table, ButtonGroup } from 'react-bootstrap';
import { prettyPrintBytes } from '../../helpers/stringFormatters';
import Icon, { DeleteIcon } from '../../icons';
import Button from '../../widgets/TheButton';

const UploadsTable = ({
  uploadingFiles = [],
  attachedFiles = [],
  failedFiles = [],
  removedFiles = [],
  removeFile,
  returnFile,
  removeFailedFile,
  retryUploadFile,
}) => (
  <Table responsive>
    <thead>
      <tr>
        <th />
        <th>
          <FormattedMessage id="app.filesTable.fileName" defaultMessage="File Name" />
        </th>
        <th>
          <FormattedMessage id="app.filesTable.fileSize" defaultMessage="File Size" />
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      {attachedFiles.map(payload => (
        <tr key={'attached-' + payload.name}>
          <td className="text-center">
            <Icon icon="check" className="text-success text-bold" />
          </td>
          <td>{payload.name}</td>
          <td>{prettyPrintBytes(payload.file.size)}</td>
          <td>
            <Button size="xs" variant="outline-secondary" onClick={() => removeFile(payload)}>
              <DeleteIcon />
            </Button>
          </td>
        </tr>
      ))}

      {uploadingFiles.map(payload => (
        <tr key={'uploading-' + payload.name}>
          <td className="text-center">
            <Icon icon="sync" spin />
          </td>
          <td>{payload.name}</td>
          <td>{prettyPrintBytes(payload.file.size)}</td>
          <td />
        </tr>
      ))}

      {failedFiles.map(payload => (
        <tr key={'failed-' + payload.name}>
          <td className="text-center">
            <Icon icon="exclamation-triangle" className="text-danger" />
          </td>
          <td>{payload.name}</td>
          <td>{prettyPrintBytes(payload.file.size)}</td>
          <td>
            <ButtonGroup>
              <Button size="xs" variant="outline-secondary" onClick={() => removeFailedFile(payload)}>
                <DeleteIcon />
              </Button>
              <Button size="xs" variant="outline-secondary" onClick={() => retryUploadFile(payload)}>
                <Icon icon="sync" />
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      ))}

      {removedFiles.map(payload => (
        <tr key={'removed' + payload.name}>
          <td className="text-center">
            <DeleteIcon className="text-warning" />
          </td>
          <td className="text-muted">
            <strike>{payload.name}</strike>
          </td>
          <td className="text-muted">{prettyPrintBytes(payload.file.size)}</td>
          <td>
            <ButtonGroup>
              <Button size="xs" variant="outline-secondary" onClick={() => returnFile(payload)}>
                <Icon icon="sync" />
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

UploadsTable.propTypes = {
  uploadingFiles: PropTypes.array.isRequired,
  attachedFiles: PropTypes.array.isRequired,
  failedFiles: PropTypes.array.isRequired,
  removedFiles: PropTypes.array.isRequired,
  removeFile: PropTypes.func.isRequired,
  removeFailedFile: PropTypes.func.isRequired,
  retryUploadFile: PropTypes.func.isRequired,
  returnFile: PropTypes.func.isRequired,
};

export default UploadsTable;
