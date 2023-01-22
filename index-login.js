const { retrieveUserByUsername, addUser } = require('./dao-login');
const express = require('express');
const bodyParser = require('body-parser');
const { createJWT, verifyTokenAndReturnPayload } = require('./jwt-util');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

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
            await addUser(req.body.username, req.body.password, req.body.role);
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

app.get('/user', async (req, res) => {
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
                "message": `YOU ARE NOT A REGULAR USER!!!! You are a ${payload.role}`
            })
        }

    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
});

app.get('/admin', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer' '<token>']
    
    try {
        const payload = await verifyTokenAndReturnPayload(token);

        if (payload.role === 'Finance Manager') {
            res.send({
                "message": `Welcome, Finance Manager ${payload.username}!`
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": `YOU ARE NOT A FINANCE MANAGER!!!! You are a ${payload.role}`
            })
        }

    } catch(err) { // token verification failure
        res.statusCode = 401;
        res.send({
            "message": "Token verification failure"
        })
    }
    
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});