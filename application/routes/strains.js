'use strict'

var express = require('express');
var router = express.Router();

const MetrcStrains = require('../../lib/MetrcStrains')
const metrc = require('./helpers/MetrcFactory').getNew()
const metrcStrains = new MetrcStrains(metrc)
const renderer = require('./helpers/ResultRenderer')

const render = function(results) {
  return renderer.render(results)
}

router.get('/active', function(req, res, next) {
  metrcStrains.active().then((results) => {
    res.send(render(results));
  })           
})

router.get('/create', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Strain',
    submitUrl: '/strains/submit/strain',
    submitLabel: 'Create Strain',
    exampleRequest: {
      "Name": "Spring Hill Kush",
      "TestingStatus": "None",
      "ThcLevel": 0.1865,
      "CbdLevel": 0.1075,
      "IndicaPercentage": 25.0,
      "SativaPercentage": 75.0
    }
  })
})

router.post('/submit/strain', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcStrains.create(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/delete', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Strain Id',
    submitUrl: '/strains/delete/strain',
    variableName: 'id',
    sumbitLabel: 'Delete Strain'
  })
})

router.post('/delete/strain', function(req, res, next) {
  const id = req.body.id
  metrcStrains.delete(id).then(() => {
    res.send("Deleted item " + id)
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/fetch', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Strain Id',
    submitUrl: '/strains/submit/fetch',
    variableName: 'id',
    sumbitLabel: 'Fetch Strain'
  })
})

router.post('/submit/fetch', function(req, res, next) {
  const id = req.body.id
  metrcStrains.fetch(id).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/update', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Update Strain',
    submitUrl: '/strains/submit/update',
    submitLabel: 'Update Strain',
    exampleRequest: {
      "Id": 1,
      "Name": "Spring Hill Kush",
      "TestingStatus": "InHouse",
      "ThcLevel": 0.1865,
      "CbdLevel": 0.1075,
      "IndicaPercentage": 25.0,
      "SativaPercentage": 75.0
    }
  })
})

router.post('/submit/update', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcStrains.update(payload).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

module.exports = router;
