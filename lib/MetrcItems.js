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
  
  const categories = function() {
    return _metrc.get(endpoint('categories'))
  }
  
  return {
    active: active,
    categories: categories
  }
}

module.exports = MetrcItems