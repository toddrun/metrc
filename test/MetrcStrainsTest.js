'use strict'

const MetrcStrains = require('../lib/MetrcStrains')
const Metrc = require('../lib/Metrc')
const attributeInspector = require('../lib/helpers/attributeInspector')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcStrains', () => {
  const metrc = new Metrc()
  const metrcStrains = new MetrcStrains(metrc)
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
  
  describe('create', () => {
    const strainName = "Stinky Skunk"
    const payload = { "Name": strainName }
    
    it('posts items create endpoint then gets active strains', (done) => {
      mockMetrc.expects('post').
        withArgs('/strains/v1/create', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/strains/v1/active').
        resolves([payload])
     
     metrcStrains.create(payload).then(() => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Strain with the same name', (done) => {
      const activeStrains = [ 
        { "Id": 4, "Name": "Stinkaruny Skunk" }, 
        { "Id": 7, "Name": strainName}, 
        { "Id": 12, "Name": "OG Stink"}
      ]
      
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(activeStrains)
     
     metrcStrains.create(payload).then((newStrain) => {
       assert.equal(newStrain.Id, 7)
       done();
     })
    })
  })
  
  describe('bulkCreate', () => {
    const payload = [ {'Name': 'name1'}, {'name': 'name2'} ]
    const identifiers = ['name1', 'name2']
    const allStrains = [ {'Id': 7}, {'Id': 9} ]
    const selectedStrains = [ {'Id': 5, 'Name': 'name1'}, {'Id': 9, 'Name': 'name2'} ]
   
    it('extracts values', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Name', payload)
        .returns(identifiers)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Name', identifiers, allStrains)
        .returns(selectedStrains)
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(allStrains)
      
      metrcStrains.bulkCreate(payload).then((results) => {
        mockAttributeInspector.verify();
        assert.deepEqual(results, selectedStrains)
        done();
      })
    })
  })
  
  describe('fetch', () => {
    const id = 18
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/strains/v1/' + id).
        resolves( {'Id': id, 'Name': 'Stinky Skunk'} )
     
      metrcStrains.fetch(id).then((results) => {
        assert.equal(results.Id, id)
        done();
      })
    })
  })
  
  describe('active', () => {
    it('calls Metrc.get with active strains endpoint', (done) => {
      mockMetrc.expects('get').
        withArgs('/strains/v1/active').
        resolves([])
      
      metrcStrains.active().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Name": "Stinky Skunk"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcStrains.active().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
  
  describe('update', () => {
    const id = 18
    const payload = { 'Id': id, 'Name': 'Dank Diggity Dog' }
    
    it('posts strain to update endpoint then fetches the strain', (done) => {
      mockMetrc.expects('post').
        withArgs('/strains/v1/update', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/strains/v1/' + id).
        resolves(payload)
     
     metrcStrains.update(payload).then((updatedStrain) => {
       mockMetrc.verify();
       assert.equal(updatedStrain, payload)
       done();
     })
    })
  })
  
  describe('bulkUpdate', () => {
    const payload = [ 
      {'Id': 7, 'Name': 'name1'}, {'Id': 9, 'name': 'name2'} ]
    const ids = [7, 9]
    const allStrains = [ {'Id': 7}, {'Id': 9} ]
    const matchingStrains = [ {'Id': 7, 'Name': 'name1'}, {'Id': 9, 'Name': 'name2'} ]
   
    it('extracts values', (done) => {
      mockAttributeInspector
        .expects('extractValues')
        .withArgs('Id', payload)
        .returns(ids)
      mockAttributeInspector
        .expects('findMatches')
        .withArgs('Id', ids, allStrains)
        .returns(matchingStrains)
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(allStrains)
      
      metrcStrains.bulkUpdate(payload).then((results) => {
        mockAttributeInspector.verify();
        assert.deepEqual(results, matchingStrains)
        done();
      })
    })
  })
  
  describe('delete', () => {
    it('calls Metrc.delete with id and proper endpoint', (done) => {
      const id = 7;
      mockMetrc.expects('delete').
        withArgs('/strains/v1/' + id).
        resolves('OK')
      
      metrcStrains.delete(id).then(() => {
        mockMetrc.verify();
        done();
      })
    })
  })
})