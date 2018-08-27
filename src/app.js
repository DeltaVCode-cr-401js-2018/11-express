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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
  res.json({
    content: cowsay.say(req.query),
  });
});
app.get('/api/v1/notes', (req,res) =>{
  requestMessage(res, req.query.id);
});
app.post('/api/cowsay', (req, res) => {
  res.json({
    message: `Hello, ${req.body.name}!`,
  });
});
app.post('/api/v1/notes', (req, res) =>{
  res.json(req.body);
});
app.put('/api/v1/notes', (req,res)=>{
  res.json(req.params);
});
app.delete('/api/v1/notes', (req,res)=>{
  deleteMessage(res, req.params.id);
});

app.get('/person', (req, res) => {
  html(res, `<!DOCTYPE html><html><head><title> person </title></head><body><h1> Person </h1><p> Hello. I am a normal person </p></body></html>`);
});

app.get('/api/v1/person', (req,res) =>{
  requestMessage(res, req.params.id);
});

app.post('/api/v1/person', (req, res) => {
  res.json(req.body);
});

app.put('/api/v1/person', (req, res) => {
  res.json(req.params);
});
app.delete('/api/v1/person', (req, res) => {
  deleteMessage(res, req.params.id);
})

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
