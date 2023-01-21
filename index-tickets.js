const { addGroceryItem, retrieveAllGroceryItems, retrieveGroceryItemById, retrieveGroceryItemsByCategory,
    deleteGroceryItemById, updateGroceryNameById, updateGroceryQuantityById, 
    updateGroceryPriceById, updateGroceryCategoryById } = require('./dao');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.post('/groceryitems', async (req, res) => {
    try {
        await addGroceryItem(uuid.v4(), req.body.name, req.body.quantity, req.body.price, req.body.category);
        res.send({
            "message": "Successfully added item"
        });
    } catch(err) {
        res.statusCode = 500; 
        res.send({
            "message": err
        });
    }
});

app.get('/groceryitems', async (req, res) => {
    try {
        if (req.query.category) {
            let data = await retrieveGroceryItemsByCategory(req.query.category);
            if (data.Items.length > 0) {
                res.send(data.Items);
            } else {
                res.statusCode = 404;
                res.send({
                    "message": `There are no grocery items in the ${req.query.category} category on the list.`
                })
            }
        } else {
            let data = await retrieveAllGroceryItems();
            if (data.Items.length > 0) {
                res.send(data.Items);
            } else {
                res.statusCode = 404;
                res.send({
                    "message": "There are currently no grocery items on the list."
                })
            }
        }
    } catch(err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.get('/groceryitems/:id', async (req, res) => {
    try {
        let data = await retrieveGroceryItemById(req.params.id);

        if (data.Item) {
            res.send(data.Item);
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item with id ${req.params.id} does not exist`
            })
        }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.delete('/groceryitems/:id', async (req, res) => {

    try {
        let data = await retrieveGroceryItemById(req.params.id);
        if (data.Item) {
            await deleteGroceryItemById(req.params.id);
            res.send({
                "message": `Successfully deleted item with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item does not exist to be deleted with id ${req.params.id}`
            })
        }
    } catch(err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/groceryitems/:id/name', async (req, res) => {
    try {
        let data = await retrieveGroceryItemById(req.params.id);
        if (data.Item) {
            await updateGroceryNameById(req.params.id, req.body.name);
            res.send({
                "message": `Successfully updated name of item with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item does not exist with id ${req.params.id}`
            });
        }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/groceryitems/:id/quantity', async (req, res) => {
    try {
        let data = await retrieveGroceryItemById(req.params.id);
        if (data.Item) {
            await updateGroceryQuantityById(req.params.id, req.body.quantity);
            res.send({
                "message": `Successfully updated quantity of item with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item does not exist with id ${req.params.id}`
            });
        }
        
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/groceryitems/:id/price', async (req, res) => {
    try {
        let data = await retrieveGroceryItemById(req.params.id);
        if (data.Item) {
            await updateGroceryPriceById(req.params.id, req.body.price);
            res.send({
                "message": `Successfully updated price of item with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item does not exist with id ${req.params.id}`
            });
        }
        
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/groceryitems/:id/category', async (req, res) => {
    try {
        let data = await retrieveGroceryItemById(req.params.id);
        if (data.Item) {
            await updateGroceryCategoryById(req.params.id, req.body.category);
            res.send({
                "message": `Successfully updated category of item with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item does not exist with id ${req.params.id}`
            });
        }
        
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});