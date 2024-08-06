import React, { useContext, useEffect } from "react";
import './App.css'; // Import the same CSS file used in App
import Stepper from './Stepper'; // Import the Stepper component
import { StepperContext } from './StepperContext'; // Import the StepperContext

const Final = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);

  useEffect(() => {
    setCurrentStep(2); // Set initial step
  }, [setCurrentStep]);

  const handleDownloadRawData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/4', { method: 'POST' });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rawdata.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File download failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadIndexData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/5', { method: 'POST' });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'indexData.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File download failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadAPIDef = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/6', { method: 'POST' });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apidef.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File download failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
      
      <div className="button-group">
        <button className="enabledButton small-button" onClick={handleDownloadRawData}>Download Raw Data</button>
        <button className="enabledButton small-button" onClick={handleDownloadIndexData}>Download Index Data</button>
        <button className="enabledButton small-button" onClick={handleDownloadAPIDef}>Download API DEF</button>
      </div>
    </div>
  );
};

export default Final;
