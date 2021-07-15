import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Form, FormGroup, FormControl, InputGroup } from 'react-bootstrap';

import Button from '../../TheButton';
import Icon from '../../../icons';
import { safeGet } from '../../../../helpers/common';

const messages = defineMessages({
  placeholder: {
    id: 'app.comments.commentPlaceholder',
    defaultMessage: 'Your comment...',
  },
});

const textareaStyle = { resize: 'none', overflow: 'hidden', height: 'auto' };

const updateTextareaHeight = textarea => {
  const saveScrollPos = window.scrollY; // we need to save viewport scroll position first

  // First we make it small (reset the size)
  textarea.style.height = '1px';
  const newHeight = 2 + textarea.scrollHeight; // and see, how large the scroll area really is
  const maxHeight = 500;

  if (newHeight > maxHeight) {
    // Set the height to maximum and allow scrollbars inside textarea
    textarea.style.height = `${maxHeight}px`;
    textarea.style.overflow = 'auto';
  } else {
    // Set the height to match actual text size and disable scrollbars
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflow = 'hidden';
    textarea.scrollTop = 0;
  }

  window.scrollTo(window.scrollX, saveScrollPos); // restore viewport scroll position (prevent document jumping)
};

class AddComment extends Component {
  state = { text: '', isPrivate: false };

  handleTextareaChange = ev => {
    const textarea = ev.target;
    this.setState({ text: textarea.value });
    updateTextareaHeight(textarea);
  };

  togglePrivate = () => this.setState({ isPrivate: !this.state.isPrivate });

  addComment = ev => {
    const { text, isPrivate } = this.state;
    const { addComment } = this.props;
    addComment(text, isPrivate);
    this.setState({ text: '' });

    ev.preventDefault();
    const formElement = safeGet(ev, ['currentTarget', 'form']);
    const textarea = formElement && formElement.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      updateTextareaHeight(textarea);
    }
  };

  render() {
    const { text, isPrivate } = this.state;
    const {
      addComment,
      intl: { formatMessage },
    } = this.props;

    return (
      <Form>
        <FormGroup>
          <InputGroup>
            <FormControl
              as="textarea"
              rows={1}
              style={textareaStyle}
              disabled={!addComment}
              onChange={this.handleTextareaChange}
              onInput={this.handleTextareInput}
              placeholder={formatMessage(messages.placeholder)}
              value={text}
            />

            <InputGroup.Append>
              <Button
                type="submit"
                variant={isPrivate ? 'success' : 'primary'}
                disabled={text.length === 0 || !addComment}
                onClick={this.addComment}
                noShadow>
                <FormattedMessage id="app.comments.addComment" defaultMessage="Send" />
              </Button>
            </InputGroup.Append>
          </InputGroup>

          <Form.Text>
            <Button
              onClick={this.togglePrivate}
              size="xs"
              variant={isPrivate ? 'outline-success' : 'outline-warning'}
              disabled={!addComment}
              noShadow
              className="mr-2">
              {isPrivate ? <Icon icon="lock" /> : <Icon icon="unlock-alt" />}
            </Button>
            {isPrivate && (
              <FormattedMessage
                id="app.comments.warnings.isPrivate"
                defaultMessage="<strong>Only you will see this comment.</strong>"
                values={{
                  strong: text => <strong>{text}</strong>,
                }}
              />
            )}
            {!isPrivate && (
              <FormattedMessage
                id="app.comments.warnings.isPublic"
                defaultMessage="<strong>Everyone on this page will see this comment.</strong>"
                values={{
                  strong: text => <strong>{text}</strong>,
                }}
              />
            )}
          </Form.Text>
        </FormGroup>
      </Form>
    );
  }
}

AddComment.propTypes = {
  addComment: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AddComment);
