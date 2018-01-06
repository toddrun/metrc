'use strict'

var express = require('express');
var router = express.Router();

const MetrcTransfers = require('../../lib/MetrcTransfers')
const metrc = require('./helpers/MetrcFactory').getNew()
const metrcTransfers = new MetrcTransfers(metrc)
const renderer = require('./helpers/ResultRenderer')

const render = function(results) {
  return renderer.render(results)
}

router.get('/incoming', function(req, res, next) {
  metrcTransfers.incoming().then((results) => {
    res.send(render(results));
  })           
})

router.get('/outgoing', function(req, res, next) {
  metrcTransfers.outgoing().then((results) => {
    res.send(render(results));
  })           
})

router.get('/rejected', function(req, res, next) {
  metrcTransfers.rejected().then((results) => {
    res.send(render(results));
  })           
})

router.get('/fetchDelivery', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Transfer Id',
    submitUrl: '/transfers/submit/fetchDelivery',
    variableName: 'id',
    sumbitLabel: 'Fetch Transfer Data'
  })
})

router.post('/submit/fetchDelivery', function(req, res, next) {
  const id = req.body.id
  metrcTransfers.fetchDelivery(id).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/fetchDeliveredPackages', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Transfer Id',
    submitUrl: '/transfers/submit/fetchDeliveredPackages',
    variableName: 'id',
    sumbitLabel: 'Fetch Transfered Packages Data'
  })
})

router.post('/submit/fetchDeliveredPackages', function(req, res, next) {
  const id = req.body.id
  metrcTransfers.fetchDeliveredPackages(id).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/states', function(req, res, next) {
  metrcTransfers.states().then((results) => {
    res.send(render(results));
  })           
})

module.exports = router;
