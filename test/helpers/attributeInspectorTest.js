'use strict'

const attributeInspector = require('../../lib/helpers/attributeInspector')

const assert = require('assert')

describe('BulkHandler', () => {
  const payload = [
    { "Id": 11, "Name": "Name 1", "Label": "Label 1"},
    { "Id": 22, "Name": "Name 2", "Label": "Label 2"},
    { "Id": 33, "Name": "Name 3", "Label": "Label 3"},
  ]
  
  describe('extractIdentifiers', () => {  
    it('gets each value of named attribute', () => {
      assert.deepEqual(
        attributeInspector.extractValues('Id', payload),
        [11, 22, 33]
      )
      assert.deepEqual(
        attributeInspector.extractValues('Name', payload),
        ["Name 1", "Name 2", "Name 3"]
      )
      assert.deepEqual(
        attributeInspector.extractValues('Label', payload),
        ["Label 1", "Label 2", "Label 3"]
      )
    })
  })
  
  describe('findMatches', () => {
    it('finds each record where value exists for named attribute', ()=> {
      assert.deepEqual(
        attributeInspector.findMatches('Id', [11, 33], payload),
        [
          { "Id": 11, "Name": "Name 1", "Label": "Label 1"},
          { "Id": 33, "Name": "Name 3", "Label": "Label 3"},
        ]
      )
      assert.deepEqual(
        attributeInspector.findMatches('Name', ["Name 2", "Name 3"], payload),
        [
          { "Id": 22, "Name": "Name 2", "Label": "Label 2"},
          { "Id": 33, "Name": "Name 3", "Label": "Label 3"},
        ]
      )
    })
  })
})