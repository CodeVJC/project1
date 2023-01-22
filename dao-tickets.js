const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addTickets(ticket_id, name, quantity, price, category) {
    const params = {
        TableName: 'tickets',
        Item: {
            ticket_id,
            name,
            quantity,
            price,
            category
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

function retrieveTicketById(id) {
    const params = {
        TableName: 'tickets',
        Key: {
            "ticket_id": id
        }
    }
    return docClient.get(params).promise();
}

function retrieveTicketsByCategory(category) {
    const params = {
        TableName: 'tickets',
        IndexName: 'category-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {
            '#c': 'category'
        },
        ExpressionAttributeValues: {
            ':value': category
        }
    };

    return docClient.query(params).promise();
}

function deleteTicketsById(ticket_id) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        }
    }

    return docClient.delete(params).promise();
}

function updateTicketNameById(ticket_id, newName) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'name'
        },
        ExpressionAttributeValues: {
            ':value': newName
        }
    }
    return docClient.update(params).promise();
}

function updateTicketQuantityById(ticket_id, newQuantity) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'quantity'
        },
        ExpressionAttributeValues: {
            ':value': newQuantity
        }
    }
    return docClient.update(params).promise();
}

function updateTicketPriceById(ticket_id, newPrice) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'price'
        },
        ExpressionAttributeValues: {
            ':value': newPrice
        }
    }
    return docClient.update(params).promise();
}

function updateTicketCategoryById(ticket_id, newCategory) {
    const params = {
        TableName: 'tickets',
        Key: {
            ticket_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'category'
        },
        ExpressionAttributeValues: {
            ':value': newCategory
        }
    }
    return docClient.update(params).promise();
}

module.exports = {
    addTickets,
    retrieveAllTickets,
    retrieveTicketById,
    retrieveTicketsByCategory,
    deleteTicketById,
    updateTicketNameById,
    updateTicketQuantityById,
    updateTicketPriceById,
    updateTicketCategoryById
}