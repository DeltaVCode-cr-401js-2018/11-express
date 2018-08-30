'use strict';

const request = require('supertest');

import app from '../src/app';
import Note from'../src/models/notes';

describe('app', () => {
  it('responds with 404 for unknown path', () => {
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('responds with html for /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response => {
        expect(response.text[0]).toBe('<');
      });
  });

  it('responds with message for POST', () => {
    return request(app)
      .post('/api/test')
      .send({ text: 'Hello, world!' })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(res => {
        expect(res.body).toBeDefined();
        expect(res.body.message).toBe('Hello, world!');
      });
  });

  it('responds with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
});

describe('api routes', () => {
  it('can get api notes', () => {
    var notes = [
      new Note({title: 'test 1', content: 'A'}),
      new Note({title: 'test 1', content: 'B'}),
      new Note({title: 'test 1', content: 'C'}),
    ];

    return Promise.all(
      notes.map(note => note.save())
    ).then(savedNotes => {
      return request(app)
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(savedNotes);
    });
  });

  it('can get /api/notes:id', () => {
    var note = new Note({ title: 'save', content: 'this'});

    return note.save()
      .then(saved => {
        return request(app)
          .get(`/api/notes/${saved.id}`)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(saved);
      });
  });

  it('returns 400 for POST /api/notes without body', () => {
    return request(app)
      .post('/api/notes')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send('this is not json')
      .expect(400);
  });
  it('returns 400 for POST /api/notes with empty body', () => {
    return request(app)
      .post('/api/notes')
      .send({})
      .expect(400);
  });

  it('can POST /api/notes to create note', () => {
    return request(app)
      .post('/api/notes')
      .send({ title: 'test', content: 'Working'})
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(res => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.title).toBe('test');
        expect(res.body.content).toBe('Working');
      });
  });

  it('can delete /api/notes/deleteme', () => {
    return request(app)
      .delete('/api/notes/deleteme')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({ message: `ID deleteme was deleted`});
  });
});
