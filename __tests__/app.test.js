'use strict';

const request = require('supertest');

const app = require('../src/app');
const Note = require('../src/models/note');

describe('app', () => {
  it('responds with 404 for unknown path', () => {
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html')
      .expect('Resource Not Found');
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
      .send({ test: 'Hello world'})
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(res => {
        expect(res.body).toBeDefined();
        expect(res.body.message).toBe('Hello, world!');
      });
  });

  it('responds with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html')
      .expect('Test Error');
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
        .expect('Content-Type', 'application/json')
        .expect(savedNotes);
    });
  });

  it('can get /api/notes?id=...', () => {
    var note = new Note({ title: 'save', content: 'this'});

    return note.save()
      .then(saved => {
        return request(app)
          .get(`/api/notes?id=${saved.id}`)
          .expect(200)
          .expect('Content-Type', 'application/json')
          .expect(saved);
      });
  });

  it('can POST /api/notes to create note', () => {
    return request(app)
      .post('/api/notes')
      .send({ title: 'test', content: 'Working'})
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(res => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.title).toBe('test');
        expect(res.body.content).toBe('Working');
      });
  });

  it('can delete /api/notes?id=deleteme', () => {
    return request(app)
      .delete('/api/notes?id=deleteme')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect({ message: `ID deleteme was delted`});
  });
});
