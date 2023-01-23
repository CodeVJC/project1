const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
const authRouter = require('./routes/auth-routes');
const reimbRouter = require('./routes/ticket-routes');
app.use(bodyParser.json());
app.use(authRouter); 
app.use(reimbRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

