const { addTicket, retrieveAllTickets, retrieveTicketsById, retrieveTicketByIdandTimestamp, retrieveTicketsByStatus,
    deleteTicketById, updateTicketAmountById, updateTicketStatusById } = require('./dao-tickets');
const { retrieveUserByUsername, addUser } = require('./dao-login');
const express = require('express');
const bodyParser = require('body-parser');
const { createJWT, verifyTokenAndReturnPayload } = require('./jwt-util');
const timestamp = require('unix-timestamp');
timestamp.round = true;
const PORT = 3000;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Welcome to the home page.");
})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await retrieveUserByUsername(username);
    const userItem = data.Item;
    if (userItem) { // See if user with username supplied actually exists
        if (userItem.password === password) {
            // Successful login
            // Create a JWT
            const token = createJWT(userItem.username, userItem.role);

            res.send({
                "message": "Successfully authenticated",
                "token": token
            });
        } else {
            res.statusCode = 400;
            res.send({
                "message": "Invalid password"
            })
        }
    } else {
        res.statusCode = 400;
        res.send({
            "message": `User with username ${username} does not exist`
        })
    } 
});

app.post('/signup', async (req, res) => {
    try {
        const username = req.body.username;
        const data = await retrieveUserByUsername(username);
        const userItem = data.Item;
        if (userItem) { // See if user with username supplied actually exists
            res.send({
                "message": "That username already exists. Please choose another.",
            });
        } else {
            await addUser(req.body.username, req.body.password);
            res.send({
                "message": "Successfully registered. Please go to login page."
            });
        } 
    } catch(err) {
        res.statusCode = 500; 
        res.send({
            "message": err
        });
    }
});

app.get('/employee', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>']
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
    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

app.post('/employee', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>']
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
                await addTicket(payload.username, String(timestamp.now()), req.body.amount, req.body.description);
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
    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

app.get('/employee/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>']
    try {
        const payload = await verifyTokenAndReturnPayload(token);
        if (payload.role === 'employee') {
            try {
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
            } catch (err) {
                res.statusCode = 500;
                res.send({
                    "message": err
                });
            }
        }
    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

app.get('/manager', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer' '<token>']
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
    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
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

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
