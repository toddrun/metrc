'use strict'

const attributeInspector = require('./attributeInspector')
const util = require('util')

const validateInstructions = (instructions) => {
  if (instructions.post && instructions.get && instructions.attributeName) {
    return
  }
  throw new TypeError('Must include post, get and attributeName: ' + util.inspect(instructions))
}

exports.perform = (instructions, payload) => {
  validateInstructions(instructions)
  const attributeName = instructions.attributeName
  const postFunction = instructions.post
  const getFunction = instructions.get
  const identifiers = attributeInspector.extractValues(attributeName, payload)
  return postFunction(payload).then(() => {
    return getFunction()
  }).then((results) => {
    return attributeInspector.findMatches(attributeName, identifiers, results)
  })
}