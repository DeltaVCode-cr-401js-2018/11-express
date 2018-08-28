'use strict';

import express from 'express';
const router = express.Router();

export default router;

import Hero from '../models/hero';

router.get('/api/heroes', (req, res)=> {
  Hero.fetchAll()
    .then(heroes => {
      res.json(heroes);
    });
});

router.post('/api/heroes', (req, res)=> {
  router.post('/api/heroes', (req, res)=> {
    if (!req.body || !req.body.name || !req.body.universe || !req.body.power) {
      res.send(400);
      res.end();
      return;
    }
    var newHero = new Hero(req.body);
    newHero.save()
      .then(saved => {
        res.json(saved);
      });
  });

  router.get('/api/heroes/:id', (req, res)=> {
    return Hero.findById(req.params.id)
      .then(note => {
        res.json(note);
      });
  });
});