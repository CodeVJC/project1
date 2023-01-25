const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

//project requirement 1
function retrieveUsername(username) {
    return docClient.get({
        TableName: 'users',
        Key: {
            "username": username
        }
    }).promise();
}

//project requirement 1
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
    retrieveUsername,
    addUser
};