'use strict'

const attributeInspector = require('./helpers/attributeInspector')

const MetrcItems = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/items/v1/'
  const endpoint = function(end) {
    return endpointPrefix + end
  }
  
  const active = function() {
    return _metrc.get(endpoint('active'))
  }
  
  const categories = function() {
    return _metrc.get(endpoint('categories'))
  }
  
  const fetch = function(id) {
    return _metrc.get(endpoint(id))
  }
  
  const create = function(payload) {
    const itemName = payload.Name
    return _metrc.post(endpoint('create'), payload).
      then(function(results){
        return active();
      }).
      then(function(results) {
        let newItem;
        results.forEach(function(item){
          if (item.Name == itemName) {
            newItem = item;
          }
        });
        return newItem;
      });
  }
  
  const bulkCreate = function(payload) {
    const identifiers = attributeInspector.extractValues('Name', payload)
    return _metrc.post(endpoint('create'), payload).
      then(function() {
        return active()
      }).
      then(function(results) {
        return attributeInspector.findMatches('Name', identifiers, results)
      })
  }
  
  const update = function(payload) {
    const id = payload.Id
    return _metrc.post(endpoint('update'), payload).
      then(function() {
        return fetch(id)
      });
  }
  
  const doDelete = function(id) {
    return _metrc.delete(endpoint(id))
  }
  
  return {
    active: active,
    categories: categories,
    create: create,
    bulkCreate: bulkCreate,
    delete: doDelete,
    fetch: fetch,
    update: update
  }
}

module.exports = MetrcItems