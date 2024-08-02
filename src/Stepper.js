// src/Stepper.js

import React from 'react';
import './Stepper.css';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
        >
          {index + 1}. {step}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
