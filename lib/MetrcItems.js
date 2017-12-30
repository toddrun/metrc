'use strict'

const bulkHandler = require('./helpers/bulkHandler')

const MetrcItems = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/items/v1/'
  const endpoint = (ending) => {
    return endpointPrefix + ending
  }
  
  const active = () => {
    return _metrc.get(endpoint('active'))
  }
  
  const categories = () => {
    return _metrc.get(endpoint('categories'))
  }
  
  const fetch = (id) => {
    return _metrc.get(endpoint(id))
  }
  
  const callCreate = (payload) => {
    return _metrc.post(endpoint('create'), payload)
  }
  
  const create = (payload) => {
    const itemName = payload.Name
    return callCreate(payload).
      then((results) => {
        return active();
      }).
      then((results) => {
        let newItem;
        results.forEach((item) => {
          if (item.Name == itemName) {
            newItem = item;
          }
        });
        return newItem;
      });
  }
  
  const bulkCreate = (payload) => {
    const instructions = {
      post: callCreate,
      get: active,
      attributeName: 'Name'
    }
    return bulkHandler.perform(instructions, payload)
  }
  
  const callUpdate = (payload) => {
    return _metrc.post(endpoint('update'), payload)
  }
  
  const update = (payload) => {
    const id = payload.Id
    return callUpdate(payload).
      then(() => {
        return fetch(id)
      });
  }
  
  const bulkUpdate = (payload) => {
    const instructions = {
      post: callUpdate,
      get: active,
      attributeName: 'Id'
    }
    return bulkHandler.perform(instructions, payload)
  }
  
  const doDelete = (id) => {
    return _metrc.delete(endpoint(id))
  }
  
  return {
    active: active,
    categories: categories,
    create: create,
    bulkCreate: bulkCreate,
    delete: doDelete,
    fetch: fetch,
    update: update,
    bulkUpdate: bulkUpdate
  }
}

module.exports = MetrcItems