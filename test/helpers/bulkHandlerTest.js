'use strict'

const bulkHandler = require('../../lib/helpers/bulkHandler')
const attributeInspector = require('../../lib/helpers/attributeInspector')

const sinon = require('sinon')
const assert = require('assert')

describe('bulkHandler', () => {
  let extractValuesMethod
  let findMatchesMethod
  const postFunction = sinon.stub()
  const getFunction = sinon.stub()
  const instructions = {
    post: postFunction,
    get: getFunction,
    attributeName: 'Id'
  }
  const payload = [ {'Id': 7, 'Some': 'Other Attribute'} ]
  const extractedValues = [7]
  const getUrlResponse = [{'All': 'Things'}]
  const foundMatches = [{'Id': 7, 'All': 'Things'}]
  
  beforeEach(() => {
    extractValuesMethod = sinon.stub(attributeInspector, 'extractValues').
      returns(extractedValues)
    findMatchesMethod = sinon.stub(attributeInspector, 'findMatches').
      returns(foundMatches)
    postFunction.resolves('OK')
    getFunction.resolves(getUrlResponse)
  })
  
  afterEach(() => {
    extractValuesMethod.restore()
    findMatchesMethod.restore()
  })
  
  describe('perform', () => {  
    it('validates instructions', () => {
      assert.throws(() => {
        bulkHandler.perform({post: postFunction}, payload)
      }, TypeError)
    })
    
    it('extracts values of attributeName from payload', () => {
      bulkHandler.perform(instructions, payload)
      assert.ok(
        extractValuesMethod.calledWith(instructions.attributeName, payload)
      )
    })
    
    it('finds matches of attributeName from payload', (done) => {
      bulkHandler.perform(instructions, payload).then(() => {
        assert.ok(
          findMatchesMethod.calledWith(
            instructions.attributeName, extractedValues, getUrlResponse
          )
        )
        done()
      })
    })
    
    it('calls post and get', (done) => {
      bulkHandler.perform(instructions, payload).then(() => {
        assert.ok(postFunction.calledWith(payload))
        assert.ok(getFunction.called)
        assert.ok(postFunction.calledBefore(getFunction))
        done()
      })
    })
    
    it('returns matched results', (done) => {
      bulkHandler.perform(instructions, payload).then((results) => {
        assert.deepEqual(results, foundMatches)
        done()
      })
    })
  })
})