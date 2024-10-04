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
  const [formFields, setFormFields] = useState([{ apiName: '', requestBody: null, responseBody: [''], queryParam: null }]);
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState([false]);
  const [error, setError] = useState(null);
  const [validationMessages, setValidationMessages] = useState({});
  const [methodType, setMethodType] = useState([]);
  const { steps, currentStep, setCurrentStep } = useContext(StepperContext);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(0); // Set initial step to 'Product Details'



  }, [isChecked, formFields, setCurrentStep, validationMessages]); // Ensure to include all relevant state variables in the dependency array

  const disabled = formFields.some((field, index) => 
    // If the toggle is off (isChecked is false), we check if the requestBody is valid
    (!isChecked[index] && 
      (field.requestBody === null || validationMessages[`${index}-requestBody`])) || 
    // Check if apiName and responseBody are valid
    field.apiName.trim() === '' || 
    field.responseBody.some(rb => rb.trim() === '')
  ) || product.trim() === '' || Object.keys(validationMessages).length > 0 || loading;
  

  const handleFormChange = (event, index, rbIndex = null) => {
    const { name, value } = event.target;
    let data = [...formFields];
    let typeOfMethod = [...methodType];
    if (rbIndex !== null) {
      data[index].responseBody[rbIndex] = value;
    } else if (name === 'requestBody') {
      if (isValidJson(value) || isValidXml(value)) {
        data[index][name] = value;
        typeOfMethod[index] = 'POST';

      }
      else if (value === '') {
        typeOfMethod[index] = 'GET';
        data[index][name] = null;

      }
      else {

        typeOfMethod[index] = 'GET';
        data[index][name] = value;
      }
      console.log("Request Method Type : " + methodType + " value " + value);

    } else {
      data[index][name] = value;
    }
    setFormFields(data);
    setMethodType(typeOfMethod);


    let messages = { ...validationMessages };
    if ((name === 'requestBody' && isChecked[index] === false) || rbIndex !== null) {
      const key = rbIndex !== null ? `${index}-responseBody-${rbIndex}` : `${index}-requestBody`;
      if (value.trim() === '' || isValidJson(value) || isValidXml(value)) {
        delete messages[key];
      } else {
        messages[key] = 'Please enter a valid JSON or XML.';
      }
    }
    setValidationMessages(messages);
    console.log("Request Method Type : " + methodType);
  };

  const submit = async (e) => {
    e.preventDefault();

    const apiList = formFields.map((field, index) => ({
      apiName: field.apiName,
      requestBody: methodType[index] === 'GET' ? null : field.requestBody,
      responseBody: field.responseBody,
      queryParam: methodType[index] === 'POST' ? null : field.requestBody,
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
    let object = { apiName: '', requestBody: null, responseBody: [''], queryParam: null };
    setFormFields([...formFields, object]);
    // let c =[...isChecked];
    setIsChecked([...isChecked, false]);
  };

  const removeFields = (index) => {
    let messages = { ...validationMessages };
    let typeOfMethod = [...methodType];
    let data = [...formFields];
    let toggleValue = [...isChecked];
    delete messages[`${index}-requestBody`];
    formFields[index].responseBody.forEach((_, rbIndex) => {
      delete messages[`${index}-responseBody-${rbIndex}`];
    });
    setValidationMessages(messages);
    typeOfMethod.splice(index, 1);
    data.splice(index, 1);
    toggleValue.splice(index, 1)
    setFormFields(data);
    setIsChecked(toggleValue);
    setMethodType(typeOfMethod);
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

  const handleToogleChange = (index) => {
    console.log("disabled "+(disabled || loading));
    let toggleValue = [...isChecked];
    toggleValue[index] = !toggleValue[index];
    setIsChecked(toggleValue);
    let messages = { ...validationMessages };

    // Clear validation message if toggle is ON
    if (toggleValue[index]) {
      delete messages[`${index}-requestBody`];
    }

    else {
      // Toggle OFF: Perform validation
      const requestBody = formFields[index]?.requestBody;
      if (!(isValidJson(requestBody) || isValidXml(requestBody))) {
        messages[`${index}-requestBody`] = 'Please enter a valid JSON or XML.';
      }
    }
    setValidationMessages(messages);
  }


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
                <div className="textarea-container">
                  <textarea
                    type="json"
                    className="requestResponse"
                    name="requestBody"
                    placeholder={isChecked[index] ? "Enter the Request Parameter" : "Enter the Request Body"}
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.requestBody}

                  />

                  <label class="switch-toggle">
                    <input type="checkbox"
                      onChange={(event) => handleToogleChange(index)}
                      checked={isChecked[index]} />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              {form.responseBody.map((response, rbIndex) => (
                <div key={rbIndex} className="requestResponseErrorComponent">
                  {validationMessages[`${index}-responseBody-${rbIndex}`] &&
                    <div className="error">{validationMessages[`${index}-responseBody-${rbIndex}`]}</div>}
                  <div className="textarea-container">
                    <textarea
                      className="response"
                      name="responseBody"
                      placeholder="Enter the Response Body"
                      onChange={(event) => handleFormChange(event, index, rbIndex)}
                      value={response}
                      required
                    />
                    <button
                      type="button"
                      className={(form.responseBody.length === 1) ? "disabledRemoveResponseButton" : "removeResponseButton"}
                      onClick={() => removeResponseBody(index, rbIndex)}
                      disabled={form.responseBody.length === 1}
                    >  &times;</button>
                  </div>

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
                onClick={() => {
                  if (formFields.length > 1) {
                    removeFields(index)
                  }
                }

                }
                disabled={formFields.length === 1}
                style={
                  {
                    cursor: formFields.length === 1 ? 'not-allowed' : 'pointer',
                    opacity: formFields.length === 1 ? 0.5 : 1
                  }
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