import React, { useContext, useState, useEffect } from "react";
import './App.css';
import { fetchData } from './apiService';
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import Stepper from './Stepper';
import { StepperContext } from './StepperContext';

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
  const [formFields, setFormFields] = useState([{ apiName: '', requestBody: '', responseBody: [''] }]);
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMessages, setValidationMessages] = useState({});
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(0); // Set initial step to 'Product Details'
  }, [setCurrentStep]);

  const disabled = !formFields.every(field =>
    field.requestBody.trim() !== '' &&
    field.responseBody.every(rb => rb.trim() !== '') &&
    field.apiName.trim() !== '') || product.trim() === '' || Object.keys(validationMessages).length > 0;

  const handleFormChange = (event, index, rbIndex = null) => {
    const { name, value } = event.target;
    let data = [...formFields];
    if (rbIndex !== null) {
      data[index].responseBody[rbIndex] = value;
    } else {
      data[index][name] = value;
    }
    setFormFields(data);

    let messages = { ...validationMessages };
    if (name === 'requestBody' || rbIndex !== null) {
      const key = rbIndex !== null ? `${index}-responseBody-${rbIndex}` : `${index}-requestBody`;
      if (value.trim() === '' || isValidJson(value) || isValidXml(value)) {
        delete messages[key];
      } else {
        messages[key] = 'Please enter a valid JSON or XML.';
      }
    }
    setValidationMessages(messages);
  };

  const submit = async (e) => {
    e.preventDefault();

    const apiList = formFields.map(field => ({
      apiName: field.apiName,
      requestBody: field.requestBody,
      responseBody: field.responseBody
    }));

    const formData = { productName: product, apiList };

    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(formData);
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1)); // Move to the next step
      navigate("/uploadFile");
    } catch (error) {
      alert("Server is not responding, Please try later");
      console.error('Server is not responding, Please try later', error);
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const addFields = () => {
    let object = { apiName: '', requestBody: '', responseBody: [''] };
    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let messages = { ...validationMessages };
    delete messages[`${index}-requestBody`];
    formFields[index].responseBody.forEach((_, rbIndex) => {
      delete messages[`${index}-responseBody-${rbIndex}`];
    });
    setValidationMessages(messages);
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const addResponseBody = (index) => {
    let data = [...formFields];
    data[index].responseBody.push('');
    setFormFields(data);
  };

  const removeResponseBody = (index, rbIndex) => {
    let messages = { ...validationMessages };
    delete messages[`${index}-responseBody-${rbIndex}`];
    setValidationMessages(messages);
    let data = [...formFields];
    data[index].responseBody.splice(rbIndex, 1);
    setFormFields(data);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className='test'>
      <Stepper steps={steps} currentStep={currentStep} />
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

              {form.responseBody.map((response, rbIndex) => (
                <div key={rbIndex} className="requestResponseErrorComponent">
                  {validationMessages[`${index}-responseBody-${rbIndex}`] &&
                    <div className="error">{validationMessages[`${index}-responseBody-${rbIndex}`]}</div>}
                  <textarea
                    className="requestResponse"
                    name="responseBody"
                    placeholder="Enter the Response Body"
                    onChange={(event) => handleFormChange(event, index, rbIndex)}
                    value={response}
                    required
                  />
                  <button
                    type="button"
                    className="removeResponseButton"
                    onClick={() => removeResponseBody(index, rbIndex)}
                    disabled={form.responseBody.length === 1}
                  >Remove</button>
                </div>
              ))}

              <button
                type="button"
                className="addResponseButton"
                onClick={() => addResponseBody(index)}
              >Add Response Body</button>

              <input
                className="apiName"
                name="apiName"
                placeholder="API Name"
                onChange={(event) => handleFormChange(event, index)}
                value={form.apiName}
                required
              />
              <MdDeleteForever
                type="button"
                size={"70"}
                onClick={() => removeFields(index)}
                disabled={formFields.length === 1}
                style={
                  { cursor: formFields.length === 1 ? 'not-allowed' : 'pointer',
                     opacity: formFields.length === 1 ? 0.5 : 1 }
                }
              ></MdDeleteForever>
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
