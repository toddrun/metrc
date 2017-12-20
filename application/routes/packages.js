'use strict'

var express = require('express');
var router = express.Router();

const MetrcPackages = require('../../lib/MetrcPackages')
const metrc = require('./helpers/MetrcFactory').getNew()
const metrcPackages = new MetrcPackages(metrc)

const _ = require('lodash')

const render = function(results) {
  const packages = JSON.parse(results);
  let html = results;
  if (_.isArray(packages)) {
    const sorted = _.sortBy(packages, ["Label"]);
    const dived = sorted.map((sortedPackage) => { 
      return '<div><b>*</b>&nbsp;' + JSON.stringify(sortedPackage) + '</div>'; 
    })  
    html = dived.join("")
  } 
  
  return '<html><body>' + html + '</body></html>'
}

router.get('/active', function(req, res, next) {
  metrcPackages.active().then((results) => {
    res.send(render(results));
  })           
})

router.get('/inactive', function(req, res, next) {
  metrcPackages.inactive().then((results) => {
    res.send(render(results));
  })          
})

router.get('/onhold', function(req, res, next) {
  metrcPackages.onhold().then((results) => {
    res.send(render(results));
  });          
})

router.get('/all', function(req, res, next) {
  metrcPackages.all().then((results) => {
    res.send(render(results));
  })
})

router.get('/fetch', function(req, res, next) {
  res.render('fetchPackageForm.html')
})

router.post('/submit/fetch', function(req, res, next) {
  const identifier = req.body.identifier
  metrcPackages.fetch(identifier).then((results) => {
    res.send(render(results));
  })
})

router.get('/create', function(req, res, next) {
  res.render('createPackageForm.html')
})

router.post('/submit/create', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.create(payload).then((results) => {
    res.send(render(results))
  })
})

module.exports = router;
