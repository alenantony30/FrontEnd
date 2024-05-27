import React, { useState } from "react";
import './App.css';

const handleFile=(event)=>{

   // setFile(event.target.files[0]);
    
}

export default function UploadFile() {
   return <div
              className='uploadFile'>

       <br/><br/><br/><br/>

       <input
           type='file'
           name='file'
           onchange={handleFile}
           className='fileInput commonWidth'
                      
           />
      
       <button
           className='enabledButton commonWidth'
           >Upload</button>
   
   </div>
  // return <div>Upload Page</div>
}
