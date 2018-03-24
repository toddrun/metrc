'use strict'

const request = require('request');
const util = require('util');
const moment = require('moment');

function Metrc(domain, licenseNumber, apiKey, userKey) {
  const _domain = domain;
  const _licenseNumber = licenseNumber;
  const _apiKey = apiKey;
  const _userKey = userKey;
  
  const headers = function() {
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + new Buffer(_apiKey + ":" + _userKey).toString("base64")
    };
  }
  
  const dayBefore = (endDate) => {
    return moment(endDate).subtract(24, 'hours')
  }
  
  const parseDate = (date) => {
    if (!date) {
      return undefined
    }
    return moment(date)
  }
  
  const buildDateArg = (startDate, endDate) => {
    return { 
      lastModifiedStart: startDate.toJSON(), 
      lastModifiedEnd: endDate.toJSON() 
    }
  }
  
  const buildModifiedDateArgs = (startDate, endDate) => {
    const dates = []
    let lastEnd = moment(endDate)
    let lastStart, effectiveStartDate
    while(lastEnd.isAfter(startDate)) {
      lastStart = dayBefore(lastEnd)
      effectiveStartDate = moment.max(lastStart, startDate)
      dates.push(buildDateArg(effectiveStartDate, lastEnd))
      lastEnd = lastStart
    }
    return dates
  }
  
  const parseLastModifiedOptions = (options = {}) => {
    const startDate = parseDate(options.lastModifiedStart)
    const endDate = parseDate(options.lastModifiedEnd)
    
    if (!startDate && !endDate) {
      return []
    }
    if (startDate && endDate) {
      return buildModifiedDateArgs(startDate, endDate)
    }
    if (startDate) {
      return buildModifiedDateArgs(startDate, moment())
    }
    if (endDate) {
      return [ buildDateArg(dayBefore(endDate), endDate) ]
    }
  }
  
  const baseUrl = function(path, options) {
    let basePath = _domain + path + "?licenseNumber=" + _licenseNumber
    const separator = '&'
    if (options) {
      Object.keys(options).forEach((key) => {
        basePath += separator + key + "=" + options[key]
      })
    }
    return basePath
  }
  
  const buildErr = function(res, body) {
    const err = {}
    if (res) {
      err.requestHref = res.request.href
      err.statusCode = res.statusCode
      err.statusMessage = res.statusMessage
      err.responseBody = body
    } else {
      err.statusCode = 500
      err.responseBody = util.inspect(body)
    }
    return err
  }
  
  const tryToConvertToObject = function(results) {
    if(typeof results == 'object') {
      return results
    }
    if(typeof results == 'string') {
      try {
        return JSON.parse(results)  
      } catch (e) {
        return results
      }
    }
  }
  
  const handleResponse = function(err, res, body, resolve, reject) {
    if (err) {
      reject(buildErr(res, err));
    } else if (res.statusCode >= 400) {
      reject(buildErr(res, body));
    } else {
      resolve(tryToConvertToObject(body));
    }
  }
  
  const getSingleBatch = function(url) {
    return new Promise(function(resolve, reject) {
      request.get(
        {
          url: url, headers: headers()
        }, function(err, res, body) {
          handleResponse(err, res, body, resolve, reject)
        })
    })
  }
  
  const getMultipleBatches = ((path, dateArgs) => {
    const batches = []
    dateArgs.map((args) => {
      batches.push(new Promise((resolve, reject) => {
        const argOptions = args
        const url = baseUrl(path, argOptions)
        getSingleBatch(url).
          then((batch) => { resolve(batch) } ).
          catch((err) => { reject(err) })
        })
      )
    })
    
    return Promise.all(batches).then((values) => {
      return [].concat.apply([], values)
    })
  })
  
  const get = function(path, options) {
    const dateArgs = parseLastModifiedOptions(options)
    if (dateArgs && dateArgs.length > 0) {
      return getMultipleBatches(path, dateArgs)
    }
    
    var url = baseUrl(path);
    return getSingleBatch(url)
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