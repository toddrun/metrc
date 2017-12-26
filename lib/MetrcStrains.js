'use strict'

const attributeInspector = require('./helpers/attributeInspector')

const MetrcStrains = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/strains/v1/'
  const endpoint = function(end) {
    return endpointPrefix + end
  }
  
  const active = function() {
    return _metrc.get(endpoint('active'))
  }
  
  const fetch = function(id) {
    return _metrc.get(endpoint(id))
  }
  
  const create = function(payload) {
    const strainName = payload.Name
    return _metrc.post(endpoint('create'), payload).
      then(function(results){
        return active();
      }).
      then(function(results) {
        let newStrain;
        const strains = typeof results == 'object' ? results : JSON.parse(results)
        strains.forEach(function(strain){
          if (strain.Name == strainName) {
            newStrain = strain
          }
        })
        return newStrain
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
  
  const bulkUpdate = function(payload) {
    const ids = attributeInspector.extractValues('Id', payload)
    return _metrc.post(endpoint('update'), payload).
      then(function() {
        return active()
      }).
      then(function(results) {
        return attributeInspector.findMatches('Id', ids, results)
      })
  }
  
  const doDelete = function(id) {
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