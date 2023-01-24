const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addTicket(username, timestamp, amount, description) {
    return docClient.put({
        TableName: 'tickets',
        Item: {
            "username": username,
            "timestamp": timestamp,
            "amount": amount,
            "description": description,
            "status": "pending"
        }
    }).promise();
}

function retrieveAllTickets() {
    const params = {
        TableName: 'tickets'
    }
    return docClient.scan(params).promise();
}

function retrieveTicketsById(id) {
    const params = {
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value',
        ExpressionAttributeNames: {
            '#i': 'user_id'
        },
        ExpressionAttributeValues: {
            ':value': id
        }
    };
    return docClient.query(params).promise();
}

function retrieveTicketsByIdandStatus(id, status) {
    const params = {
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value',
        FilterExpression: '#s = :value2',
        ExpressionAttributeNames: {
            '#i': 'user_id',
            "#s": "status",
        },
        ExpressionAttributeValues: {
            ':value': id,
            ":value2": status,
        }
    };
    return docClient.query(params).promise();
}

function retrieveTicketByStatus() {
    const params = {
        TableName: 'tickets',
        IndexName: 'status-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {
            '#c': 'status'
        },
        ExpressionAttributeValues: {
            ':value': 'pending'
        }
    };
    return docClient.query(params).promise();
}

function retrieveTicketByTimestamp(user_id, timestamp) {
    const params = {
        TableName: 'tickets',
        KeyConditionExpression: '#i = :value and #t = :value2',
        ExpressionAttributeNames: {
            '#i': 'user_id',
            "#t": "timestamp",
        },
        ExpressionAttributeValues: {
            ':value': user_id,
            ":value2": timestamp,
        }
    };
    return docClient.query(params).promise();
}

function updateTicketStatusByTimestamp(user_id, timestamp, status) {
    const params = {
        TableName: 'tickets',
        Key: {
            user_id, 
            timestamp
        },
        UpdateExpression: 'set #s = :value3',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':value3': status
        }
    }
    return docClient.update(params).promise();
}

module.exports = {
    addTicket,
    retrieveAllTickets,
    retrieveTicketsById,
    retrieveTicketsByIdandStatus,
    retrieveTicketByStatus,
    retrieveTicketByTimestamp,
    updateTicketStatusByTimestamp
}