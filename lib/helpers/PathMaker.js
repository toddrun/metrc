'use strict'

function PathMaker(rootPath) {
  const _root = rootPath
  
  const endpoint = (remainingPath) => {
    return _root + remainingPath
  }
  
  return {
    endpoint: endpoint
  }
}

module.exports = PathMaker