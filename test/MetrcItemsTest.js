'use strict'

const MetrcItems = require('../lib/MetrcItems')
const Metrc = require('../lib/Metrc')
const attributeInspector = require('../lib/helpers/attributeInspector')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcItems', () => {
  const metrc = new Metrc()
  const metrcItems = new MetrcItems(metrc)
  let mockMetrc;
  let mockAttributeInspector
    
  beforeEach(() => {
    mockMetrc = sinon.mock(metrc)
    mockAttributeInspector = sinon.mock(attributeInspector)
  })
  afterEach(() => { 
    mockMetrc.restore(); 
    mockAttributeInspector.restore();
  })
  
  describe('fetch', () => {
    const id = 212
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/items/v1/' + id).
        resolves( {'Id': id, 'Name': 'My Buds'} )
     
      metrcItems.fetch(id).then((results) => {
        assert.equal(results.Id, id)
        done();
      })
    })
  })
  
  describe('create', () => {
    const itemName = "Buds - Buddly"
    const payload = { "Name": itemName }
    
    it('posts items create endpoint then gets active items', (done) => {
      mockMetrc.expects('post').
        withArgs('/items/v1/create', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/items/v1/active').
        resolves([payload])
     
     metrcItems.create(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Item with the same name', (done) => {
      const activeItems = [ 
        { "Id": 4, "Name": 'Some Name' }, 
        { "Id": 7, "Name": itemName}, 
        { "Id": 12, "Name": "Something else"}
      ]
      
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(activeItems)
     
     metrcItems.create(payload).then((newItem) => {
       assert.equal(newItem.Id, 7)
       done();
     }).catch((err) => {console.log(err)})
    })
  })
  
  describe('bulkCreate', () => {
    const payload = [ {'Name': 'name1'}, {'name': 'name2'} ]
    const identifiers = ['name1', 'name2']
    const allItems = [ {'Id': 7}, {'Id': 9} ]
    const selectedItems = [ {'Id': 5, 'Name': 'name1'}, {'Id': 9, 'Name': 'name2'} ]
   
    
    it('extracts values', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Name', payload)
        .returns(identifiers)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Name', identifiers, allItems)
        .returns(selectedItems)
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(allItems)
      
      metrcItems.bulkCreate(payload).then((results) => {
        mockAttributeInspector.verify();
        assert.deepEqual(results, selectedItems)
        done();
      })
    })
  })
  
  describe('update', () => {
    const id = 420
    const payload = { 'Id': id, 'Name': 'Buddly Buds' }
    
    it('posts item to update endpoint then fetches the item', (done) => {
      mockMetrc.expects('post').
        withArgs('/items/v1/update', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/items/v1/' + id).
        resolves(payload)
     
     metrcItems.update(payload).then((newPackage) => {
       mockMetrc.verify();
       assert.equal(newPackage, payload)
       done();
     })
    })
  })
  
  describe('delete', () => {
    it('calls Metrc.delete and passed id to endpoint', (done) => {
      const id = 7;
      mockMetrc.expects('delete').
        withArgs('/items/v1/' + id).
        resolves({})
      
      metrcItems.delete(id).then(() => {
        mockMetrc.verify();
        done();
      })
    })
  })
  
  describe('active', () => {
    it('calls Metrc.get with active items endpoint', (done) => {
      mockMetrc.expects('get').
        withArgs('/items/v1/active').
        resolves([])
      
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
      const payload = [ {"Name": "Concentrate"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcItems.categories().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
})