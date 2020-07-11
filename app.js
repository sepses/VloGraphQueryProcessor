var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getapiRouter = require('./routes/getapi');
var uploadRouter = require('./routes/upload');
var parsequeryRouter = require('./routes/parsequery');
var comunicaRouter = require('./routes/comunica');
var comunicaNoFedRouter = require('./routes/comunica-nofederation');
var testRouter = require('./routes/test');
var parseResourceRouter = require('./routes/parseresource');
var ApiCounterRouter = require('./routes/apicounter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/getapicounter', ApiCounterRouter);
app.use('/upload', uploadRouter);
app.use('/getapi', getapiRouter);
app.use('/parsequery', parsequeryRouter);
app.use('/comunica', comunicaRouter);
app.use('/comunicanofed', comunicaNoFedRouter);
app.use('/parseresource', parseResourceRouter);
app.use('/test', testRouter);

module.exports = app;
