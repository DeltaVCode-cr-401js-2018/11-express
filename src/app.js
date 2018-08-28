'use strict';

import express from 'express';
const app = express();

export default app;
import cowsay from 'cowsay';

app.start = (port) =>
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if (err) {
        rejectCallback(err);
      } else {
        resolveCallback(result);
      }
    });
  });

app.use(express.json());
app.use((req, res, next)=> {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/500', (req, res)=> {
  throw new Error('Test Error');
});

app.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><p>Server practice from week 2 & 3 labs</p></main></body></html>');
});

app.get('/cowsay', (req,res) => {
  let message = req.query.text?cowsay.say({text: req.query.text}):cowsay.say({text: 'I need something good to say!'});
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title></head><body><h1> cowsay </h1><pre>${message}</pre></html>`);
});

app.get('/api/cowsay', (req, res) =>{
  res.json({
    content: cowsay.say(req.query),
  });
});


import router from './routes/api';
app.use(router);
app.use ((err, req, res, next)=> {
  console.error(err);
  next(err);
});


function html(res, content, statusCode = 200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}