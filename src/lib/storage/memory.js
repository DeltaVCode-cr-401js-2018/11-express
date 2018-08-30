'use strict';

import uuid from 'uuid/v4';

export default class MemoryStorage {
  constructor(schema){
    this.schema = schema;
    this.data = {};
  }

  save(doc) {
    if(typeof doc !== 'object'){
      return Promise.reject(new Error(
        `Failed to save non-object to "${this.schema}"`
      ));
    }

    doc.id = uuid();
    this.data[doc.id] = doc;
    return Promise.resolve(doc);
  }

  get(id){
    return new Promise((resolve,reject) => {
      var result = this.data[id];
      if(result) {
        resolve(result);
      }
      else {
        reject(new Error(
          `Document with id "${id}" in schema "${this.schema}" not found`
        ));
      }
    });
  }

  getAll(){
    return Promise.resolve(
      Object.values(this.data)
    );
  }
}