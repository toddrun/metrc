'use strict'

const PathMaker = require('./helpers/PathMaker')

const MetrcPlants = function(metrc) {
  const _metrc = metrc
  const pathMaker = new PathMaker('/plants/v1/')
  
  const endpoint = (ending) => {
    return pathMaker.endpoint(ending)
  }
  
  const fetch = (id) => {
    return _metrc.get(endpoint(id))
  }
  
  
  return {
    fetch: fetch,
  }
}

module.exports = MetrcPlants