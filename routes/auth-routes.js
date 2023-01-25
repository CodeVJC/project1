const express = require('express');
const { createJWT } = require('../utility/jwt-util');
const router = express.Router();
const { retrieveUsername, addUser } = require('../dao/dao-login');

router.get('/', (res) => {
    res.send("Welcome to the home page.");
})

//project requirement 1
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await retrieveUsername(username);
    if (data.Item) { 
        res.statusCode = 400;
        res.send({
            "message": "That username already exists. Please choose another.",
        });
    } else {
        await addUser(username, password);
        res.statusCode = 201; 
        res.send({
            "message": "Successfully registered. Please go to login page."
        });
    } 

});

//project requirement 1
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await retrieveUsername(username);
    const userItem = data.Item;
    if (userItem) {
        if (userItem.password === password) {
            res.send({
                "message": "Successfully authenticated",
                "token": createJWT(userItem.username, userItem.role)
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

module.exports = router;