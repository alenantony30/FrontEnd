import React, { useState } from "react";
import './App.css';
import { fetchData } from './apiService';
import { useNavigate } from "react-router-dom";







export default function App() {


  const [formFields, setFormFields] = useState([{ apiName: '', requestBody: '', responseBody: '' }])
  const [formattedFields, setformattedFields] = useState([{ apiName: '', requestBody: '', responseBody: '' }])
  const [product, setProduct] = useState('');
  const [jsonData, setJsonData] = useState('');

  const [callApi, setCallApi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleFormChange = (event, index) => {
    console.log(index, event.target.name);
    let data = [...formFields];
    let data2 = [...formattedFields];
    data[index][event.target.name] = (event.target.value);
    data2[index][event.target.name] = cleanJson(event.target.value);
    setFormFields(data);
    setformattedFields(data2);
  }

  const cleanJson = (value) => {
    try {/*
            const [formatted,setFormatted]= useState([{ requestBody: '', responseBody: '', apiName: '' }]);
            
            value.forEach(item=>{

                const {req,res,apiname}=item;
                req=JSON.parse(req);
                res=JSON.parse(res);
                 let object = { requestBody: req, responseBody: res, apiName: apiname  }
    setFormatted([...formatted, object])
                
            })
           
            //const cleanedJson=JSON.stringify(parsedJson);
            */
      const parsedJson = JSON.parse(value);
      return parsedJson;
    }
    catch (error) {
      return value;

    }
  }



  const submit = async (e) => {

    const formData = { product, formFields };
    console.log("submit", formData);
    // setJsonData(JSON.stringify(formData, null, 2));
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(formData);
      setCallApi(result);
      console.log(result);
      navigate("/uploadFile");
      console.log("routing")

    }
    catch (error) {

      console.error('Server is not responding', error);
      setError('Failed to load');
    }
    finally {
      setLoading(false);

    }



  }

  const addFields = () => {
    let object = { apiName: '', requestBody: '', responseBody: '' }
    let object2 = { apiName: '', requestBody: '', responseBody: '' }
    setFormFields([...formFields, object]);
    setformattedFields([...formattedFields, object2])
    console.log("add", setFormFields)

  }

  const removeFields = (index) => {
    console.log("remove", index);
    let data = [...formFields];
    let data2 = [...formattedFields];
    data.splice(index, 1)
    data2.splice(index, 1)
    setFormFields(data)
    setformattedFields(data2)
  }


  const disabled = !formFields.every(field =>
    field.requestBody !== '' &&
    field.responseBody !== '' &&
    field.apiName !== '') || product === ''


  return (

    <div className='test'>

      <text
        className="commonWidth productName"
      >Product Name</text>
      <br />
      <input
        className="commonWidth productName"
        name="product"
        placeholder=""
        onChange={(e) => setProduct(e.target.value)}
        value={product}
        required
      />


      <form
        className="form"
        onSubmit={submit}>


        {formFields.map((form, index) => {
          return (

            <div className="commonWidth apiDetails"
              key={index}>
              <textarea
                type="json"
                className="requestResponse"
                name="requestBody"
                placeholder="Enter the Request Body"
                onChange={(event) => handleFormChange(event, index)}
                value={form.requestBody}
                required
              />
              <textarea
                className="requestResponse"
                name="responseBody"
                placeholder="Enter the Response Body"
                onChange={(event) => handleFormChange(event, index)}
                value={form.responseBody}
                required
              />
              <input
                className="apiName"
                name="apiName"
                placeholder="API Name"
                onChange={(event) => handleFormChange(event, index)}
                value={form.apiName}
                required
              />
              <button
                type="button"
                className="removeButton"
                onClick={(event) => removeFields(index)}
                disabled={formFields.length === 1}
              >x</button>
            </div>

          )
        })}




      </form>




      <button
        className="commonWidth addButton"
        onClick={addFields}
        type="button"
      >Add More</button>
      <br />




      <button
        type="submit"
        className={(disabled || loading) ? 'disabledButton commonWidth' : 'commonWidth enabledButton'}
        disabled={disabled || loading}
        onClick={submit}
      >Download Template with Data</button>


      <br />
      <br />
    </div>
  );
}
