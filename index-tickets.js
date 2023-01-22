const { addTicket, retrieveAllTickets, retrieveTicketById, retrieveTicketsByCategory,
    deleteTicketById, updateTicketNameById, updateTicketQuantityById, 
    updateTicketPriceById, updateTicketCategoryById } = require('./dao-tickets');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("Hi everyone!!!!");
})

app.post('/tickets', async (req, res) => {
    try {
        await addTicket(uuid.v4(), req.body.name, req.body.quantity, req.body.price, req.body.category);
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

app.get('/tickets', async (req, res) => {
    try {
        if (req.query.category) {
            let data = await retrieveTicketsByCategory(req.query.category);
            if (data.Items.length > 0) {
                res.send(data.Items);
            } else {
                res.statusCode = 404;
                res.send({
                    "message": `There are no tickets in the ${req.query.category} category on the list.`
                })
            }
        } else {
            let data = await retrieveAllTickets();
            if (data.Items.length > 0) {
                res.send(data.Items);
            } else {
                res.statusCode = 404;
                res.send({
                    "message": "There are currently no tickets on the list."
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

app.get('/tickets/:id', async (req, res) => {
    try {
        let data = await retrieveTicketById(req.params.id);

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

app.delete('/tickets/:id', async (req, res) => {

    try {
        let data = await retrieveTicketById(req.params.id);
        if (data.Item) {
            await deleteTicketById(req.params.id);
            res.send({
                "message": `Successfully deleted ticket with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Ticket does not exist to be deleted with id ${req.params.id}`
            })
        }
    } catch(err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/tickets/:id/name', async (req, res) => {
    try {
        let data = await retrieveTicketById(req.params.id);
        if (data.Item) {
            await updateTicketNameById(req.params.id, req.body.name);
            res.send({
                "message": `Successfully updated name of ticket with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Ticket does not exist with id ${req.params.id}`
            });
        }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/tickets/:id/quantity', async (req, res) => {
    try {
        let data = await retrieveTicketById(req.params.id);
        if (data.Item) {
            await updateTicketQuantityById(req.params.id, req.body.quantity);
            res.send({
                "message": `Successfully updated quantity of ticket with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Ticket does not exist with id ${req.params.id}`
            });
        }
        
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/tickets/:id/price', async (req, res) => {
    try {
        let data = await retrieveTicketById(req.params.id);
        if (data.Item) {
            await updateTicketPriceById(req.params.id, req.body.price);
            res.send({
                "message": `Successfully updated price of ticket with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Ticket does not exist with id ${req.params.id}`
            });
        }
        
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.patch('/tickets/:id/category', async (req, res) => {
    try {
        let data = await retrieveTicketById(req.params.id);
        if (data.Item) {
            await updateTicketCategoryById(req.params.id, req.body.category);
            res.send({
                "message": `Successfully updated category of ticket with id ${req.params.id}`
            });
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Ticket does not exist with id ${req.params.id}`
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