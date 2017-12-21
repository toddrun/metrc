'use strict'

const request = require('request');
const util = require('util');

function Metrc(domain, licenseNumber, apiKey, userKey) {
  const _domain = domain;
  const _licenseNumber = licenseNumber;
  const _apiKey = apiKey;
  const _userKey = userKey;
  
  const headers = function() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Basic " + new Buffer(_apiKey + ":" + _userKey).toString("base64")
    };
  }
  
  const baseUrl = function(path) {
    return _domain + path + "?licenseNumber=" + _licenseNumber
  }
  
  const buildErr = function(res, body) {
    const err = {
      "requestHref": res.request.href, 
      "statusCode": res.statusCode,
      "statusMessage": res.statusMessage,
      "responseBody": body
    }
    console.log("Call failed:", err)
    return err
  }
  
  const handleResponse = function(err, res, body, resolve, reject) {
    if (err) {
      reject(buildErr(res, err));
    } else if (res.statusCode >= 400) {
      reject(buildErr(res, body));
    } else {
      resolve(body);
    }
  }
  
  const get = function(path) {
    var url = baseUrl(path);
    return new Promise(function(resolve, reject) {
      request.get(
        {
          url: url, headers: headers()
        }, function(err, res, body) {
          handleResponse(err, res, body, resolve, reject)
        })
    })
  }
  
  const post = function(path, body) {
    var url = baseUrl(path);
    var argument = Array.isArray(body) ? body : [body]
    
    return new Promise(function(resolve, reject) {
      request.post(
        {
          url: url, 
          headers: headers(), 
          json: argument
        }, function(err, res, body) {
          handleResponse(err, res, body, resolve, reject)
        })
    })
  }
  
  const doDelete = function(path, body) {
    var url = baseUrl(path);
    var json = JSON.stringify(body);
    var argument = Array.isArray(body) ? body : [body]
    return new Promise(function(resolve, reject) {
      request.delete(
        {
          url: url, headers: headers(), json: argument
        }, function(err, res, body) {
          handleResponse(err, res, body, resolve, reject)
        }
       );
    })
  }
  
  return {
    get: get,
    post: post,
    delete: doDelete
  }
}

module.exports = Metrc;