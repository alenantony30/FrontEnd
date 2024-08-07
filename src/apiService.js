//const APPLICATION_URL = window.REACT_APP_API_URL;
const APPLICATION_URL = 'http://localhost:8080'
export const fetchData = async (requestBody) => {
    console.log("body is " + JSON.stringify(requestBody));

    const response = await fetch(`${APPLICATION_URL}/api/1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error('Server is not responding');
    }

    // Check if the response is a file download
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/octet-stream')) {
        // File download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Template.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
    }

    // Regular JSON response
    return response.json();
};
