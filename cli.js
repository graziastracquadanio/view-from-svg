#! /usr/bin/env node

const fromSvg = require('./lib.js')
const fs = require('fs')

let [ cmd, file ] = process.argv.slice(2)

if (cmd === 'help') {
  console.log(`
  Morph SVG to ViewsDX View.

  To create a View from an SVG, run:
    view-from-svg file.svg

  If you need the legacy Pages format, run it as:
    view-from-svg legacy file.svg


  (c) 2017 UXtemple Ltd
  https://viewsdx.com
`)
}

let legacy = cmd === 'legacy' || false
if (!file) {
  file = cmd
}

if (!fs.existsSync(file)) {
  console.error(`${file} doesn't exist. ¯\_(ツ)_/¯.\nIs the path correct?`)
} else {
  console.log(fromSvg(fs.readFileSync(file, 'utf-8'), legacy))
}
