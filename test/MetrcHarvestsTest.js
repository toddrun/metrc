'use strict'

const MetrcHarvests = require('../lib/MetrcHarvests')
const Metrc = require('../lib/Metrc')
const attributeInspector = require('../lib/helpers/attributeInspector')
const bulkHandler = require('../lib/helpers/bulkHandler')

const sinon = require('sinon')
const assert = require('assert')

const harvestId = 14
const harvest = { 'Id': harvestId, 'Name': 'My Harvest' }

describe('Harvests', () => {
  const metrc = new Metrc()
  const metrcHarvests = new MetrcHarvests(metrc)
  let mockMetrc
  let mockAttributeInspector
  let mockBulkHandler

  beforeEach(() => { 
    mockMetrc = sinon.mock(metrc)
    mockAttributeInspector = sinon.mock(attributeInspector)
    mockBulkHandler = sinon.stub(bulkHandler, 'perform')
  })
  afterEach(() => { 
    mockMetrc.restore()
    mockAttributeInspector.restore()
    mockBulkHandler.restore()
  })
  
  describe('fetch', () => {
    const id = 17
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/harvests/v1/' + id).
        resolves( {'Id': id, 'Name': 'Windfall'} )
     
      metrcHarvests.fetch(id).then((results) => {
        mockMetrc.verify();
        assert.equal(results.Id, id)
        assert.equal(results.Name, 'Windfall')
        done();
      })
    })
  })
  
  describe('all', () => {
    context('without options', () => {
      beforeEach(() => {
        mockMetrc.expects('get').withArgs('/harvests/v1/active').resolves([{"active": 1}])
        mockMetrc.expects('get').withArgs('/harvests/v1/inactive').resolves([{"inactive": 1}])
      })

      it('gets active and inactive harvests', (done) => {
        metrcHarvests.all().then(() => {
          mockMetrc.verify();
          done();
        })
      })

      it('concatenates all the results', (done) => {
        metrcHarvests.all().then((results) => {
          assert.deepEqual(results, [{"active": 1}, {"inactive": 1}])
          done();
        })
      })
    })
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      beforeEach(() => {
        mockMetrc.expects('get').withArgs('/harvests/v1/active', options).resolves([{"active": 2}])
        mockMetrc.expects('get').withArgs('/harvests/v1/inactive', options).resolves([{"inactive": 12}])
      })

      it('gets active and inactive harvests', (done) => {
        metrcHarvests.all(options).then((results) => {
          mockMetrc.verify();
          done();
        })
      })

      it('concatenates all the results', (done) => {
        metrcHarvests.all(options).then((results) => {
          assert.deepEqual(results, [{"active": 2}, {"inactive": 12}])
          done();
        })
      })
    })
  })
  
  describe('active', () => {
    it('calls Metrc.get with active harvests endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/harvests/v1/active')
        .resolves([])
      
      metrcHarvests.active().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ harvest ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcHarvests.active().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options to get endpoint', (done) => {
        mockMetrc.expects('get').withArgs('/harvests/v1/active', options)
          .resolves( [ harvest ] )
        
        metrcHarvests.active(options).then((results) => {
          mockMetrc.verify();
          done();
        })
      })
    })
  })
  
  describe('inactive', () => {
    it('calls Metrc.get with inactive harvests endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/harvests/v1/inactive')
        .resolves([])
      
      metrcHarvests.inactive().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {'Name': 'Paused Harvest'} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcHarvests.inactive().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options', (done) => {
        mockMetrc.expects('get')
          .withArgs('/harvests/v1/inactive', options)
          .resolves([])
        metrcHarvests.inactive(options).then((results) => {
          mockMetrc.verify();
          done();
        })
      })
    })
  })
  
  describe('onhold', () => {
    it('calls Metrc.get with onhold harvests endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/harvests/v1/onhold')
        .resolves([])
      
      metrcHarvests.onhold().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {'Name': 'Slightly Delayed'} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcHarvests.onhold().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options', (done) => {
        mockMetrc.expects('get')
          .withArgs('/harvests/v1/onhold', options)
          .resolves([])
        
        metrcHarvests.onhold(options).then(() => {
          mockMetrc.verify();
          done();
        })
      })
    })
  })
  
  describe('createPackages', () => {
    const payload = [{'Harvest': 2, 'Tag': 'ABC'}, {'Harvest': 2, 'Tag': '123'}]
    const extractedTags = ['ABC', '123']
    const allActive = [
      {'Id': 3, 'Label': '000'}, {'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}
    ]
    const returnValue = [{'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}]
    
    it('extracts harvest Tags to later match packages Label', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Tag', payload)
        .returns(extractedTags)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Label', extractedTags, allActive)
        .returns(returnValue)
      mockMetrc.expects('post')
        .withArgs('/harvests/v1/createpackages', payload)
        .resolves('Ok')
      mockMetrc.expects('get').resolves(allActive)
      
      metrcHarvests.createPackages(payload).then((results) => {
        mockAttributeInspector.verify()
        mockMetrc.verify()
        assert.equal(results, returnValue)
        done()
      })
    })
    
    it('posts to harvests createPackages endpoint and gets all active packages', (done) => {
      mockMetrc.expects('post').
        withArgs('/harvests/v1/createpackages', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/packages/v1/active').
        resolves([])
     
      metrcHarvests.createPackages(payload).then((newPackage) => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('wraps single package payload into an array', (done) => {
      const singlePayload = { 'Harvest': harvestId, 'Tag': 'ABCDEFG900001' }
      const expectedPayload = [ singlePayload ]
      
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Tag', expectedPayload)
        .returns([])
      mockMetrc.expects('post').
        withArgs('/harvests/v1/createpackages', expectedPayload).
        resolves('OK')
      mockMetrc.expects('get').resolves([])
      
      metrcHarvests.createPackages(singlePayload).then((newPackage) => {
        mockAttributeInspector.verify()
        mockMetrc.verify()
        done()
      })
    })
  })
  
  describe('removeWaste', () => {
    const payload = { 'Id': harvestId, 'WasteWeight': 10.05 }
    
    it('posts to removewaste and gets by harvest id', (done) => {
      mockMetrc.expects('post').
        withArgs('/harvests/v1/removewaste', payload).
        resolves('OK')
      mockMetrc.expects('get').
        withArgs('/harvests/v1/' + harvestId).
        resolves(harvest)
       
      metrcHarvests.removeWaste(payload).then(() => {
        mockMetrc.verify();
        done();
      })
    })
    
    it('returns harvest with matching id', (done) => {
      mockMetrc.expects('post').resolves('OK')
      mockMetrc.expects('get').resolves(harvest)
     
      metrcHarvests.removeWaste(payload).then((returned) => {
        assert.equal(returned, harvest)
        done();
      })  
    })
  })
  
  describe('bulkRemoveWaste', () => {
    it('leverages bulkHandler', (done) => {
      const payload = [ { 'Id': 4, 'WasteWeight': 10.05 }, { 'Id': 7, 'WasteWeight': 10.05 } ]
      const returnValue = [
        {'Id': 4, 'Name': 'Big Harvest'}, {'Id': 7, 'Name': 'Bumper Crop'}
      ]
      mockBulkHandler.resolves(returnValue)
      
      metrcHarvests.bulkRemoveWaste(payload).then((results) => {
        const args = mockBulkHandler.getCall(0).args
        const instructions = args[0]
        const submittedPayload = args[1]
        
        assert.equal('Id', instructions.attributeName)
        assert.ok(instructions.post.toString().indexOf('post'))
        assert.ok(instructions.post.toString().indexOf('removeWaste'))
        assert.ok(instructions.post.toString().indexOf('get'))
        assert.ok(instructions.post.toString().indexOf('active'))
        assert.equal(submittedPayload, payload)
        assert.deepEqual(results, returnValue)
        done();
      })
    })
  })
  
  describe('finish', () => {
    const payload = { Id: harvestId, Name: 'Harvested', ActualDate: '2018-01-01' }
    it('posts the payload then fetches the Harvest using the Id', (done) => {
      mockMetrc.expects('post').
        withArgs('/harvests/v1/finish').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/harvests/v1/' + harvestId).
        resolves(harvest)
     
      metrcHarvests.finish(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, harvest)
        done();
      })
    })
  })
  
  describe('unfinish', () => {
    const payload = { Id: harvestId }
    it('posts the payload then fetches the Harves using the Id', (done) => {
      mockMetrc.expects('post').
        withArgs('/harvests/v1/unfinish').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/harvests/v1/' + harvestId).
        resolves(harvest)
     
      metrcHarvests.unfinish(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, harvest)
        done();
      })
    })
  })
})