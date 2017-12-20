'use strict'

const MetrcPackages = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/packages/v1/'
  const endpoint = function(end) {
    return endpointPrefix + end
  }
  
  const fetch = function(id) {
    return _metrc.get(endpoint(id))
  }
  
  const active = function() {
    return _metrc.get(endpoint('active'))
  }
  
  const inactive = function() {
    return _metrc.get(endpoint('inactive'))
  }
  
  const onhold = function() {
    return _metrc.get(endpoint('onhold'))
  }
  
  const all = function() {
    let merged;
    return Promise.all([
      active(), inactive()
    ]).then((values) => {
      merged = [].concat.apply([], values)
      return merged
    })
    
  }
  
  const create = function(payload) {
    var tag = payload.Tag;
    return _metrc.post(endpoint('create'), payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  return {
    all: all,
    active: active,
    create: create,
    fetch: fetch,
    inactive: inactive,
    onhold: onhold
  }
}

module.exports = MetrcPackages