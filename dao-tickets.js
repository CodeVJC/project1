const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addGroceryItem(grocery_item_id, name, quantity, price, category) {
    const params = {
        TableName: 'grocery_items',
        Item: {
            grocery_item_id,
            name,
            quantity,
            price,
            category
        }
    }

    return docClient.put(params).promise();
}

function retrieveAllGroceryItems() {
    const params = {
        TableName: 'grocery_items'
    }

    return docClient.scan(params).promise();
}

function retrieveGroceryItemById(id) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            "grocery_item_id": id
        }
    }
    return docClient.get(params).promise();
}

function retrieveGroceryItemsByCategory(category) {
    const params = {
        TableName: 'grocery_items',
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

function deleteGroceryItemById(grocery_item_id) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
        }
    }

    return docClient.delete(params).promise();
}

function updateGroceryNameById(grocery_item_id, newName) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
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

function updateGroceryQuantityById(grocery_item_id, newQuantity) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
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

function updateGroceryPriceById(grocery_item_id, newPrice) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
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

function updateGroceryCategoryById(grocery_item_id, newCategory) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
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
    addGroceryItem,
    retrieveAllGroceryItems,
    retrieveGroceryItemById,
    retrieveGroceryItemsByCategory,
    deleteGroceryItemById,
    updateGroceryNameById,
    updateGroceryQuantityById,
    updateGroceryPriceById,
    updateGroceryCategoryById
}