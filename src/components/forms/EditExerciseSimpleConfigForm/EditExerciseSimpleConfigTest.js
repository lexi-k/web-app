import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  SelectField,
  TextField,
  ExpandingTextField,
  ExpandingInputFilesField,
  CheckboxField
} from '../Fields';

const EditExerciseSimpleConfigTest = ({
  fields,
  prefix,
  supplementaryFiles,
  formValues,
  exerciseTests,
  intl
}) => {
  const supplementaryFilesOptions = [{ key: '', name: '...' }].concat(
    supplementaryFiles
      .sort((a, b) => a.name.localeCompare(b.name, intl.locale))
      .filter((item, pos, arr) => arr.indexOf(item) === pos)
      .map(data => ({
        key: data.hashName,
        name: data.name
      }))
  );
  return (
    <div>
      {fields.map((test, i) =>
        <div key={i}>
          <Row>
            <Col lg={12}>
              <h3>
                {exerciseTests[i].name}
              </h3>
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <h4>
                <FormattedMessage
                  id="app.editExerciseSimpleConfigTests.inputTitle"
                  defaultMessage="Input"
                />
              </h4>
              <Field
                name={`${test}.inputFiles`}
                component={ExpandingInputFilesField}
                options={supplementaryFilesOptions}
                leftLabel={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.inputFilesActual"
                    defaultMessage="Input file:"
                  />
                }
                rightLabel={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.inputFilesRename"
                    defaultMessage="Renamed file name:"
                  />
                }
              />
              <Field
                name={`${test}.inputStdin`}
                component={SelectField}
                options={supplementaryFilesOptions}
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.inputStdin"
                    defaultMessage="Stdin:"
                  />
                }
              />
            </Col>
            <Col lg={3}>
              <h4>
                <FormattedMessage
                  id="app.editExerciseSimpleConfigTests.executionTitle"
                  defaultMessage="Execution"
                />
              </h4>
              <Field
                name={`${test}.runArgs`}
                component={ExpandingTextField}
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.executionArguments"
                    defaultMessage="Execution arguments:"
                  />
                }
              />
            </Col>
            <Col lg={3}>
              <h4>
                <FormattedMessage
                  id="app.editExerciseSimpleConfigTests.outputTitle"
                  defaultMessage="Output"
                />
              </h4>
              <Field
                name={`${test}.useOutFile`}
                component={CheckboxField}
                onOff
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.useOutfile"
                    defaultMessage="Use output file instead of stdout"
                  />
                }
              />
              {formValues &&
                formValues.config &&
                formValues.config[i] &&
                (formValues.config[i].useOutFile === true ||
                  formValues.config[i].useOutFile === 'true') &&
                <Field
                  name={`${test}.outputFile`}
                  component={TextField}
                  label={
                    <FormattedMessage
                      id="app.editExerciseSimpleConfigTests.outputFile"
                      defaultMessage="Output file:"
                    />
                  }
                />}
              <Field
                name={`${test}.expectedOutput`}
                component={SelectField}
                options={supplementaryFilesOptions}
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.expectedOutput"
                    defaultMessage="Expected output:"
                  />
                }
              />
            </Col>
            <Col lg={3}>
              <h4>
                <FormattedMessage
                  id="app.editExerciseSimpleConfigTests.judgeTitle"
                  defaultMessage="Judge"
                />
              </h4>
              <Field
                name={`${test}.useCustomJudge`}
                component={CheckboxField}
                onOff
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.useCustomJudge"
                    defaultMessage="Use custom judge binary"
                  />
                }
              />
              {formValues &&
              formValues.config &&
              formValues.config[i] &&
              (formValues.config[i].useCustomJudge === true ||
                formValues.config[i].useCustomJudge === 'true')
                ? <Field
                    name={`${test}.customJudgeBinary`}
                    component={SelectField}
                    options={supplementaryFilesOptions}
                    label={
                      <FormattedMessage
                        id="app.editExerciseSimpleConfigTests.customJudgeBinary"
                        defaultMessage="Custom judge binary:"
                      />
                    }
                  />
                : <Field
                    name={`${test}.judgeBinary`}
                    component={SelectField}
                    options={[
                      { key: '', name: '...' },
                      {
                        key: 'recodex-judge-normal',
                        name: 'recodex-judge-normal'
                      },
                      {
                        key: 'recodex-judge-shuffle',
                        name: 'recodex-judge-shuffle'
                      }
                    ]}
                    label={
                      <FormattedMessage
                        id="app.editExerciseSimpleConfigTests.judgeBinary"
                        defaultMessage="Judge binary:"
                      />
                    }
                  />}
              <Field
                name={`${test}.judgeArgs`}
                component={TextField}
                label={
                  <FormattedMessage
                    id="app.editExerciseSimpleConfigTests.judgeArgs"
                    defaultMessage="Judge arguments:"
                  />
                }
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

EditExerciseSimpleConfigTest.propTypes = {
  fields: PropTypes.object.isRequired,
  prefix: PropTypes.string.isRequired,
  supplementaryFiles: PropTypes.array.isRequired,
  exerciseTests: PropTypes.array,
  formValues: PropTypes.object,
  intl: PropTypes.shape({ locale: PropTypes.string.isRequired }).isRequired
};

export default injectIntl(EditExerciseSimpleConfigTest);
