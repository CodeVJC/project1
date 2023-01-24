const express = require('express');
const { verifyTokenAndReturnPayload } = require('../utility/jwt-util');
const router = express.Router();
const { addTicket, retrieveAllTickets, retrieveTicketsByUsername, retrieveTicketsByUsernameandStatus, retrieveTicketByStatus,
    retrieveTicketByTimestamp, updateTicketStatusByTimestamp } = require('../dao/dao-tickets');

const timestamp = require('unix-timestamp');
timestamp.round = true;

//project requirement 2
router.post('/tickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            await addTicket(payload.username, timestamp.now(), req.body.amount, req.body.description);
            res.statusCode = 201; 
            res.send({
                "message": "Successfully added ticket."
            });
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You aren't a regular employee. You are a ${payload.role}.`
            })
        }
    } catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({
                "message": "Invalid JWT"
            })
        } else if (err.name === 'TypeError') {
            res.statusCode = 400;
            res.send({
                "message": "No Authorization header provided"
            });
        } else {
            res.statusCode = 500; // 500 internal server error
        }
    }
});

//project requirement 4
router.get('/tickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            if (req.query.status) {
                let data = await retrieveTicketsByUsernameandStatus(payload.username, req.query.status);
                if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `There are no tickets in the ${req.query.status} status on the list.`
                    })
                }
            } else {
                let data = await retrieveTicketsByUsername(payload.username);
                if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `Tickets for username ${payload.username} do not exist.`
                    })
                }
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

//project requirement 3
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
                let data = await retrieveTicketByTimestamp(req.body.username, req.body.timestamp);
                if (data.Items) {
                    await updateTicketStatusByTimestamp(req.body.username, req.body.timestamp, req.body.status);
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