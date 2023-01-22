const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
//const { DocumentClient } = require('aws-sdk/clients/dynamodb');

function createJWT(username, role) {
    return jwt.sign({
        username,
        role
    }, 'thisisasecret', { 
        expiresIn: '7d'
    })
}

// (header + payload) sign with the secret -> signature

// The JWT will be sent to the client
// When client sends the JWT back to the server, the server needs to check if the JWT is valid
// (header + payload + signature) -> verify that the signature was generated using the "secret"
// You cannot forge any of the information inside of the payload or header, because the server will know that it was
// forged

// verify
jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise
// instead of forcing us to use (err, data) => {} callback function

function verifyTokenAndReturnPayload(token) {
    return jwt.verify(token, 'thisisasecret'); // return a promise with the payload
}

module.exports = {
    createJWT,
    verifyTokenAndReturnPayload
}

/*
const token = jwt.sign({
    username: "user123",
    role: "employee"
}, 'thisisasecret', { 
    expiresIn: '1d'
})

console.log(token);

jwt.verify(token, 'thisisasecret', (err, data) => {
    console.log(data);
})

jwt.verify(token, 'thisisasecret').then((data) => {
    console.log(data);
})

verifyTokenAndReturnPayload('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMjMiLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE2NzQzNDY1MzcsImV4cCI6MTY3NDQzMjkzN30.OC27T8LFc_mZdGdUL0-g3au5M_9X0KflO18efcHtp-I').then((payload) => {
    console.log(payload);
})
*/