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
  res.render('jsonPayloadForm.html', {
    title: 'Create Item',
    submitUrl: '/items/submit/item',
    submitLabel: 'Save',
    exampleRequest: {
      "ItemCategory": "Buds",
      "Name": "Buds Item",
      "UnitOfMeasure": "Ounces",
      "Strain": "Spring Hill Kush",
      "UnitThcContent": null,
      "UnitThcContentUnitOfMeasure": null,
      "UnitWeight": null,
      "UnitWeightUnitOfMeasure": null
    }
  })
})

router.post('/submit/item', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcItems.create(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/bulkcreate', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Multiple Items',
    submitUrl: '/items/submit/bulkitems',
    submitLabel: 'Save',
    exampleRequest: [
      {
        "ItemCategory": "Buds",
        "Name": "Buds Item",
        "UnitOfMeasure": "Ounces",
        "Strain": "Spring Hill Kush",
        "UnitThcContent": null,
        "UnitThcContentUnitOfMeasure": null,
        "UnitWeight": null,
        "UnitWeightUnitOfMeasure": null
      },
      {
        "ItemCategory": "Infused (edible)",
        "Name": "Infused Item",
        "UnitOfMeasure": "Each",
        "Strain": null,
        "UnitThcContent": 10.0,
        "UnitThcContentUnitOfMeasure": "Milligrams",
        "UnitWeight": 150.0,
        "UnitWeightUnitOfMeasure": "Milligrams"
      }
    ]
  })
})

router.post('/submit/bulkitems', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcItems.bulkCreate(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/delete', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Item Id',
    submitUrl: '/items/delete/item',
    variableName: 'id',
    sumbitLabel: 'Delete Item'
  })
})

router.post('/delete/item', function(req, res, next) {
  const id = req.body.id
  metrcItems.delete(id).then(() => {
    res.send("Deleted item " + id)
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/fetch', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Item Id',
    submitUrl: '/items/submit/fetch',
    variableName: 'id',
    submitLabel: 'Fetch Item'
  })
})

router.post('/submit/fetch', function(req, res, next) {
  const id = req.body.id
  metrcItems.fetch(id).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/update', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Update Item',
    submitUrl: '/items/submit/update',
    submitLabel: 'Update Item',
    exampleRequest: {
      "Id": 1,
      "Name": "Buds Item",
      "ItemCategory": "Buds",
      "UnitOfMeasure": "Ounces",
      "Strain": "String Hill Kush",
      "UnitThcContent": null,
      "UnitThcContentUnitOfMeasure": null,
      "UnitWeight": null,
      "UnitWeightUnitOfMeasure": null
    }
  })
})

router.post('/submit/update', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcItems.update(payload).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/bulkupdate', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Update Multiple Items',
    submitUrl: '/items/submit/bulkupdate',
    submitLabel: 'Update',
    exampleRequest: [
      {
        "Id": 1,
        "Name": "Buds Item",
        "ItemCategory": "Buds",
        "UnitOfMeasure": "Ounces",
        "Strain": "String Hill Kush",
        "UnitThcContent": null,
        "UnitThcContentUnitOfMeasure": null,
        "UnitWeight": null,
        "UnitWeightUnitOfMeasure": null
      },
      {
        "Id": 2,
        "Name": "Concentrate (Each)",
        "ItemCategory": "Concentrate (Each)",
        "UnitOfMeasure": "Each",
        "Strain": null,
        "UnitThcContent": 10.0,
        "UnitThcContentUnitOfMeasure": "Milligrams",
        "UnitWeight": 100.0,
        "UnitWeightUnitOfMeasure": "Milligrams"
      }
    ]
  })
})

router.post('/submit/bulkupdate', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcItems.bulkUpdate(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

module.exports = router;
