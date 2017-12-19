'use strict'

const Metrc = require('../lib/Metrc');

const nock = require('nock');
const assert = require('assert');

describe('Metrc', () => {
  const domain = 'https://api-xx.metrc.com';
  const licenseNumber = 'ABC-X000X';
  const apiKey = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const userKey = '1234567890abcdefghijklmnopqrstuvwxyz';
  
  const path = '/any/v1/endpoint';
  
  describe('get', () => {
    it('hits the endpoint as expected', (done) => {
      const metrcCall = nock(domain)
        .get(path)
        .query({licenseNumber: licenseNumber})
        .basicAuth({user: apiKey, pass: userKey})
        .reply(200, "OK");
      
      new Metrc(domain, licenseNumber, apiKey, userKey)
        .get(path)
        .then(() => {
          assert.ok(metrcCall.isDone());
          done();
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
})