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
  
  const types = function() {
    return _metrc.get(endpoint('types'))
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
  
  const adjust = function(payload) {
    var label = payload.Label;
    return _metrc.post(endpoint('adjust'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  const create = function(payload) {
    var tag = payload.Tag;
    return _metrc.post(endpoint('create'), payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const createTesting = function(payload) {
    var tag = payload.Tag;
    return _metrc.post(endpoint('create/testing'), payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const changeItem = function(payload) {
    var label = payload.Label;
    return _metrc.post(endpoint('change/item'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  return {
    all: all,
    active: active,
    adjust: adjust,
    create: create,
    createTesting: createTesting,
    changeItem: changeItem,
    fetch: fetch,
    inactive: inactive,
    onhold: onhold,
    types: types
  }
}

module.exports = MetrcPackages