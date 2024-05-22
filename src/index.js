import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import exampleImage from './Logo.jpg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadFile from './UploadFile';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='bankLogo'>
        <img className='bankLogo' src={exampleImage} alt="Example" />
      </div>
      <Routes>
        <Route path="/App" element={<App />} />
        <Route path='/UploadFile' element={<UploadFile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
