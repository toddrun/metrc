'use strict'

var express = require('express');
var router = express.Router();

const MetrcPackages = require('../../lib/MetrcPackages')
const metrc = require('./helpers/MetrcFactory').getNew()
const metrcPackages = new MetrcPackages(metrc)
const renderer = require('./helpers/ResultRenderer')

const render = function(results) {
  return renderer.render(results)
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

router.get('/types', function(req, res, next) {
  metrcPackages.types().then((results) => {
    res.send(render(results));
  })          
})

router.get('/all', function(req, res, next) {
  metrcPackages.all().then((results) => {
    res.send(render(results));
  })
})

router.get('/fetch', function(req, res, next) {
  res.render('singleFieldForm.html', {
    label: 'Enter Package Id',
    submitUrl: '/packages/submit/fetch',
    variableName: 'identifier',
    submitLabel: 'Fetch Package'
  })
})

router.post('/submit/fetch', function(req, res, next) {
  const identifier = req.body.identifier
  metrcPackages.fetch(identifier).then((results) => {
    res.send(render(results));
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/create', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Package',
    submitUrl: '/packages/submit/create',
    submitLabel: 'Create Package',
    exampleRequest: {
      "Tag": "ABCDEF01234567000001",
      "Item": "Buds",
      "Quantity": 16.0,
      "UnitOfMeasure": "Ounces",
      "IsProductionBatch": true,
      "ProductionBatchNumber": "PB-2017-12-19",
      "ProductRequiresRemediation": false,
      "ActualDate": "2017-12-19",
      "Ingredients": [
        {
          "Package": "ABCDEF01234567000002",
          "Quantity": 8.0,
          "UnitOfMeasure": "Ounces"
        },
        {
          "Package": "ABCDEF01234567000003",
          "Quantity": 8.0,
          "UnitOfMeasure": "Ounces"
        }
      ]
    }
  })
})

router.post('/submit/create', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.create(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/bulkcreate', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Multiple Packages',
    submitUrl: '/packages/submit/bulkcreate',
    submitLabel: 'Create Multiple Packages',
    exampleRequest: [
      {
        "Tag": "ABCDEF012345670000020201",
        "Item": "Buds",
        "Quantity": 16.0,
        "UnitOfMeasure": "Ounces",
        "IsProductionBatch": false,
        "ProductionBatchNumber": null,
        "ProductRequiresRemediation": false,
        "ActualDate": "2015-12-15",
        "Ingredients": [
          {
            "Package": "ABCDEF012345670000010041",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          },
          {
            "Package": "ABCDEF012345670000010042",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          }
        ]
      },
      {
        "Tag": "ABCDEF012345670000020202",
        "Item": "Buds",
        "Quantity": 16.0,
        "UnitOfMeasure": "Ounces",
        "IsProductionBatch": true,
        "ProductionBatchNumber": "PB-2015-12-15",
        "ProductRequiresRemediation": false,
        "ActualDate": "2015-12-15",
        "Ingredients": [
          {
            "Package": "ABCDEF012345670000010043",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          },
          {
            "Package": "ABCDEF012345670000010044",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          }
        ]
      }
    ]
  })
})

router.post('/submit/bulkcreate', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.bulkCreate(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/createtesting', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Testing Package',
    submitUrl: '/packages/submit/createtesting',
    submitLabel: 'Create Testing Package',
    exampleRequest: {
      "Tag": "ABCDEF012345670000020201",
      "Item": "Buds",
      "Quantity": 16.0,
      "UnitOfMeasure": "Ounces",
      "IsProductionBatch": false,
      "ProductionBatchNumber": null,
      "ProductRequiresRemediation": false,
      "ActualDate": "2015-12-15",
      "Ingredients": [
        {
          "Package": "ABCDEF012345670000010041",
          "Quantity": 8.0,
          "UnitOfMeasure": "Ounces"
        },
        {
          "Package": "ABCDEF012345670000010042",
          "Quantity": 8.0,
          "UnitOfMeasure": "Ounces"
        }
      ]
    }
  })
})

router.post('/submit/createtesting', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.createTesting(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/bulkcreatetesting', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Multiple Testing Packages',
    submitUrl: '/packages/submit/bulkcreatetesting',
    submitLabel: 'Create Multiple Testing Packages',
    exampleRequest: [
      {
        "Tag": "ABCDEF012345670000020201",
        "Item": "Buds",
        "Quantity": 16.0,
        "UnitOfMeasure": "Ounces",
        "IsProductionBatch": false,
        "ProductionBatchNumber": null,
        "ProductRequiresRemediation": false,
        "ActualDate": "2015-12-15",
        "Ingredients": [
          {
            "Package": "ABCDEF012345670000010041",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          },
          {
            "Package": "ABCDEF012345670000010042",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          }
        ]
      },
      {
        "Tag": "ABCDEF012345670000020202",
        "Item": "Buds",
        "Quantity": 16.0,
        "UnitOfMeasure": "Ounces",
        "IsProductionBatch": true,
        "ProductionBatchNumber": "PB-2015-12-15",
        "ProductRequiresRemediation": false,
        "ActualDate": "2015-12-15",
        "Ingredients": [
          {
            "Package": "ABCDEF012345670000010043",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          },
          {
            "Package": "ABCDEF012345670000010044",
            "Quantity": 8.0,
            "UnitOfMeasure": "Ounces"
          }
        ]
      }
    ]
  })
})

router.post('/submit/bulkcreatetesting', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.bulkCreateTesting(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/createplantings', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Plantings Package',
    submitUrl: '/packages/submit/createplantings',
    submitLabel: 'Create Plantings Package',
    exampleRequest: {
      "PackageLabel": "ABCDEF012345670000010041",
      "PackageAdjustmentAmount": 2.0,
      "PackageAdjustmentUnitOfMeasureName": "Ounces",
      "PlantBatchName": "AK-47 Clone 1/31/2017",
      "PlantBatchType": "Clone",
      "PlantCount": 1,
      "StrainName": "AK-47",
      "PlantedDate": "2017-01-31T00:00:00Z"
    }
  })
})

router.post('/submit/createplantings', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.createPlantings(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/bulkcreateplantings', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Create Multiple Plantings Packages',
    submitUrl: '/packages/submit/bulkcreateplantings',
    submitLabel: 'Create Multiple Plantings Packages',
    exampleRequest: [
      {
        "PackageLabel": "ABCDEF012345670000010041",
        "PackageAdjustmentAmount": 2.0,
        "PackageAdjustmentUnitOfMeasureName": "Ounces",
        "PlantBatchName": "AK-47 Clone 1/31/2017",
        "PlantBatchType": "Clone",
        "PlantCount": 1,
        "StrainName": "AK-47",
        "PlantedDate": "2017-01-31T00:00:00Z"
      },
      {
        "PackageLabel": "ABCDEF012345670000010042",
        "PackageAdjustmentAmount": 4.0,
        "PackageAdjustmentUnitOfMeasureName": "Ounces",
        "PlantBatchName": "Flo Seed 1/31/2017",
        "PlantBatchType": "Seed",
        "PlantCount": 2,
        "StrainName": "Flo",
        "PlantedDate": "2017-01-31T00:00:00Z"
      }
    ]
  })
})

router.post('/submit/bulkcreateplantings', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.bulkCreatePlantings(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/changeItem', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Change Package\'s Item',
    submitUrl: '/packages/submit/changeItem',
    submitLabel: 'Change Item',
    exampleRequest: {
      "Label": "ABCDEF01234567000001",
      "Item": "Buds - My Buddy"
    }
  })
})

router.post('/submit/changeItem', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.changeItem(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/adjust', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Adjust Package',
    submitUrl: '/packages/submit/adjust',
    submitLabel: 'Adjust Package',
    exampleRequest: {
      "Label": "ABCDEF012345670000010041",
      "Quantity": -2.0,
      "UnitOfMeasure": "Ounces",
      "AdjustmentReason": "Drying",
      "AdjustmentDate": "2015-12-15",
      "ReasonNote": "Drying"
    }
  })
})

router.post('/submit/adjust', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.adjust(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/finish', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Finish Package',
    submitUrl: '/packages/submit/finish',
    submitLabel: 'Finish Package',
    exampleRequest: {
      "Label": "ABCDEF012345670000010041",
      "ActualDate": "2015-12-15"
    }
  })
})

router.post('/submit/finish', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.finish(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/unfinish', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Unfinish Package',
    submitUrl: '/packages/submit/unfinish',
    submitLabel: 'Unfinish Package',
    exampleRequest: {
      "Label": "ABCDEF012345670000010041"
    }
  })
})

router.post('/submit/unfinish', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.unfinish(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

router.get('/remediate', function(req, res, next) {
  res.render('jsonPayloadForm.html', {
    title: 'Remediate Package',
    submitUrl: '/packages/submit/remediate',
    submitLabel: 'Remediate Package',
    exampleRequest: {
      "PackageLabel": "ABCDEF012345670000020201",
      "RemediationMethodName": "Further Drying",
      "RemediationDate": "2016-10-17",
      "RemediationSteps": "Used hair dryer"
    }
  })
})

router.post('/submit/remediate', function(req, res, next) {
  const payload = JSON.parse(req.body.payload)
  metrcPackages.remediate(payload).then((results) => {
    res.send(render(results))
  }).catch((err) => {
    res.send(err)
  })
})

module.exports = router;
