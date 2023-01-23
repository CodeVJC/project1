const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addTicket(user_id, timestamp, amount, description, status = 'pending') {
    const params = {
        TableName: 'tickets',
        Item: {
            user_id,
            timestamp,
            amount,
            description,
            status
        }
    }
    return docClient.put(params).promise();
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

function retrieveTicketByIdandTimestamp(id, timestamp) {
    const params = {
        TableName: 'tickets',
        Key: {
            "user_id": id,
            "timestamp": timestamp
        }
    }
    return docClient.get(params).promise();
}

function retrieveTicketsByStatus(status) {
    const params = {
        TableName: 'tickets',
        IndexName: 'status-index',
        KeyConditionExpression: '#s = :value',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':value': status
        }
    };
    return docClient.query(params).promise();
}

function deleteTicketById(user_id) {
    const params = {
        TableName: 'tickets',
        Key: {
            user_id
        }
    }
    return docClient.delete(params).promise();
}

function updateTicketAmountById(user_id, newAmount) {
    const params = {
        TableName: 'tickets',
        Key: {
            user_id
        },
        UpdateExpression: 'set #a = :value',
        ExpressionAttributeNames: {
            '#a': 'amount'
        },
        ExpressionAttributeValues: {
            ':value': newAmount
        }
    }
    return docClient.update(params).promise();
}

function updateTicketStatusById(user_id, newStatus) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        },
        UpdateExpression: 'set #s = :value',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':value': newStatus
        }
    }
    return docClient.update(params).promise();
}

module.exports = {
    addTicket,
    retrieveAllTickets,
    retrieveTicketsById,
    retrieveTicketByIdandTimestamp,
    retrieveTicketsByStatus,
    deleteTicketById,
    updateTicketAmountById,
    updateTicketStatusById
}