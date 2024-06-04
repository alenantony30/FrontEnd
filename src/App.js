import React, { useState } from "react";
import './App.css';
import { fetchData } from './apiService';
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';

const isValidJson = (input) => {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
};

const isValidXml = (input) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(input, 'application/xml');
  return parsed.getElementsByTagName('parsererror').length === 0;
};

export default function App() {
  const [formFields, setFormFields] = useState([{ apiName: '', requestBody: '', responseBody: '' }]);
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMessages, setValidationMessages] = useState({});

  const navigate = useNavigate();

  const disabled = !formFields.every(field =>
    field.requestBody.trim() !== '' &&
    field.responseBody.trim() !== '' &&
    field.apiName.trim() !== '') || product.trim() === '' || Object.keys(validationMessages).length > 0;

  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    let data = [...formFields];
    data[index][name] = value;
    setFormFields(data);

    let messages = { ...validationMessages };
    if (name === 'requestBody' || name === 'responseBody') {
      if (value.trim() === '' || isValidJson(value) || isValidXml(value)) {
        delete messages[`${index}-${name}`];
      } else {
        messages[`${index}-${name}`] = 'Please enter a valid JSON or XML.';
      }
    }
    setValidationMessages(messages);
    console.log("Validation Messages", validationMessages);
  };

  const submit = async (e) => {
    e.preventDefault();

    const apiList = formFields.map(field => ({
      apiName: field.apiName,
      requestBody: field.requestBody,
      responseBody: field.responseBody.split(',').map(item => item.trim()) // Convert responseBody to array
    }));

    const formData = { productName: product, apiList };
    console.log("submit", formData);

    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(formData);
      console.log(result);
      navigate("/uploadFile");
    } catch (error) {
      alert("Server is not responding, Please try later")
      console.error('Server is not responding, Please try later', error);
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const addFields = () => {
    let object = { apiName: '', requestBody: '', responseBody: '' };
    setFormFields([...formFields, object]);
    console.log("add", formFields);
  };

  const removeFields = (index) => {
    let messages = { ...validationMessages };
    delete messages[`${index}-requestBody`];
    delete messages[`${index}-responseBody`];
    setValidationMessages(messages);
    console.log("remove", index, "Updated ValidationMessages", validationMessages);
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  return (
    <div className='test'>
      <label className="commonWidth productName">Product Name</label>
      <br />
      <input
        className="commonWidth productName"
        name="product"
        placeholder=""
        onChange={(e) => setProduct(e.target.value)}
        value={product}
        required
      />
      <form className="form" onSubmit={submit}>
        {formFields.map((form, index) => {
          return (
            <div className="commonWidth apiDetails" key={index}>
              <div className="requestResponseErrorComponent">

                {validationMessages[`${index}-requestBody`] &&
                  <div className="error">{validationMessages[`${index}-requestBody`]}</div>}
                <textarea
                  type="json"
                  className="requestResponse"
                  name="requestBody"
                  placeholder="Enter the Request Body"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.requestBody}
                  required
                />
              </div>
              <div className="requestResponseErrorComponent">

                {validationMessages[`${index}-responseBody`] &&
                  <div className="error">{validationMessages[`${index}-responseBody`]}</div>}
                <textarea
                  className="requestResponse"
                  name="responseBody"
                  placeholder="Enter the Response Body"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.responseBody}
                  required
                />
              </div>

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
                onClick={() => removeFields(index)}
                disabled={formFields.length === 1}
              >x</button>
            </div>
          );
        })}
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
        >Download Template with Data</button>
      </form>
    </div>
  );
}
