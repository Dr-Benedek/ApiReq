const API_HOST = 'localhost:8080';

let userParams = {
    method: document.getElementById('http-method').value,
    path: document.getElementById('path').value,
    id: document.getElementById('id').value,
    body: document.getElementById('request-body').value ? JSON.parse(document.getElementById('request-body').value) : null
};

let proceduresStore = {};

function updateParams() {
    userParams = {
        method: document.getElementById('http-method').value,
        path: document.getElementById('path').value,
        id: document.getElementById('id').value,
        body: document.getElementById('request-body').value ? JSON.parse(document.getElementById('request-body').value) : null
    };
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function sendRequest() {
    try {
        const endpoint = getEndpoint();
        let method = getUserMethod();
        method = method.split(' ')[0];

        if (endpoint === '/procedures' && method === 'POST') {
            let newProcedure = createProcedure();
            const response = await makeApiCall(endpoint, method, newProcedure);
            displayResponse(response);
        } else {
            const response = await makeApiCall(endpoint, method, getUserBody());
            displayResponse(response);
        }

    } catch (error) {
        console.error('API Request Error:', error);
    }
}

function createProcedure() {
    const procedure = {
        uuid: generateUUID(),
        name: "Alma1",
        version: "0.0.1",
        released: new Date().toISOString(),
        description: "The scope of this procedure is defined by some theory about how to validate related data.",
        checks: [
            generateUUID(),
            generateUUID(),
            generateUUID(),
            generateUUID()
        ]
    };

    proceduresStore[procedure.uuid] = procedure;
    return procedure;
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