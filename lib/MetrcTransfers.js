'use strict'

const PathMaker = require('./helpers/PathMaker')

const MetrcTransfers = function(metrc) {
  const _metrc = metrc
  const pathMaker = new PathMaker('/transfers/v1/')
  
  const incoming = (options) => {
    return _metrc.get(pathMaker.endpoint('incoming'), options)
  }
  
  const outgoing = (options) => {
    return _metrc.get(pathMaker.endpoint('outgoing'), options)
  }
  
  const rejected = () => {
    return _metrc.get(pathMaker.endpoint('rejected'))
  }
  
  const fetchDelivery = (id) => {
    return _metrc.get(pathMaker.endpoint(id + '/deliveries'))
  }
  
  const fetchDeliveredPackages = (id) => {
    return _metrc.get(pathMaker.endpoint('delivery/' + id + '/packages'))
  }
  
  const states = () => {
    return _metrc.get(pathMaker.endpoint('delivery/packages/states'))
  }
  
  return {
    incoming: incoming,
    outgoing: outgoing,
    rejected: rejected,
    fetchDelivery: fetchDelivery,
    fetchDeliveredPackages: fetchDeliveredPackages,
    states: states
  }
}

module.exports = MetrcTransfers