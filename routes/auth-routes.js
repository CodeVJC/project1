const express = require('express');
const { createJWT } = require('./utility/jwt-util');
const router = express.Router();
const { retrieveUserByUsername, addUser } = require('./dao/dao-login');

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await retrieveUserByUsername(username);
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

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await retrieveUserByUsername(username);
    if (data.Item) { 
        res.statusCode = 400;
        res.send({
            "message": "That username already exists. Please choose another.",
        });
    } else {
        await addUser(username, password);
        res.send({
            "message": "Successfully registered. Please go to login page."
        });
    } 

});

module.exports = router;