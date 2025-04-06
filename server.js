const express = require('express');
const app     = express();
const port    = 3000;
const fs      = require('fs');

const cors    = require('cors');
app.use(cors());  

const userRouter = require('./User/user');
app.use('/user', userRouter);

app.listen(port, () => {
    console.log("server Start at 3000 port");
});
