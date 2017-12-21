'use strict'

const _ = require('lodash')

const convertToJson = function(results) {
  if(typeof results == 'object') {
    return results
  }
  if(typeof results == 'string') {
    return JSON.parse(results)
  }
}

exports.render = function(results) {
  let objects = convertToJson(results)
  let html = JSON.stringify(objects);
  if (_.isArray(objects)) {
    const sorted = _.sortBy(objects, ["Label"]);
    const dived = sorted.map((sortedPackage) => { 
      return '<div><b>*</b>&nbsp;' + JSON.stringify(sortedPackage) + '</div>'; 
    })  
    html = dived.join("")
  } 
  
  return '<html><body>' + html + '</body></html>'
}