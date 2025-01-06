const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use('/', route);

mongoose.connect("mongodb://127.0.0.1:27017/")
.then(() => console.log('Successfully connected to mongoDB 27017'))
.catch(err => console.log('Connection error - ', err.message));

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});