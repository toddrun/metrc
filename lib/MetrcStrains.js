'use strict'

const attributeInspector = require('./helpers/attributeInspector')
const bulkHandler = require('./helpers/bulkHandler')
const PathMaker = require('./helpers/PathMaker')

const MetrcStrains = function(metrc) {
  const _metrc = metrc;
  const pathMaker = new PathMaker('/strains/v1/')
  
  const endpoint = (end) => {
    return pathMaker.endpoint(end)
  }
  
  const active = () => {
    return _metrc.get(endpoint('active'))
  }
  
  const fetch = (id) => {
    return _metrc.get(endpoint(id))
  }
  
  const callCreate = (payload) => {
    return _metrc.post(endpoint('create'), payload)
  }
  
  const create = (payload) => {
    const strainName = payload.Name
    return callCreate(payload).
      then((results) => {
        return active();
      }).
      then((results) => {
        let newStrain;
        const strains = typeof results == 'object' ? results : JSON.parse(results)
        strains.forEach((strain) => {
          if (strain.Name == strainName) {
            newStrain = strain
          }
        })
        return newStrain
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
    create: create,
    bulkCreate: bulkCreate,
    delete: doDelete,
    fetch: fetch,
    update: update,
    bulkUpdate: bulkUpdate
  }
}

module.exports = MetrcStrains