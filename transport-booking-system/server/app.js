const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//test route
app.get('/', (req, res) => {
    res.send('Transport Booking API is running...');
});

module.exports = app;