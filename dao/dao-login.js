const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function retrieveUserByUsername(username) {
    return docClient.get({
        TableName: 'users',
        Key: {
            "username": username
        }
    }).promise();
}

function addUser(username, password) {
    return docClient.put({
        TableName: 'users',
        Item: {
            "username": username,
            "password": password,
            "role": "employee"
        }
    }).promise();
}

module.exports = {
    retrieveUserByUsername,
    addUser
};