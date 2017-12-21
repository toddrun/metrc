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
  
  const create = function(payload) {
    const itemName = payload.Name
    return _metrc.post(endpoint('create'), payload).
      then(function(results){
        return active();
      }).
      then(function(results) {
        let newItem;
        const allItems = typeof results == 'object' ? results : JSON.parse(results)
        allItems.forEach(function(item){
          if (item.Name == itemName) {
            if (!newItem || (item.Id > newItem.Id)) {
              newItem = item;
            }
          }
        });
        return newItem;
      });
  }
  
  const doDelete = function(id) {
    return _metrc.delete(endpoint(id))
  }
  
  return {
    active: active,
    categories: categories,
    create: create,
    delete: doDelete
  }
}

module.exports = MetrcItems