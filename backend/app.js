require('dotenv').config();
require('./models/connection')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var placesRouter = require('./routes/places');

var app = express();

const cors = require('cors');
app.use(cors({ "Access-Control-Allow-Origin": "*" }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/places', placesRouter);

module.exports = app;
