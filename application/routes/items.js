'use strict'

var express = require('express');
var router = express.Router();

const MetrcItems = require('../../lib/MetrcItems')
const metrc = require('./helpers/MetrcFactory').getNew()
const metrcItems = new MetrcItems(metrc)
const renderer = require('./helpers/ResultRenderer')

const render = function(results) {
  return renderer.render(results)
}

router.get('/active', function(req, res, next) {
  metrcItems.active().then((results) => {
    res.send(render(results));
  })           
})

router.get('/categories', function(req, res, next) {
  metrcItems.categories().then((results) => {
    res.send(render(results));
  })           
})

router.get('/create', function(req, res, next) {
  res.render('createItemForm.html')
})

router.post('/submit/item', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcItems.create(payload).then((results) => {
    res.send(render(results))
  })
})

module.exports = router;
