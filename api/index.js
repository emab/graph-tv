import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import api from './api.js';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api/', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
