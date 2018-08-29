'use strict';

const http = require('http');

const router = require('./lib/router');

const app = http.createServer(requestHandler);
module.exports = app;

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

function requestHandler(req,res) {
  console.log(`${req.method} ${req.url}`);

  router.route(req,res)
    .catch(err => {
      if(err === 404){
        notFound(res);
        return;
      }
      console.log(err);
      html(res,err.message, 500, 'Internal Server Error');
    });
}

router.post('/500', (req,res) => {
  throw new Error('Test Error');
});

router.get('/', (req,res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});

router.get('/cowsay', (req,res) => {
  let message = req.query.text?cowsay.say({text: req.query.text}):cowsay.say({text: 'I need something good to say!'});
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title></head><body><h1> cowsay </h1><pre>${message}</pre></html>`);
});
  
router.get('/api/cowsay', (req,res) => {
  json(res,{
    text: req.query.text,
  });
});

require('./routes/api');

function html(res,content, statusCode =200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function json(res, object){
  if(object!=={}){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}

function notFound(res){
  res.statusCode = 404;
  res.statusMessage = 'NotFound';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}