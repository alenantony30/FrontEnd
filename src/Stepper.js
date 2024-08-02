import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Stepper.css'; // Ensure you have the relevant CSS

const Stepper = ({ steps, currentStep }) => {
  const navigate = useNavigate();

  const handleStepClick = (index) => {
    if (index === 0) {
      navigate('/');
    } else if (index === 1) {
      navigate('/uploadFile');
    } else if (index === 2) {
      navigate('/final');
    } else if (index === 3) {
      navigate('/overwriteData');
    }
  };

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index <= currentStep ? 'active' : ''}`}
          onClick={() => handleStepClick(index)}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
