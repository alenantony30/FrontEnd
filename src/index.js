import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import exampleImage from './Logo.jpg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadFile from './UploadFile';
import Final from './Final';
import OverwriteData from './OverwriteData'; // Import the new OverwriteData component
import { StepperProvider } from './StepperContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StepperProvider>
      <BrowserRouter>
        <div className='bankLogo'>
          <img className='bankLogo' src={exampleImage} alt="Example" />
        </div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/uploadFile" element={<UploadFile />} />
          <Route path="/final" element={<Final />} />
          <Route path="/overwriteData" element={<OverwriteData />} /> {/* Add the new route */}
        </Routes>
      </BrowserRouter>
    </StepperProvider>
  </React.StrictMode>
);

reportWebVitals();