'use strict'

const attributeInspector = require('./helpers/attributeInspector')

const MetrcPackages = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/packages/v1/'
  const endpoint = (ending) => {
    return endpointPrefix + ending
  }
  
  const fetch = (id) => {
    return _metrc.get(endpoint(id))
  }
  
  const active = () => {
    return _metrc.get(endpoint('active'))
  }
  
  const inactive = () => {
    return _metrc.get(endpoint('inactive'))
  }
  
  const onhold = () => {
    return _metrc.get(endpoint('onhold'))
  }
  
  const types = () => {
    return _metrc.get(endpoint('types'))
  }
  
  const all = () => {
    let merged;
    return Promise.all([
      active(), inactive()
    ]).then((values) => {
      merged = [].concat.apply([], values)
      return merged
    })
    
  }
  
  const adjust = (payload) => {
    var label = payload.Label;
    return _metrc.post(endpoint('adjust'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  const callCreate = (payload) => {
    return _metrc.post(endpoint('create'), payload)
  }
  
  const create = (payload) => {
    var tag = payload.Tag;
    return callCreate(payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const bulkCreate = (payload) => {
    const extractedTags = attributeInspector.extractValues('Tag', payload)
    return callCreate(payload).then(() => {
      return active()
    }).then((results) => {
      return attributeInspector.findMatches('Label', extractedTags, results)
    })
    
  }
  
  const createTesting = (payload) => {
    var tag = payload.Tag;
    return _metrc.post(endpoint('create/testing'), payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const changeItem = (payload) => {
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
    bulkCreate: bulkCreate,
    createTesting: createTesting,
    changeItem: changeItem,
    fetch: fetch,
    inactive: inactive,
    onhold: onhold,
    types: types
  }
}

module.exports = MetrcPackages