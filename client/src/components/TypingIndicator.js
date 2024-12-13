// src/components/TypingIndicator.js
import React from 'react';

const TypingIndicator = ({ typing }) => {
  return typing ? <p className="text-muted">{typing}</p> : null;
};

export default TypingIndicator;
