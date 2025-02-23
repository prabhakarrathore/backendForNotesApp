require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser');
const POST = process.env.POST || 8000;
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const { dbConnect } = require('./config/dbConnect');
const mongoose = require('mongoose');

dbConnect();
// live the project
app.use(credentials);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', require('./Routes/root'));
app.use('/register', require('./Routes/register'));
app.use('/auth', require('./Routes/auth'));
app.use('/logout', require('./Routes/logout'));
app.use('/refresh', require('./Routes/refresh'));

app.use(verifyJWT)
app.use('/user', require('./Routes/api/user'));
app.use('/notes', require('./Routes/api/notes'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not found" });
    }
    else {
        res.type('txt').send("Not found");
    }
})

mongoose.connection.once('open', () => {
    console.log('connect to db');
    app.listen(POST, () => { console.log(`Server Running on port ${POST}`) });
})
