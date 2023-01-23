const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function retrieveUserByUsername(username) {
    const params = {
        TableName: 'users',
        Key: {
            username
        }
    };

    return docClient.get(params).promise();
}

function addUser(username, password, role = 'employee') {
    const params = {
        TableName: 'users',
        Item: {
            username,
            password,
            role
        }
    }
    return docClient.put(params).promise();
}

module.exports = {
    retrieveUserByUsername,
    addUser
};