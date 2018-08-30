'use strict';

import express from 'express';
const app = express();

export default app;

app.start = (port) => 
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if (err) {
        rejectCallback(err);
      }
      else {
        resolveCallback(result);
      }
    });
  });

app.use(express.json());

app.use((req,res,next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/500', (req,res) => {
  throw new Error('Test Error');
});

app.get('/', (req,res) => {
  html(res, '<html><body><h1>HOME</h1></body></html>');
});

app.post('/api/test', (req, res) => {
  res.json({
    message: req.body.text,
  });
});

import router from './routes/api';
app.use(router);
app.use((err,req,res,next) => {
  console.error(err);
  next(err);
});

function html(res,content, statusCode =200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}