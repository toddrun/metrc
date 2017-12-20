'use strict'

const Metrc = require('../../../lib/Metrc')
const fs = require('fs')

exports.getNew = function() {
  const rawSettings = fs.readFileSync('config.prop', 'utf8')
  const config = JSON.parse(rawSettings.toString())
  return new Metrc(
    config.domain, 
    config.licenseNumber, 
    config.metrc_software_api_key, 
    config.metrc_user_api_key
  )
}
