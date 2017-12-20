'use strict'

const _ = require('lodash')

exports.render = function(results) {
  const packages = JSON.parse(results);
  let html = results;
  if (_.isArray(packages)) {
    const sorted = _.sortBy(packages, ["Label"]);
    const dived = sorted.map((sortedPackage) => { 
      return '<div><b>*</b>&nbsp;' + JSON.stringify(sortedPackage) + '</div>'; 
    })  
    html = dived.join("")
  } 
  
  return '<html><body>' + html + '</body></html>'
}