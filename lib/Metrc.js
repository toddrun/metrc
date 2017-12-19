'use strict'

const request = require('request');
const util = require('util');

function Metrc(domain, licenseNumber, apiKey, userKey) {
  const _domain = domain;
  const _licenseNumber = licenseNumber;
  const _apiKey = apiKey;
  const _userKey = userKey;
  
  const authHeader = function() {
    return {
        "Authorization" : "Basic " + new Buffer(_apiKey + ":" + _userKey).toString("base64")
    };
  }
  
  const baseUrl = function(path) {
    return _domain + path + "?licenseNumber=" + _licenseNumber
  }
  
  const buildErr = function(res, body) {
    console.log("BAD STATUS", res.statusCode, res.statusMessage, body)
    return {
              "requestHref": res.request.href, 
              "statusCode": res.statusCode,
              "statusMessage": res.statusMessage,
              "responseBody": body
            }
  }
  
  const get = function(path) {
    var url = baseUrl(path);
    var headers = authHeader();
    return new Promise(function(resolve, reject) {
      request.get(
        {
          url: url, headers: headers
        }, function(err, res, body) {
          if (err) {
            console.log("ERR", err);
            reject("Failed to complete call: " + util.inspect(err));
          } else if (res.statusCode >= 400) {
            reject(buildErr(res, body));
          } else {
            if (process.env.DO_VERBOSE) {
              console.log("Received:", body);
            }
            resolve(body);
          }
        })
    })
  }
  
  const post = function(path, body) {
    var url = baseUrl(path);
    var headers = authHeader();
    headers["Content-Type"] = "application/json"
    var argument = Array.isArray(body) ? body : [body]
    
    return new Promise(function(resolve, reject) {
      request.post(
        {
          url: url, 
          headers: headers, 
          json: argument
        }, function(err, res, body) {
          if (err) {
            console.log("ERR", err)
            reject("Failed to complete call: " + util.inspect(err));
          } else if (res.statusCode >= 400) {
            reject(buildErr(res, body));
          } else {
            if (process.env.DO_VERBOSE) {
              console.log("Received:", body);
            }
            resolve(body);
          }
        })
    })
  }
  
  const doDelete = function(path, body) {
    var url = baseUrl(path);
    var headers = authHeader();
    var json = JSON.stringify(body);
    var argument = Array.isArray(body) ? body : [body]
    return new Promise(function(resolve, reject) {
      request.delete(
        {
          url: url, headers: headers, json: argument
        }, function(err, res, body) {
          if (err) {
            console.log("ERR", err)
            reject("Failed to complete call: " + util.inspect(err));
          } else if (res.statusCode >= 400) {
            reject(buildErr(res, body));
          } else {
            resolve(body);
          }
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