'use strict'

const Metrc = require('../lib/Metrc')

const nock = require('nock')
const assert = require('assert')
const moment = require('moment')
const _ = require('lodash')

describe('Metrc', () => {
  const domain = 'https://api-xx.metrc.com'
  const licenseNumber = 'ABC-X000X'
  const apiKey = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const userKey = '1234567890abcdefghijklmnopqrstuvwxyz'
  
  const path = '/any/v1/endpoint';
  
  describe('get', () => {
    beforeEach(() => {
      nock.cleanAll()
    })
    
    it('hits the endpoint as expected', (done) => {
      const metrcCall = nock(domain)
        .get(path)
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .reply(200, [])
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
       })
    })
    
    it('returns the payload from metrc', (done) => {
      const metrcCall = nock(domain).get(path).query(true).reply(200, [{foo: 'bar'}])
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path)
        .then((results) => {
          assert.deepEqual([{foo: 'bar'}], results)
          done();
       })
    })
    
    it('includes multiple payloads if more than one call is needed', (done) => {
      const startDate = moment().subtract(4, 'day').subtract(10, 'hours').toJSON()
      const endDate = moment().subtract(1, 'day').toJSON()
      const dates = []
      const includesFoo = (results, value) => {
        return results.find((object) => {
          return object.foo == value
        })
      }

      const metrcCall = nock(domain)
        .get(path).query(true).reply(200, [{foo: "one"}])
        .get(path).query(true).reply(200, [{foo: "two"}])
        .get(path).query(true).reply(200, [])
        .get(path).query(true).reply(200, [{foo: "three"}, {foo: "four"}])

      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path, {lastModifiedStart: startDate, lastModifiedEnd: endDate})
        .then((results) => {
          assert.equal(4, results.length)
          assert.ok(includesFoo(results, "one"))
          assert.ok(includesFoo(results, "two"))
          assert.ok(includesFoo(results, "three"))
          assert.ok(includesFoo(results, "four"))
          done();
       }).catch((e) => {console.log("ERR", e)})
    })
    
    it('errors if any call fails', (done) => {
      const startDate = moment().subtract(4, 'day').subtract(10, 'hours').toJSON()
      const endDate = moment().subtract(1, 'day').toJSON()
      const dates = []
      const includesFoo = (results, value) => {
        return results.find((object) => {
          return object.foo == value
        })
      }

      const metrcCall = nock(domain)
        .get(path).query(true).reply(200, [{foo: "one"}])
        .get(path).query(true).reply(200, [{foo: "two"}])
        .get(path).query(true).reply(504, "barf")

      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path, {lastModifiedStart: startDate, lastModifiedEnd: endDate})
        .then(() => {
          assert.fail("Should not have completed")
        }).catch((expected) => {
          assert.ok("You should put something here in case the calls fail!")
          done()
        })
    })
    
    context('with lastModifiedStart', () => {
      it('gets every 24 hour period from the start until the current time', (done) => {
        const startDate = moment().subtract(47, 'hours').toJSON()
        const assertCalls = (queryArguments) => {
          if (queryArguments.lastModifiedStart == startDate) {
            assert.equal(
             moment(startDate).toJSON(),
             moment(queryArguments.lastModifiedStart).toJSON()
            )
          } else {
            assert.equal(
              moment(queryArguments.lastModifiedStart).toJSON(), 
              moment(queryArguments.lastModifiedEnd).subtract(24, 'hours').toJSON()
            )
          }
          return true
        }
        
        const metrcCall = nock(domain)
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
        
        new Metrc(domain, licenseNumber, apiKey, userKey)
          .get(path, {lastModifiedStart: startDate})
          .then(() => {
            assert.ok(metrcCall.isDone());
            done();
         }).catch((e) => {console.log("ERR", e)})
      })
    })
    
    context('with lastModifiedEnd', () => {
      it('gets 24 hour period prior to lastModifiedEnd', (done) => {
        const endDate = moment('2018-03-17T10:19:00Z').toJSON()
        const expectedStartDate = moment(endDate).subtract(24, 'hours').toJSON()
        const metrcCall = nock(domain)
          .get(path)
          .query({
            licenseNumber: licenseNumber, 
            lastModifiedStart: expectedStartDate, 
            lastModifiedEnd: endDate
          })
          .basicAuth({user: apiKey, pass: userKey})
          .reply(200, []);
        
        new Metrc(domain, licenseNumber, apiKey, userKey)
          .get(path, {lastModifiedEnd: endDate})
          .then(() => {
            assert.ok(metrcCall.isDone());
            done();
         }).catch((e) => {console.log("ERR", e)})
      })
    })
    
    context('with lastModifiedStart and lastModifiedEnd', () => {
      it('calls each period between the start and end without gaps', (done) => {
        const startDate = moment().subtract(7, 'day').subtract(14, 'hours').toJSON()
        const endDate = moment().subtract(2, 'day').subtract(2, 'hours').toJSON()
        const dates = []
        const assertCalls = (queryArguments) => {
          dates.push({
            startDate: queryArguments.lastModifiedStart,
            endDate: queryArguments.lastModifiedEnd
          })
          return true
        }
        
        const metrcCall = nock(domain)
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
          .get(path).query(assertCalls).reply(200, [])
        
        new Metrc(domain, licenseNumber, apiKey, userKey)
          .get(path, {lastModifiedStart: startDate, lastModifiedEnd: endDate})
          .then(() => {
            const sortedDates = _.sortBy(dates, 'startDate')
            assert.equal(sortedDates[0].startDate, startDate)
            assert.equal(sortedDates[sortedDates.length - 1].endDate, endDate)
            for (let i = 0 ; i < sortedDates.length - 1; i++) {
              assert.equal(sortedDates[i].endDate, sortedDates[i + 1].startDate)
            }
            assert.ok(metrcCall.isDone());
            done();
         }).catch((e) => {console.log("ERR", e)})
      })
    })
  })
  
  describe('post', () => {
    it('hits the endpoint with the expected values', (done) => {
      const payload = [{some: "args"}]
      const metrcCall = nock(domain)
        .post(path, payload)
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .matchHeader('Content-Type', 'application/json')
        .reply(200, "OK");
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .post(path, payload)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
       })
    })
    
    it('wraps payload objects as arrays', (done) => {
      const payload = {some: "args"}
      const metrcCall = nock(domain)
        .post(path, [payload])
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .matchHeader('Content-Type', 'application/json')
        .reply(200, "OK");
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .post(path, payload)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
       })
    })
  })
  
  describe('delete', () => {
    it('makes the call using all the right arguments', (done) => {
      const payload = [{some: "args"}]
      const metrcCall = nock(domain)
        .delete(path, payload)
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .matchHeader('Content-Type', 'application/json')
        .reply(200, "OK");

      new Metrc(domain, licenseNumber, apiKey, userKey)
        .delete(path, payload)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
       })
    })
    
    it('wraps single object payloads into an array', (done) => {
      const payload = {some: "args"}
      const metrcCall = nock(domain)
        .delete(path, [payload])
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .matchHeader('Content-Type', 'application/json')
        .reply(200, "OK");

      new Metrc(domain, licenseNumber, apiKey, userKey)
        .delete(path, payload)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
       })
    })
  })
  
  describe('error handling', () => {
    it('deals with errors', (done) => {
       const metrcCall = nock(domain)
        .get(/.*/)
        .replyWithError("Something went wrong");
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path)
        .catch(() => {
          assert.ok(metrcCall.isDone());
          done();
      })
    })
  })
})