'use strict'

const PathMaker = require('./helpers/PathMaker')

const MetrcTransfers = function(metrc) {
  const _metrc = metrc
  const pathMaker = new PathMaker('/transfers/v1/')
  
  const incoming = () => {
    return _metrc.get(pathMaker.endpoint('incoming'))
  }
  
  const outgoing = () => {
    return _metrc.get(pathMaker.endpoint('outgoing'))
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