'use strict';

import Storage from '../storage';
const heroStore = new Storage('Heroes');

export default class Hero {
  constructor(obj) {
    if (!obj) throw new Error('obj is required!');

    this.name = obj.name;
    this.universe = obj.universe;
    this.power = obj.power;
  }

  save() {
    return heroStore.save(this);
  }

  static fetchAll() {
    return heroStore.getAll();
  }

  static findById(id) {
    return heroStore.get(id);
  }
}