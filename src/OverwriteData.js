import React, { useContext, useState, useEffect } from "react";
import './App.css'; // Import the same CSS file used in App
import Stepper from './Stepper'; // Import the Stepper component
import { StepperContext } from './StepperContext'; // Import the StepperContext

const OverwriteData = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [fileUpdateRaw, setFileUpdateRaw] = useState(null);
  const [fileUpdateIndexData, setFileUpdateIndexData] = useState(null);

  useEffect(() => {
    setCurrentStep(3); // Set initial step
  }, [setCurrentStep]);

  const handleFileChangeUpdateRaw = (e) => {
    setFileUpdateRaw(e.target.files[0]);
  };

  const handleFileChangeUpdateIndexData = (e) => {
    setFileUpdateIndexData(e.target.files[0]);
  };

  const handleUpdateRawData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileUpdateRaw);

    try {
      const response = await fetch('http://localhost:8080/api/UpdateRaw', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rawupdated.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File upload failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateIndexData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileUpdateIndexData);

    try {
      const response = await fetch('http://localhost:8080/api/UpdateIndexData', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'indexupdated.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
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
      <div className="main-compontents">
        <div className="form">
          <form className="form" onSubmit={handleUpdateRawData}>
            <input type="file" onChange={handleFileChangeUpdateRaw} className="fileInput" />
            <button className="enabledButton small-button" type="submit">Update Raw Data</button>
          </form>
        </div>
        <br />
        <div className="form">
          <form className="form" onSubmit={handleUpdateIndexData}>
            <input type="file" onChange={handleFileChangeUpdateIndexData} className="fileInput" />
            <button className="enabledButton small-button" type="submit">Update Index Data</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OverwriteData;
