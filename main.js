const API_HOST = 'localhost:8080';

let userParams = {
    method: document.getElementById('http-method').value,
    path: document.getElementById('path').value,
    id: document.getElementById('id').value,
    body: document.getElementById('request-body').value ? JSON.parse(document.getElementById('request-body').value) : null
};
function updateParams(){
    userParams =  {
        method: document.getElementById('http-method').value,
        path: document.getElementById('path').value,
        id: document.getElementById('id').value,
        body: document.getElementById('request-body').value ? JSON.parse(document.getElementById('request-body').value) : null
    };
}
async function sendRequest() {
    try {
        const endpoint = getEndpoint();
        let method = getUserMethod();
        method = method.split(' ')[0];

        const response = await makeApiCall(endpoint, method, getUserBody());

        displayResponse(response);

    } catch (error) {
        console.error('API Request Error:', error);
    }
}

function getEndpoint() {
    updateParams();
    if (userParams.id === '') {
        return userParams.path;
    } else {
        return `${userParams.path}/${userParams.id}`;
    }
}

function getUserMethod() {
    return document.getElementById('http-method').value;
}

function getUserBody() {
    const bodyElement = document.getElementById('request-body');
    if (bodyElement.value === '') {
        return null;
    } else {
        return JSON.parse(bodyElement.value);
    }
}

async function makeApiCall(endpoint, method, body) {
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const requestConfig = {
        method,
        headers: requestHeaders
    };

    if (body !== null) {
        requestConfig.body = JSON.stringify(body);
    }

    const response = await fetch(`http://${API_HOST}${endpoint}`, requestConfig);
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

function displayResponse(response) {
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = '';
    const responseJson = JSON.stringify(response, null, 2);
    const responseDisplay = document.createElement('pre');
    responseDisplay.textContent = responseJson;
    responseElement.appendChild(responseDisplay); 
}


document.getElementById('send-request-btn').addEventListener('click', sendRequest);