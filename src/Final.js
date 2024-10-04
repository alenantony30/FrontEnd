import React, { useContext, useEffect, useState } from "react";
import './App.css'; // Import the same CSS file used in App
import Stepper from './Stepper'; // Import the Stepper component
import { StepperContext } from './StepperContext'; // Import the StepperContext
import { Alert, Snackbar } from '@mui/material';


const Final = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [alert, setAlert] = useState({ type: '', message: '', open: false });

  useEffect(() => {
    setCurrentStep(2); // Set initial step
  }, [setCurrentStep]);

  const showAlert = (type, message) => {
    setAlert({ type, message, open: true });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleDownload = async (url, filename, methodType) => {
    try {
      const response = await fetch(url, { method: methodType });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        showAlert('success', `${filename} downloaded successfully!`);
      } else {
        showAlert('error', `Failed to download ${filename}: ${response.statusText}`);
      }
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="button-group">
        <button className="enabledButton small-button" onClick={() => handleDownload('http://localhost:8080/api/4', 'rawdata.json', 'POST')}>Download Raw Data</button>
        <button className="enabledButton small-button" onClick={() => handleDownload('http://localhost:8080/api/5', 'indexData.json', 'POST')}>Download Index Data</button>
        <button className="enabledButton small-button" onClick={() => handleDownload('http://localhost:8080/api/6', 'apidef.json', 'POST')}>Download API DEF</button>
        <button className="enabledButton small-button" onClick={() => handleDownload('http://localhost:8080/api/3', 'RawDataToExcel.xlsx', 'GET')}>Download Raw Data Excel</button>
      </div>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Final;
