const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');
const mongoose = require('mongoose');
const {checkConncetion} = require("./Db/db");
const app = express();

app.use(bodyParser.json());
app.use('/', route);


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});

const checkDatabaseResponse = checkConncetion();
console.log(checkDatabaseResponse);