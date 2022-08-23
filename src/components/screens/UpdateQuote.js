import { useState } from 'react';

import { css } from '@emotion/core';
import Textfield from '@atlaskit/textfield';
import { fontSize as getFontSize, gridSize as getGridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${gridSize}px ${gridSize - 2}px`,
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
  wordBreak: 'break-word',
});

const UpdateQuote = ({ updateQuoteForJob, quoteOfCurrentUser }) => {
  const [editValue, setEditValue] = useState('');
  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
      }}
    >
      <InlineEdit
        required
        defaultValue={editValue}
        label="Give your quote here"
        editView={({ errorMessage, ...fieldProps }) => <Textfield type="number" {...fieldProps} autoFocus />}
        readView={() => (
          <div css={readViewContainerStyles} data-testid="read-view">
            {editValue || quoteOfCurrentUser || 'Click to enter a value'}
          </div>
        )}
        onConfirm={(value) => {
          if (!value) return;
          setEditValue(value);
          updateQuoteForJob(value);
        }}
      />
    </div>
  );
};

export default UpdateQuote;
