'use strict'

const MetrcPackages = require('../lib/MetrcPackages')
const Metrc = require('../lib/Metrc')
const attributeInspector = require('../lib/helpers/attributeInspector')
const bulkHandler = require('../lib/helpers/bulkHandler')

const sinon = require('sinon')
const assert = require('assert')

describe('Packages', () => {
  const metrc = new Metrc()
  const metrcPackages = new MetrcPackages(metrc)
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
  
  describe('bulkCreate', () => {
    const payload = [{'Tag': 'ABC'}, {'Tag': '123'}]
    const extractedTags = ['ABC', '123']
    const allActive = [
      {'Id': 3, 'Label': '000'}, {'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}
    ]
    const returnValue = [{'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}]
    
    it('extracts Tags and then matches Label', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Tag', payload)
        .returns(extractedTags)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Label', extractedTags, allActive)
        .returns(returnValue)
      mockMetrc.expects('post').withArgs('/packages/v1/create').resolves('Ok')
      mockMetrc.expects('get').resolves(allActive)
      
      metrcPackages.bulkCreate(payload).then((results) => {
        mockAttributeInspector.verify()
        mockMetrc.verify()
        assert.equal(results, returnValue)
        done()
      })
    })
  })
  
  describe('createTesting', () => {
    const tag = "ABCDEFG900009"
    const payload = { "Tag": tag }
    
    it('calls Metrc.post with packages create/testing endpoint', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/create/testing', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + tag).
        resolves([])
     
     metrcPackages.createTesting(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Package after creation using the Tag', (done) => {
      const createdPackage = { "Label": tag }
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(createdPackage)
     
     metrcPackages.createTesting(payload).then((newPackage) => {
       assert.equal(newPackage, createdPackage)
       done();
     })
    })
  })
  
  describe('bulkCreateTesting', () => {
    const payload = [{'Tag': 'ABC'}, {'Tag': '123'}]
    const extractedTags = ['ABC', '123']
    const allActive = [
      {'Id': 3, 'Label': '000'}, {'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}
    ]
    const returnValue = [{'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}]
    
    it('extracts Tags and then matches Label', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Tag', payload)
        .returns(extractedTags)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Label', extractedTags, allActive)
        .returns(returnValue)
      mockMetrc.expects('post').withArgs('/packages/v1/create/testing').resolves('Ok')
      mockMetrc.expects('get').withArgs('/packages/v1/active').resolves(allActive)
      
      metrcPackages.bulkCreateTesting(payload).then((results) => {
        mockAttributeInspector.verify()
        mockMetrc.verify()
        assert.equal(results, returnValue)
        done()
      })
    })
  })
  
  describe('createPlantings', () => {
    const tag = "ABCDEFG900001"
    const payload = { "PackageLabel": tag }
    
    it('calls Metrc.post with packages create endpoint', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/create/plantings', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + tag).
        resolves([])
     
     metrcPackages.createPlantings(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Package after creation using the Tag', (done) => {
      const createdPackage = { "Label": tag }
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(createdPackage)
     
     metrcPackages.createPlantings(payload).then((newPackage) => {
       assert.equal(newPackage, createdPackage)
       done();
     })
    })
  })
  
  describe('bulkCreatePlantings', () => {
    const payload = [{'PlantingLabel': 'ABC'}, {'PlantingLabel': '123'}]
    const extractedTags = ['ABC', '123']
    const allActive = [
      {'Id': 3, 'Label': '000'}, {'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}
    ]
    const returnValue = [{'Id': 6, 'Label': 'ABC'}, {'Id': 9, 'Label': '123'}]
    
    it('extracts Tags and then matches Label', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('PlantingLabel', payload)
        .returns(extractedTags)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Label', extractedTags, allActive)
        .returns(returnValue)
      mockMetrc.expects('post').withArgs('/packages/v1/create/plantings').resolves('Ok')
      mockMetrc.expects('get').withArgs('/packages/v1/active').resolves(allActive)
      
      metrcPackages.bulkCreatePlantings(payload).then((results) => {
        mockAttributeInspector.verify()
        mockMetrc.verify()
        assert.equal(results, returnValue)
        done()
      })
    })
  })
  
  describe('fetch', () => {
    const id = 17
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + id).
        resolves( {'Id': id, 'Label': 'ABCD1234'} )
     
      metrcPackages.fetch(id).then((results) => {
        mockMetrc.verify();
        assert.equal(results.Id, id)
        assert.equal(results.Label, 'ABCD1234')
        done();
      })
    })
  })
  
  describe('changeItem', () => {
    const label = "ABC123"
    const payload = { Label: label, Item: 'Different Stuff'}
    it('posts the payload then fetches the Package using the label', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/change/item').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + label).
        resolves(payload)
     
      metrcPackages.changeItem(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, payload)
        done();
      })
    })
  })
  
  describe('adjust', () => {
    const label = "ABC123"
    const payload = { Label: label, Item: 'Different Stuff'}
    it('posts the payload then fetches the Package using the label', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/adjust').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + label).
        resolves(payload)
     
      metrcPackages.adjust(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, payload)
        done();
      })
    })
  })
  
  describe('all', () => {
    context('without options', () => {
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
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      beforeEach(() => {
        mockMetrc.expects('get').withArgs('/packages/v1/active', options).resolves([{"active": 2}])
        mockMetrc.expects('get').withArgs('/packages/v1/inactive', options).resolves([{"inactive": 2}])
      })

      it('gets active, inactive and onhold', (done) => {
        metrcPackages.all(options).then((results) => {
          mockMetrc.verify();
          done();
        })
      })

      it('concatenates all the results', (done) => {
        metrcPackages.all(options).then((results) => {
          assert.deepEqual(results, [{"active": 2}, {"inactive": 2}])
          done();
        })
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
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options', (done) => {
        mockMetrc.expects('get').withArgs('/packages/v1/active', options).resolves([{"active": 2}])
        metrcPackages.active(options).then((results) => {
          mockMetrc.verify();
          done();
        })
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
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options', (done) => {
        mockMetrc.expects('get').withArgs('/packages/v1/inactive', options).resolves([{"active": 2}])
        metrcPackages.inactive(options).then((results) => {
          mockMetrc.verify();
          done();
        })
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
    
    context('with options', () => {
      let options = { lastModifiedStart: '2018-03-24T11:20:00Z' }
      
      it('passes options', (done) => {
        mockMetrc.expects('get').withArgs('/packages/v1/onhold', options).resolves([{"active": 2}])
        metrcPackages.onhold(options).then((results) => {
          mockMetrc.verify();
          done();
        })
      })
    })
  })
  
  describe('finish', () => {
    const label = "123456ABCDEF"
    const payload = { Label: label, ActualDate: '2018-01-01' }
    it('posts the payload then fetches the Package using the label', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/finish').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + label).
        resolves(payload)
     
      metrcPackages.finish(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, payload)
        done();
      })
    })
  })
  
  describe('unfinish', () => {
    const label = "123456ABCDEF"
    const payload = { Label: label }
    it('posts the payload then fetches the Package using the label', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/unfinish').
        resolves( payload )
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + label).
        resolves(payload)
     
      metrcPackages.unfinish(payload).then((results) => {
        mockMetrc.verify();
        assert.equal(results, payload)
        done();
      })
    })
  })
  
  describe('remediate', () => {
    const tag = "ABCDEFG900001"
    const payload = { "PackageLabel": tag }
    
    it('calls Metrc.post with packages remediate endpoint', (done) => {
      mockMetrc.expects('post').
        withArgs('/packages/v1/remediate', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/packages/v1/' + tag).
        resolves([])
     
     metrcPackages.remediate(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Package after creation using the Tag', (done) => {
      const remediatedPackage = { "Label": tag }
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(remediatedPackage)
     
     metrcPackages.remediate(payload).then((newPackage) => {
       assert.equal(newPackage, remediatedPackage)
       done();
     })
    })
  })
  
  describe('types', () => {
    it('gets and returns payload from package types endpoint', (done) => {
      const typeArray = ["Product", "ImmaturePlant", "VegetativePlant"]
      mockMetrc.expects('get')
        .withArgs('/packages/v1/types')
        .resolves(typeArray)
      
      metrcPackages.types().then((results) => {
        mockMetrc.verify()
        assert.deepEqual(typeArray, results)
        done()
      })
    })
  })
})