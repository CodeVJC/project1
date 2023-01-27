const express = require('express');
const { verifyTokenAndReturnPayload } = require('../utility/jwt-util');
const router = express.Router();
const { addTicket, retrieveAllTickets, retrieveTicketsByUsername, retrieveTicketsByUsernameandStatus, retrieveTicketsByStatus,
    retrieveTicketByUsernameAndTimestamp, updateTicketStatusByTimestamp, retrieveTicketsByUsernameandType } = require('../dao/dao-tickets');
const timestamp = require('unix-timestamp');
timestamp.round = true;

//project requirement 2 and stretch goal 1
router.post('/tickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
                if ( (req.body.amount <= 0 || req.body.amount > 10000) ) {
                    res.statusCode = 400; 
                    res.send({
                        "message": "You need to provide a valid amount."
                    });
                } else if (req.body.description.length == 0) {
                    res.send({
                        "message": "You need to provide a description."
                    });
                } else if (req.body.type !== 'travel' && req.body.type !== 'lodging' && req.body.type !== 'food' && req.body.type !== 'other') {
                    res.statusCode = 400; 
                    res.send({
                        "message": "You need to provide a valid type of reimbursement (travel, lodging, food or other)."
                    });
                } else {
                    await addTicket(payload.username, timestamp.now(), req.body.amount, req.body.description, req.body.type);
                    res.statusCode = 201; 
                    res.send({
                        "message": "Successfully added ticket."
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
                "message": `You aren't a regular employee. You are a ${payload.role}.`
            })
        }
    } catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({
                "message": "Invalid JWT"
            })
        } else if (err) {
            res.statusCode = 500;
            res.send({
                "message": "no JWT"
            });
        }
    }
});

//project requirements 3 and 4 and stretch goal 1
router.get('/tickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
                if (req.query.type) {
                    let data = await retrieveTicketsByUsernameandType(payload.username, req.query.type);
                    if (req.query.type !== 'travel' && req.query.type !== 'lodging' && req.query.type !== 'food' && req.query.type !== 'other') {
                        res.statusCode = 401;
                        res.send({
                            "message": `${req.query.type} is not a valid ticket type.`
                        })
                    } else if (data.Items.length > 0) {
                        res.send(data.Items);
                    } else {
                        res.statusCode = 404;
                        res.send({
                            "message": `You have no tickets with type ${req.query.type}.`
                        })
                    }  
                } else if (req.query.status) {
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
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        } else if (payload.role === 'manager') {
            try {
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
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        }
    } catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({
                "message": "Invalid JWT"
            })
        } else if (err) {
            res.statusCode = 500;
            res.send({
                "message": "no JWT"
            });
        }
    }
});

//project requirement 4
router.patch('/tickets/:username/:timestamp/status', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'manager') {
            try {
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
                            "message": `You must either choose approved or denied, ${req.body.status} is not an option.`
                        })                        
                    } else {
                        await updateTicketStatusByTimestamp(req.params.username, Number(req.params.timestamp), req.body.status.toLowerCase());
                        res.send({
                        "message": `Successfully updated status of ticket to ${req.body.status}.`
                        });
                    }
                }                    
            } catch (err) {
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
        } else if (err) {
            res.statusCode = 500;
            res.send({
                "message": "no JWT"
            });
        }
    }
});

module.exports = router;