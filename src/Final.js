import React, { useContext, useState, useEffect } from "react";
import './App.css'; // Import the same CSS file used in App
import Stepper from './Stepper'; // Import the Stepper component
import { StepperContext } from './StepperContext'; // Import the StepperContext

const Final = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [fileUpdateRaw, setFileUpdateRaw] = useState(null);
  const [fileUpdateIndexData, setFileUpdateIndexData] = useState(null);
  
  useEffect(() => {
    setCurrentStep(2); // Set initial step
  }, [setCurrentStep]);

  const handleFileChangeUpdateRaw = (e) => {
    setFileUpdateRaw(e.target.files[0]);
  };

  const handleFileChangeUpdateIndexData = (e) => {
    setFileUpdateIndexData(e.target.files[0]);
  };

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
      <h2>Final Page</h2>
      <div className="button-group">
        <button className="enabledButton small-button" onClick={handleDownloadRawData}>Download Raw Data</button>
        <button className="enabledButton small-button" onClick={handleDownloadIndexData}>Download Index Data</button>
        <button className="enabledButton small-button" onClick={handleDownloadAPIDef}>Download API Def</button>
      </div>
      <form className="form" onSubmit={handleUpdateRawData}>
        <input type="file" onChange={handleFileChangeUpdateRaw} className="fileInput" />
        <button className="enabledButton small-button" type="submit">Update Raw Data</button>
      </form>
      <form className="form" onSubmit={handleUpdateIndexData}>
        <input type="file" onChange={handleFileChangeUpdateIndexData} className="fileInput" />
        <button className="enabledButton small-button" type="submit">Update Index Data</button>
      </form>
    </div>
  );
};

export default Final;
