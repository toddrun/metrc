'use strict'

exports.extractValues = function(attributeName, payload) {
  const identifiers = []
  payload.forEach((entry) => {
    identifiers.push(entry[attributeName])
  }) 
  return identifiers
}

exports.findMatches = function(attributeName, values, payload) {
  const matches = []
  payload.forEach((entry) => {
    if (values.indexOf(entry[attributeName]) >= 0) {
      matches.push(entry)
    }
  })
  return matches
}
