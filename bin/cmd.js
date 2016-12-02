#!/usr/bin/env node
var shp = require('shpjs')
var fs = require('fs')
var skeleton = require('simplicial-complex').skeleton
var concat = require('concat-stream')
var createMesh = require('../')

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  boolean: [ 'lines' ],
  alias: { f: 'format' }
})

var input = argv._[0] === '-' || argv._.length === 0
  ? process.stdin
  : fs.createReadStream(argv._[0])

input.pipe(concat(function (buf) {
  var fmt = argv.format
  if (!fmt && /\.(geo)?json$/i.test(argv._[0])) {
    fmt = 'json'
  } else if (!fmt && /^[{\[]/.test(buf)) {
    fmt = 'json'
  } else if (!fmt && /\.zip$/i.test(argv._[0])) {
    fmt = 'zip'
  } else if (!fmt) {
    console.error('unspecified format, cannot guess')
    return process.exit(1)
  }
  var mesh = null
  if (fmt === 'zip') {
    mesh = createMesh(shp.parseZip(buf))
  } else if (fmt === 'json') {
    mesh = createMesh(JSON.parse(buf.toString('utf8')))
  } else {
    console.error('unsupported format')
    return process.exit(1)
  }
  if (argv.lines) {
    mesh.cells = skeleton(mesh.cells,1)
  }
  console.log(JSON.stringify(mesh))
}))
