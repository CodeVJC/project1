const express = require('express');
const { verifyTokenAndReturnPayload } = require('./utility/jwt-util');
const router = express.Router();
const { addTicket, retrieveAllTickets, retrieveTicketsById, retrieveTicketsByIdandStatus, retrieveTicketByStatus,
    retrieveTicketByTimestamp, updateTicketStatusByTimestamp } = require('./dao/dao-tickets');

const timestamp = require('unix-timestamp');
timestamp.round = true;

router.get('/', (req, res) => {
    res.send("Welcome to the home page.");
})

router.get('/employee', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            res.send({
                "message": `Welcome, employee ${payload.username}!`
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a regular employee. You are a ${payload.role}`
            })
        }
    } catch(err) { 
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

router.post('/employee', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
                await addTicket(payload.username, timestamp.now(), req.body.amount, req.body.description);
                res.send({
                    "message": "Successfully added item"
                });
            } catch(err) {
                res.statusCode = 500; 
                res.send({
                    "message": err
                });
            }
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a regular employee. You are a ${payload.role}`
            })
        }
    } catch(err) { 
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

router.get('/employee/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
                if (req.body.status) {
                    let data = await retrieveTicketsByIdandStatus(req.params.id, req.body.status);
                    if (req.params.id != payload.username) {
                        res.send('You can only review your own tickets.');
                    } else if (data.Items.length > 0) {
                        res.send(data.Items);
                    } else {
                        res.statusCode = 404;
                        res.send({
                            "message": `There are no tickets in the ${req.body.status} status on the list.`
                        })
                    }
                } else {
                    let data = await retrieveTicketsById(req.params.id);
                    if (req.params.id != payload.username) {
                        res.send('You can only review your own tickets.');
                    } else if (data.Items) {
                        res.send(data.Items);
                    } else {
                        res.statusCode = 404;
                        res.send({
                            "message": `Tickets with id ${req.params.id} do not exist`
                        })
                    }
                }
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a regular employee. You are a ${payload.role}`
            })
        }
    } catch(err) {
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

router.get('/manager', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'manager') {
            res.send({
                "message": `Welcome, manager ${payload.username}!`
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a manager. You are an ${payload.role}`
            })
        }
    } catch(err) {
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    } 
});

router.get('/manager/tickets', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'manager') {
            try {
                let data = await retrieveTicketByStatus(req.query.status);
                if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.send('There are no pending tickets.')
                }
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a manager. You are a ${payload.role}`
            })
        }
    } catch(err) {
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

router.patch('/manager/tickets', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'manager') {
            try {
                let data = await retrieveTicketByTimestamp(req.body.user_id, req.body.timestamp);
                if (data.Items) {
                    await updateTicketStatusByTimestamp(req.body.user_id, req.body.timestamp, req.body.status);
                    res.send({
                        "message": `Successfully updated status of ticket with timestamp ${req.body.timestamp}`
                    });
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `Ticket does not exist with timestamp ${req.body.timestamp}`
                    });
                }       
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a manager. You are a ${payload.role}`
            })
        }
    } catch(err) {
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

module.exports = router;