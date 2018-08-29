'use strict';

const router = require('../lib/router');
const Note = require('../models/notes');

router.get('/api/notes',(req,res) => {
  if(req.query.id) {
    return Note.findByID(req.query.id)
      .then(note => {
        json(res,note);
      });
  }
  
  Note.fetchAll()
    .then(notes => {
      json(res, notes);
    });
});

router.post('/api/notes', (req,res) => {
  var newNote = new Note(req.body);
  newNote.save()
    .then(saved => {
      json(res,saved);
    });
});

router.delete('/api/notes', (req,res) => {
  json(res, {
    message: `ID ${req.query.id} was deleted`,
  });
});

function json(res, object){
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(object));
  res.end();
}