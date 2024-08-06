import React, { useContext, useEffect, useState, useRef } from 'react';
import { StepperContext } from './StepperContext';
import Stepper from './Stepper';
import exampleImage from './uploadFileImage.png';
import './App.css'; // Importing the same CSS used in App

const UploadFile = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(1); // Set initial step to 'API Details'
  }, [setCurrentStep]);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File name:", selectedFile.name);
    } else {
      console.error('No file selected');
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("file subitted ----> " + file.name + "loading " + loading);
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/2', {
        method: 'POST',
        body: formData,
      });

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

        // Move to the next step
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
      } else {
        console.error('File upload failed', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
      <div className='main-components'>
        <form className="fileInputForm" onSubmit={handleSubmit}>
          <div className='fileInputFormDiv' onClick={handleButtonClick}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {(!file) ?

              <div>
                <img className='bankLogo' src={exampleImage} alt="Example" />
                <br />
                <a>Upload File</a>
              </div>
              :

              <span>{file.name}</span>}
          </div>
          <button disabled={(!file) || loading}
            className={((!file)||loading) ? 'disabledButton small-button' : 'enabledButton small-button'} type="submit">Submit API DEF</button>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
