import React, { useState } from "react";
import './App.css';

const handleFile=(event)=>{

   // setFile(event.target.files[0]);
    
}

export default function UploadFile() {
   return <div
              className='uploadFile'>
       <button
           className='enabledButton'
           >Download Template</button>
       <br/><br/><br/><br/>

       <input
           type='file'
           name='file'
           onchange={handleFile}
           className='fileInput'
                      
           />
      
       <button
           className='enabledButton'
           >Upload</button>
   
   </div>
  // return <div>Upload Page</div>
}
