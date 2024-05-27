const APPLICATION_URL = 'http://localhost:8080/testdata/testjson';

export const fetchData = async (requestBody) => {
    console.log("body is "+JSON.stringify(requestBody));

 const response = await fetch(`${APPLICATION_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        throw new Error('Server is not responding');
    }

    return response.json();
};
