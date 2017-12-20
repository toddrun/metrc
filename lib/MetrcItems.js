'use strict'

const MetrcItems = function(metrc) {
  const _metrc = metrc;
  
  const endpointPrefix = '/items/v1/'
  const endpoint = function(end) {
    return endpointPrefix + end
  }
  
  const active = function() {
    return _metrc.get(endpoint('active'))
  }
  
  
  return {
    active: active
  }
}

module.exports = MetrcItems