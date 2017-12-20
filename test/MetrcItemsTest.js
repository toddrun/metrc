'use strict'

const MetrcItems = require('../lib/MetrcItems')
const Metrc = require('../lib/Metrc')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcItems', () => {
  const metrc = new Metrc()
  const metrcItems = new MetrcItems(metrc)
  let mockMetrc;

  beforeEach(() => { mockMetrc = sinon.mock(metrc); })
  afterEach(() => { mockMetrc.restore(); })
  
  describe('active', () => {
    it('calls Metrc.get with active items endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/items/v1/active')
        .resolves([])
      
      metrcItems.active().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Name": "Buds - My Buddy"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcItems.active().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
  
  describe('categories', () => {
    it('calls Metrc.get with categories endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/items/v1/categories')
        .resolves([])
      
      metrcItems.categories().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Name": "Buds - My Buddy"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcItems.categories().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
})