'use strict';

import express from 'express';
const app = express();
const cowsay = require('cowsay');
export default app;

app.start = (port) =>{
  return new Promise((resolve, reject)=>{
    app.listen(port,(err,result)=>{
      if(err){
        reject(err);
      } else{
        resolve(result);
      }
    });
  });
};

app.use(express.json());

app.post('/500', (req, res) => {
  throw new Error('Test Error');
});
app.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});
app.get('/cowsay', (req, res) =>{
  var cowSays = cowsay.say({text: req.query.text});
  console.log({ cowSays });
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowSays}</pre></body></html>`);
});
app.get('/api/cowsay', (req, res) =>{
  json(res, {
    content: cowsay.say(req.query),
  });
});
app.get('/api/v1/notes', (req,res) =>{
  requestMessage(res, req.query.id);
});
app.post('/api/cowsay', (req, res) => {
  json(res, {
    message: `Hello, ${req.body.name}!`,
  });
});
app.post('/api/v1/notes', (req, res) =>{
  json(res, req.body);
});
app.put('/api/v1/notes', (req,res)=>{
  json(res, req.query);
});
app.delete('/api/v1/notes', (req,res)=>{
  deleteMessage(res, req.query.id);
});

import router from './routes/api';
app.use(router);

app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}
