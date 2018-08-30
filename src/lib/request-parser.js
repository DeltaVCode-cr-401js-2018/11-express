'use strict';

const url = require('url');	
const queryString = require('querystring');	
module.exports = (request) => {	
  return new Promise((resolve, reject) => {
    request.parsedUrl = url.parse(request.url);	
    request.query = queryString.parse(request.parsedUrl.query);	
    if (!request.method.match(/POST|PUT|PATCH/)) {	
      return resolve(request);	
    }	
    let text = '';	
    request.on('data', (buffer) => {	
      text += buffer.toString();	
    });	
    request.on('end', () => {	
      request.text = text;	
      try {	
        switch (request.headers['content-type']) {	
        case 'application/json':	
          request.body = JSON.parse(text);	
          break;	
        default:	
          request.body = text;	
          break;	
        }	
        resolve(request);	
      } catch(err) {	
        request.body = null;	
        reject(err);	
      }	
    });	
    request.on('err', reject);	
  });	
};
