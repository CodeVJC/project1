const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

//project requirement 2
function addTicket(username, timestamp, amount, description, type) {
    return docClient.put({
        TableName: 'tickets',
        Item: {
            "username": username,
            "timestamp": timestamp,
            "amount": amount,
            "description": description,
            "type": type,
            "status": "pending"
        }
    }).promise();
}

//project requirement 3
function retrieveAllTickets() {
    return docClient.scan({
        TableName: 'tickets'
    }).promise();
}

//project requirement 3
function retrieveTicketsByStatus(status) {
    return docClient.query({
        TableName: 'tickets',
        IndexName: 'status-timestamp-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {
            '#c': 'status'
        },
        ExpressionAttributeValues: {
            ':value': status
        }
    }).promise();
}

//project requirement 3
function retrieveTicketByUsernameAndTimestamp(username, timestamp) {
    return docClient.query({
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value and #t = :value2',
        ExpressionAttributeNames: {
            '#i': 'username',
            "#t": "timestamp",
        },
        ExpressionAttributeValues: {
            ':value': username,
            ":value2": timestamp,
        }
    }).promise();
}

//project requirement 3
function updateTicketStatusByTimestamp(username, timestamp, status) {
    return docClient.update({
        TableName: 'tickets',
        Key: {
            "username": username,
            "timestamp": timestamp
        },
        UpdateExpression: 'set #s = :value3',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':value3': status
        }
    }).promise();
}

//project requirement 4
function retrieveTicketsByUsername(username) {
    return docClient.query({
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value',
        ExpressionAttributeNames: {
            '#i': 'username'
        },
        ExpressionAttributeValues: {
            ':value': username
        }
    }).promise();
}

//project requirement 4
function retrieveTicketsByUsernameandStatus(username, status) {
    return docClient.query({
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value',
        FilterExpression: '#s = :value2',
        ExpressionAttributeNames: {
            '#i': 'username',
            "#s": "status",
        },
        ExpressionAttributeValues: {
            ':value': username,
            ":value2": status,
        }
    }).promise();
}

//project stretch goal 1
function retrieveTicketsByUsernameandType(username, type) {
    return docClient.query({
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value',
        FilterExpression: '#t = :value2',
        ExpressionAttributeNames: {
            '#i': 'username',
            "#t": "type",
        },
        ExpressionAttributeValues: {
            ':value': username,
            ":value2": type,
        }
    }).promise();
}

module.exports = {
    addTicket,
    retrieveAllTickets,
    retrieveTicketsByUsername,
    retrieveTicketsByUsernameandStatus,
    retrieveTicketsByStatus,
    retrieveTicketByUsernameAndTimestamp,
    updateTicketStatusByTimestamp,
    retrieveTicketsByUsernameandType
}