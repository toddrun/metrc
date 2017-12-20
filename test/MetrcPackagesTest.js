'use strict'

const MetrcPackages = require('../lib/MetrcPackages')
const Metrc = require('../lib/Metrc')

const sinon = require('sinon')
const assert = require('assert')

describe('Packages', () => {
  const metrc = new Metrc()
  const metrcPackages = new MetrcPackages(metrc)
  let mockMetrc;

  beforeEach(() => { mockMetrc = sinon.mock(metrc); })
  afterEach(() => { mockMetrc.restore(); })
  
  describe('create', () => {
    const tag = "ABCDEFG900001"
    const payload = { "Tag": tag }
    
    it('calls Metrc.post with packages create endpoint', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/create', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + tag).
        resolves([])
     
     metrcPackages.create(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Package after creation using the Tag', (done) => {
      const createdPackage = { "Label": tag }
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(createdPackage)
     
     metrcPackages.create(payload).then((newPackage) => {
       assert.equal(newPackage, createdPackage)
       done();
     })
    })
  })
  
  describe('all', () => {
    beforeEach(() => {
      mockMetrc.expects('get').withArgs('/packages/v1/active').resolves([{"active": 1}])
      mockMetrc.expects('get').withArgs('/packages/v1/inactive').resolves([{"inactive": 1}])
    })
    
    it('gets active, inactive and onhold', (done) => {
      metrcPackages.all().then((results) => {
        mockMetrc.verify();
        done();
      })
    })
    
    it('concatenates all the results', (done) => {
      metrcPackages.all().then((results) => {
        assert.deepEqual(results, [{"active": 1}, {"inactive": 1}])
        done();
      })
    })
  })
  
  describe('active', () => {
    it('calls Metrc.get with active packages endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/packages/v1/active')
        .resolves([])
      
      metrcPackages.active().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Label": "ABCDEFG10001"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcPackages.active().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
  
  describe('inactive', () => {
    it('calls Metrc.get with inactive packages endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/packages/v1/inactive')
        .resolves([])
      
      metrcPackages.inactive().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Label": "ABCDEFG10001"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcPackages.inactive().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
  
  describe('onhold', () => {
    it('calls Metrc.get with onhold packages endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/packages/v1/onhold')
        .resolves([])
      
      metrcPackages.onhold().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Label": "ABCDEFG10001"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcPackages.onhold().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
})