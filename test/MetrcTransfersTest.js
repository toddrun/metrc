'use strict'

const MetrcTransfers = require('../lib/MetrcTransfers')
const Metrc = require('../lib/Metrc')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcTransfers', () => {
  const metrc = new Metrc()
  const metrcTransfers = new MetrcTransfers(metrc)
  let mockMetrc
    
  beforeEach(() => {
    mockMetrc = sinon.mock(metrc)
  })
  afterEach(() => { 
    mockMetrc.restore()
  })
  
  describe('incoming', () => {
    const incomingDeliveries = [{"Id": 2101, "ManifestNumber": "0000002101"}]
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/incoming').
        resolves( incomingDeliveries )
     
      metrcTransfers.incoming().then((results) => {
        assert.equal(results, incomingDeliveries)
        done();
      })
    })
  })
  
  describe('outgoing', () => {
    const outgoingDeliveries = [{"Id": 2101, "ManifestNumber": "0000002101"}]
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/outgoing').
        resolves( outgoingDeliveries )
     
      metrcTransfers.outgoing().then((results) => {
        assert.equal(results, outgoingDeliveries)
        done();
      })
    })
  })
  
  describe('rejected', () => {
    const rejectedDeliveries = [{"Id": 2101, "ManifestNumber": "0000002101"}]
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/rejected').
        resolves( rejectedDeliveries )
     
      metrcTransfers.rejected().then((results) => {
        assert.equal(results, rejectedDeliveries)
        done();
      })
    })
  })
  
  describe('fetchDelivery', () => {
    const delivery = {"Id": 2101, "RecipientFacilityLicenseNumber": "123-ABC"}
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/2101/deliveries').
        resolves( delivery )
     
      metrcTransfers.fetchDelivery(2101).then((results) => {
        assert.equal(results, delivery)
        done();
      })
    })
  })
  
  describe('fetchDeliveredPackages', () => {
    const deliveredPackages = [{"Id": 2101, "RecipientFacilityLicenseNumber": "123-ABC"}]
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/delivery/2101/packages').
        resolves( deliveredPackages )
     
      metrcTransfers.fetchDeliveredPackages(2101).then((results) => {
        assert.equal(results, deliveredPackages)
        done();
      })
    })
  })
  
  describe('states', () => {
    const states = ["Shipped", "Rejected", "Accepted", "Returned"]
    it('calls get with the id', (done) => {
      mockMetrc.expects('get').
        withArgs('/transfers/v1/delivery/packages/states').
        resolves( states )
     
      metrcTransfers.states().then((results) => {
        assert.equal(results, states)
        done();
      })
    })
  })
})