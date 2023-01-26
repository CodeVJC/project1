const express = require('express');
const { verifyTokenAndReturnPayload } = require('../utility/jwt-util');
const router = express.Router();
const { addTicket, retrieveAllTickets, retrieveTicketsByUsername, retrieveTicketsByUsernameandStatus, retrieveTicketsByStatus,
    retrieveTicketByUsernameAndTimestamp, updateTicketStatusByTimestamp } = require('../dao/dao-tickets');
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
            res.statusCode = 500;
        }
    }
});

//project requirements 3 and 4
router.get('/tickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            if (req.query.status) {
                let data = await retrieveTicketsByUsernameandStatus(payload.username, req.query.status);
                if (req.query.status !== 'pending' && req.query.status !== 'approved' && req.query.status !== 'denied'){
                    res.statusCode = 401;
                    res.send({
                        "message": `${req.query.status} is not a valid ticket status.`
                    })
                } else if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `You have no tickets in the ${req.query.status} status.`
                    })
                }
            } else {
                let data = await retrieveTicketsByUsername(payload.username);
                if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `Tickets for your username ${payload.username} do not exist.`
                    })
                }
            }
        } else {
            if (req.query.status) {
                let data = await retrieveTicketsByStatus(req.query.status);
                if (req.query.status !== 'pending' && req.query.status !== 'approved' && req.query.status !== 'denied'){
                    res.statusCode = 401;
                    res.send({
                        "message": `${req.query.status} is not a valid ticket status.`
                    })
                } else if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `There are no tickets with ${req.query.status} status.`
                    })
                }
            } else {
                let data = await retrieveAllTickets();
                if (data.Items.length > 0) {
                    res.send(data.Items);
                } else {
                    res.statusCode = 404;
                    res.send({
                        "message": `There are no tickets.`
                    })
                }
            }
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
            res.statusCode = 500;
        }
    }
});

//project requirement 4
router.patch('/tickets/:username/:timestamp/status', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'manager') {
            let data = await retrieveTicketByUsernameAndTimestamp(req.params.username, Number(req.params.timestamp));
            if (data.Items) {
                if (data.Items[0].status === "approved" || data.Items[0].status === "denied"){
                    res.statusCode = 401;
                    res.send({
                        "message": `You've already dispositioned this ticket with ${data.Items[0].status} status.`
                    })
                } else if (req.body.status.toLowerCase() !== "approved" && req.body.status.toLowerCase() !== "denied") {
                    res.statusCode = 401;
                    res.send({
                        "message": `You must either choose "approved" or "denied," ${req.body.status} is not an option.`
                    })                        
                } else {
                    await updateTicketStatusByTimestamp(req.params.username, Number(req.params.timestamp), req.body.status.toLowerCase());
                    res.send({
                    "message": `Successfully updated status of ticket to ${req.body.status}.`
                    });
                }
            } else {
                res.statusCode = 404;
                res.send({
                    "message": `Ticket does not exist with user ${req.params.username} or timestamp ${Number(req.params.timestamp)}.`
                });
            }       
        } else {
            res.statusCode = 401;
            res.send({
                "message": `You are an ${payload.role} and don't have the authority to update ticket status.`
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
            res.statusCode = 500;
        }
    }
});

module.exports = router;