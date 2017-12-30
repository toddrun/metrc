'use strict'

const MetrcStrains = require('../lib/MetrcStrains')
const Metrc = require('../lib/Metrc')
const bulkHandler = require('../lib/helpers/bulkHandler')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcStrains', () => {
  const metrc = new Metrc()
  const metrcStrains = new MetrcStrains(metrc)
  let mockMetrc
  let mockBulkHandler

  beforeEach(() => {
    mockMetrc = sinon.mock(metrc)
    mockBulkHandler = sinon.stub(bulkHandler, 'perform')  
  })
  afterEach(() => { 
    mockMetrc.restore()
    mockBulkHandler.restore()
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
    it('leverages bulkHandler', (done) => {
      const payload = [{'Name': 'Some Strain'}, {'Name': 'Another Strain'}]
      const returnValue = [
        {'Id': 17, 'Name': 'Some Strain'}, {'Id': 19, 'Name': 'Another Strain'}
      ]
      mockBulkHandler.resolves(returnValue)
      
      metrcStrains.bulkCreate(payload).then((results) => {
        const args = mockBulkHandler.getCall(0).args
        const instructions = args[0]
        
        assert.equal('Name', instructions.attributeName)
        assert.ok(instructions.post.toString().indexOf('post'))
        assert.ok(instructions.post.toString().indexOf('create'))
        assert.ok(instructions.post.toString().indexOf('get'))
        assert.ok(instructions.post.toString().indexOf('active'))
        assert.equal(args[1], payload)
        assert.deepEqual(results, returnValue)
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
    it('leverages bulkHandler', (done) => {
      const payload = [ 
        {'Id': 7, 'Name': 'name1'}, {'Id': 9, 'name': 'name2'} 
      ]
      const returnValue = [ {'Id': 7, 'Name': 'name1'}, {'Id': 9, 'Name': 'name2'} ]
      mockBulkHandler.resolves(returnValue)
      
      metrcStrains.bulkUpdate(payload).then((results) => {
        const args = mockBulkHandler.getCall(0).args
        const instructions = args[0]
        
        assert.equal('Id', instructions.attributeName)
        assert.ok(instructions.post.toString().indexOf('post'))
        assert.ok(instructions.post.toString().indexOf('update'))
        assert.ok(instructions.post.toString().indexOf('get'))
        assert.ok(instructions.post.toString().indexOf('active'))
        assert.equal(args[1], payload)
        assert.deepEqual(results, returnValue)
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