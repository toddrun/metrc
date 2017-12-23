'use strict'

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
    create: create,
    delete: doDelete,
    fetch: fetch,
    update: update
  }
}

module.exports = MetrcStrains