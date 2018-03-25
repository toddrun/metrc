'use strict'

const attributeInspector = require('./helpers/attributeInspector')
const PathMaker = require('./helpers/PathMaker')

const MetrcPackages = function(metrc) {
  const _metrc = metrc
  const pathMaker = new PathMaker('/packages/v1/')
  
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
  
  const onhold = (options) => {
    return _metrc.get(endpoint('onhold'), options)
  }
  
  const types = () => {
    return _metrc.get(endpoint('types'))
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
  
  const callCreateTesting = (payload) => {
    return _metrc.post(endpoint('create/testing'), payload)
  }
  
  const createTesting = (payload) => {
    var tag = payload.Tag;
    return callCreateTesting(payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const bulkCreateTesting = (payload) => {
    const extractedTags = attributeInspector.extractValues('Tag', payload)
    return callCreateTesting(payload).then(() => {
      return active()
    }).then((results) => {
      return attributeInspector.findMatches('Label', extractedTags, results)
    })
  }
  
  const callCreatePlantings = (payload) => {
    return _metrc.post(endpoint('create/plantings'), payload)
  }
  
  const createPlantings = (payload) => {
    var tag = payload.PackageLabel;
    return callCreatePlantings(payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  const bulkCreatePlantings = (payload) => {
    const extractedTags = attributeInspector.extractValues('PlantingLabel', payload)
    return callCreatePlantings(payload).then(() => {
      return active()
    }).then((results) => {
      return attributeInspector.findMatches('Label', extractedTags, results)
    })
  }
  
  const changeItem = (payload) => {
    var label = payload.Label;
    return _metrc.post(endpoint('change/item'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  const finish = (payload) => {
    var label = payload.Label;
    return _metrc.post(endpoint('finish'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  const unfinish = (payload) => {
    var label = payload.Label;
    return _metrc.post(endpoint('unfinish'), payload).
      then(() => {
        return _metrc.get(endpoint(label));
      });
  }
  
  const remediate = (payload) => {
    var tag = payload.PackageLabel;
    return _metrc.post(endpoint('remediate'), payload).
      then(() => {
        return _metrc.get(endpoint(tag));
      });
  }
  
  return {
    all: all,
    active: active,
    adjust: adjust,
    create: create,
    bulkCreate: bulkCreate,
    createTesting: createTesting,
    bulkCreateTesting: bulkCreateTesting,
    createPlantings: createPlantings,
    bulkCreatePlantings: bulkCreatePlantings,
    changeItem: changeItem,
    fetch: fetch,
    finish: finish,
    unfinish: unfinish,
    inactive: inactive,
    onhold: onhold,
    remediate: remediate,
    types: types
  }
}

module.exports = MetrcPackages