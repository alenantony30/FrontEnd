import React, { useContext, useEffect, useState, useRef } from 'react';
import { StepperContext } from './StepperContext';
import Stepper from './Stepper';
import './App.css'; // Importing the same CSS used in App
import FileInput from './FileInput'




const UploadFile = () => {
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setCurrentStep(1); // Set initial step to 'API Details'
  }, [setCurrentStep]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  //-----------------

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {

    console.log("upload File button ");
    fileInputRef.current.click();
  };

  const handleFileChange2 = (event) => {
    if (event.target.files && event.target.files.length > 0) {

      console.log("handle file 2");
      setSelectedFile(event.target.files[0]);
      setFile(event.target.files[0]);
      // Do something with the selected file, e.g. upload it to a server
      console.log("File -------------->" + file.name);
      console.log("selectedfile --------------->  " + selectedFile.name);
    }
  };


  //============


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    console.log("file name  ");

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



  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
      <div className='main-compontents'>
        <form className="form" onSubmit={handleSubmit}>
          <form action='' className='fileInputForm' onClick={handleButtonClick} >
            <input type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange2}
            />
            {file.name}
          </form>
          <button className='enabledButton small-button' type="submit" >Submit API Def</button>
        </form>





      </div>


      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange2}
      />
      {file.name}

    </div>
  );
};

export default UploadFile;