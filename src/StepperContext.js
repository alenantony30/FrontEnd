import React, { createContext, useState } from 'react';

export const StepperContext = createContext();

export const StepperProvider = ({ children }) => {
  const steps = ['Product Details', 'Upload File', 'Final Output', 'Overwrite Data'];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <StepperContext.Provider value={{ steps, currentStep, setCurrentStep }}>
      {children}
    </StepperContext.Provider>
  );
};
