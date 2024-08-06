import React, { useContext, useState, useEffect, useRef } from "react";
import './App.css'; // Import the same CSS file used in App
import Stepper from './Stepper'; // Import the Stepper component
import { StepperContext } from './StepperContext'; // Import the StepperContext
import exampleImage from './uploadFileImage.png';

const OverwriteData = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [fileUpdateRaw, setFileUpdateRaw] = useState(null);
  const [fileUpdateIndexData, setFileUpdateIndexData] = useState(null);
  //const [file, setFile] = useState(null);
  const [loadingRaw, setLoadingRaw] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const fileInputRefRaw = useRef(null);
  const fileInputRefIndex = useRef(null);

  const handleButtonClickRawData = () => {
    fileInputRefRaw.current.click();
  };

  const handleButtonClickIndexData = () => {
    fileInputRefIndex.current.click();
  };


  /* const handleFileChange = (event) => {
     const selectedFile = event.target.files[0];
     if (selectedFile) {
       setFileUpdateIndexData(selectedFile);
       console.log("File name:", selectedFile.name);
     } else {
       console.error('No file selected');
     }
   };*/

  useEffect(() => {
    setCurrentStep(3); // Set initial step
  }, [setCurrentStep]);

  const handleFileChangeUpdateRaw = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileUpdateRaw(selectedFile);
      console.log("File name:", selectedFile.name);
    } else {
      console.error('No file selected');
    }
  };

  const handleFileChangeUpdateIndexData = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileUpdateIndexData(selectedFile);
      console.log("File name:", selectedFile.name);
    } else {
      console.error('No file selected');
    }
  };

  const handleUpdateRawData = async (e) => {
    setLoadingRaw(true);
    console.log("raw data is -->" + fileUpdateRaw.name);
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
    setLoadingRaw(false);
  };

  const handleUpdateIndexData = async (e) => {
    setLoadingIndex(true);
    console.log("Indexed data is -->" + fileUpdateIndexData.name);
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
    setLoadingIndex(false);
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
      <div className="main-compontentsUpdate">
        <div className="fileUploadAndSubmitDiv">
          <form className="form" onSubmit={handleUpdateRawData}>

            <div className='fileInputFormDiv2' onClick={handleButtonClickRawData}>
              <input
                type="file"
                ref={fileInputRefRaw}
                style={{ display: 'none' }}
                onChange={handleFileChangeUpdateRaw}
              />
              {(!fileUpdateRaw) ?

                <div>
                  <img className='bankLogo' src={exampleImage} alt="Example" />
                  <br />
                  <a>Upload File</a>
                </div>
                :

                <span>{fileUpdateRaw.name}</span>}
            </div>
            <button 
            disabled={(!fileUpdateRaw) || loadingRaw}
            className={((!fileUpdateRaw)||loadingRaw) ? 'disabledButton small-button' : 'enabledButton small-button'}
            type="submit">Update Raw Data</button>
          </form>
        </div>
        <br />
        <div className="fileUploadAndSubmitDiv">
          <form className="form" onSubmit={handleUpdateIndexData}>

            <div className='fileInputFormDiv2' onClick={handleButtonClickIndexData}>
              <input
                type="file"
                ref={fileInputRefIndex}
                style={{ display: 'none' }}
                onChange={handleFileChangeUpdateIndexData}
              />
              {(!fileUpdateIndexData) ?

                <div>
                  <img className='bankLogo' src={exampleImage} alt="Example" />
                  <br />
                  <a>Upload File</a>
                </div>
                :

                <span>{fileUpdateIndexData.name}</span>}
            </div>
            <button 
            disabled={(!fileUpdateIndexData) || loadingIndex}
            className={((!fileUpdateIndexData)||loadingIndex) ? 'disabledButton small-button' : 'enabledButton small-button'}
            type="submit">Update Index Data</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OverwriteData;
