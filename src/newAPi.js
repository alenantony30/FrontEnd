import React, { useState } from "react";
import './App.css';
import { fetchData } from './apiService';
import { useNavigate } from "react-router-dom";

export default function App() {

    const [formFields, setFormFields] = useState([{ apiName: '', requestBody: '', responseBody: '' }]);
    const [product, setProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleFormChange = (event, index) => {
        console.log(index, event.target.name);
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
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
            console.error('Server is not responding', error);
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
        console.log("remove", index);
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    };

    const disabled = !formFields.every(field =>
        field.requestBody !== '' &&
        field.responseBody !== '' &&
        field.apiName !== '') || product === '';

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
                                placeholder="Enter the Response Body (comma-separated values)"
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
            {error && <p>{error}</p>}
        </div>
    );
}
