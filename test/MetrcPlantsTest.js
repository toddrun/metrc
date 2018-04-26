'use strict'

const MetrcPlants = require('../lib/MetrcPlants')
const Metrc = require('../lib/Metrc')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcPlants', () => {
  const metrc = new Metrc()
  const metrcPackages = new MetrcPlants(metrc)
  let mockMetrc

  beforeEach(() => { 
    mockMetrc = sinon.mock(metrc)
  })
  afterEach(() => { 
    mockMetrc.restore()
  })
  
  describe('fetch', () => {
    const id = 'ATAG2FIND'
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/plants/v1/' + id).
        resolves( {'Id': id, 'Label': 'ABCD1234'} )
     
      metrcPackages.fetch(id).then((results) => {
        mockMetrc.verify();
        assert.equal(results.Id, id)
        assert.equal(results.Label, 'ABCD1234')
        done();
      })
    })
  })
})