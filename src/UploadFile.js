import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from './StepperContext';
import Stepper from './Stepper';
import './App.css'; // Importing the same CSS used in App

const UploadFile = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setCurrentStep(1); // Set initial step to 'API Details'
  }, [setCurrentStep]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = window.REACT_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'response.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // Move to the next step
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
      } else {
        console.error('File upload failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
      <form className="form" onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button style={{backgroundColor:"#014c92", width:"33%", height:"30px", color:"#ffffff"}} type="submit" >Download APIDEF</button>
      </form>
      <div className="additionalButtons">
        <span>or</span>
        <button className="rightButton">Submit APIDEF</button>
      
        <button className="leftButton">Download RawData</button>
        <button className="leftButton">Download IndexData</button>
      </div>
    </div>
  );
};

export default UploadFile;
