'use strict'

const attributeInspector = require('./helpers/attributeInspector')
const PathMaker = require('./helpers/PathMaker')
const bulkHandler = require('./helpers/bulkHandler')

const MetrcHarvests = function(metrc) {
  const _metrc = metrc
  const pathMaker = new PathMaker('/harvests/v1/')
  
  const endpoint = (ending) => {
    return pathMaker.endpoint(ending)
  }
  
  const fetch = (id) => {
    return _metrc.get(endpoint(id))
  }
  
  const active = (options) => {
    return _metrc.get(endpoint('active'), options)
  }
  
  const inactive = (options) => {
    return _metrc.get(endpoint('inactive'), options)
  }
  
  const all = (options) => {
    let merged;
    return Promise.all([
      active(options), inactive(options)
    ]).then((values) => {
      merged = [].concat.apply([], values)
      return merged
    })
  }
  
  const onhold = (options) => {
    return _metrc.get(endpoint('onhold'), options)
  }
  
  const createPackages = (payload) => {
    const packages = Array.isArray(payload) ? payload : [ payload ]
    const extractedTags = attributeInspector.extractValues('Tag', packages)
    
    return _metrc.post(endpoint('createpackages'), packages).then(() => {
      return _metrc.get('/packages/v1/active')
    }).then((activePackages) => {
      return attributeInspector.findMatches('Label', extractedTags, activePackages)
    })
  }
  
  const removeWaste = (payload) => {
    const harvestId = payload.Id
    return _metrc.post(endpoint('removewaste'), payload).then(() => {
      return _metrc.get(endpoint(harvestId))
    })
  }
  
  const bulkRemoveWaste = (payload) => {
    const instructions = {
      post: removeWaste,
      get: active,
      attributeName: 'Id'
    }
    return bulkHandler.perform(instructions, payload)
  }
  
  const finish = (payload) => {
    var id = payload.Id;
    return _metrc.post(endpoint('finish'), payload).
      then(() => {
        return _metrc.get(endpoint(id));
      });
  }
  
  const unfinish = (payload) => {
    var id = payload.Id;
    return _metrc.post(endpoint('unfinish'), payload).
      then(() => {
        return _metrc.get(endpoint(id));
      });
  }
  
  return {
    fetch: fetch,
    all: all,
    active: active,
    inactive: inactive,
    onhold: onhold,
    createPackages: createPackages,
    removeWaste: removeWaste,
    bulkRemoveWaste: bulkRemoveWaste,
    finish: finish,
    unfinish: unfinish
  }
}

module.exports = MetrcHarvests