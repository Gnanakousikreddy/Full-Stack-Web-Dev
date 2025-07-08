import React from 'react';
import './FormContainer.css';

const FormContainer = ({ children, theme }) => {
  return (
    <div className={`form-container ${theme}`}>
      <div className="form-box">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
