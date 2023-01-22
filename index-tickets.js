const { addTicket, retrieveAllTickets, retrieveTicketsById, retrieveTicketByIdandTimestamp, retrieveTicketsByStatus,
    deleteTicketById, updateTicketAmountById, updateTicketStatusById } = require('./dao-tickets');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("Welcome to the home page.");
})

app.post('/tickets', async (req, res) => {
    try {
        await addTicket(req.body.user_id, req.body.timestamp, req.body.amount, req.body.status);
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
        if (req.query.status) {
            let data = await retrieveTicketsByStatus(req.query.status);
            if (data.Items.length > 0) {
                res.send(data.Items);
            } else {
                res.statusCode = 404;
                res.send({
                    "message": `There are no tickets in the ${req.query.status} status on the list.`
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

app.get('/user/tickets/:id', async (req, res) => {
    try {
        let data = await retrieveTicketsById(req.params.id);
        if (data.Items) {
            res.send(data.Items);
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Tickets with id ${req.params.id} do not exist`
            })
        }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }
});

app.get('/tickets/:id/:timestamp', async (req, res) => {
    try {
        let data = await retrieveTicketByIdandTimestamp(req.params.id, req.params.timestamp);
        if (data.Item) {
            res.send(data.Item);
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Tickets with id ${req.params.id} and timestamp ${req.params.timestamp} do not exist`
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
        let data = await retrieveTicketByIdandTimestamp(req.params.id);
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

app.patch('/tickets/:id/amount', async (req, res) => {
    try {
        let data = await retrieveTicketByIdandTimestamp(req.params.id);
        if (data.Item) {
            await updateTicketAmountById(req.params.id, req.body.amount);
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

app.patch('/tickets/:id/status', async (req, res) => {
    try {
        let data = await retrieveTicketByIdandTimestamp(req.params.id);
        if (data.Item) {
            await updateTicketStatusById(req.params.id, req.body.status);
            res.send({
                "message": `Successfully updated status of ticket with id ${req.params.id}`
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