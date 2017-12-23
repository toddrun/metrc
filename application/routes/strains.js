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
  res.render('createStrainForm.html')
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
  res.render('deleteStrainForm.html')
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
  res.render('fetchStrainForm.html')
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
  res.render('updateStrainForm.html')
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
