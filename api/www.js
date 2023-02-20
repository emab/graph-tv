#!/usr/bin/env node
import app from './index.js';
import http from 'http';


var port = Number(process.env.PORT || '3001');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);

