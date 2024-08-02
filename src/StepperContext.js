// StepperContext.js
import React, { createContext, useState } from 'react';

export const StepperContext = createContext();

export const StepperProvider = ({ children }) => {
  const steps = ['Product Details', 'APIDEF Generator', 'Final Output'];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <StepperContext.Provider value={{ steps, currentStep, setCurrentStep }}>
      {children}
    </StepperContext.Provider>
  );
};
