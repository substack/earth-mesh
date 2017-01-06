#!/usr/bin/env node
var shp = require('shpjs')
var fs = require('fs')
var path = require('path')
var skeleton = require('simplicial-complex').skeleton
var concat = require('concat-stream')
var createMesh = require('../')

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  boolean: [ 'lines', 'progress' ],
  alias: { i: 'iformat', f: 'format', p: 'progress', h: 'help' }
})
if (argv.help) {
  return fs.createReadStream(path.join(__dirname,'usage.txt'))
    .pipe(process.stdout)
}

var input = argv._[0] === '-' || argv._.length === 0
  ? process.stdin
  : fs.createReadStream(argv._[0])

input.pipe(concat(function (buf) {
  var fmt = argv.iformat
  if (!fmt && /\.(geo)?json$/i.test(argv._[0])) {
    fmt = 'json'
  } else if (!fmt && /^[{\[]/.test(buf)) {
    fmt = 'json'
  } else if (!fmt && /\.zip$/i.test(argv._[0])) {
    fmt = 'zip'
  } else {
    fmt = 'zip'
  }
  var mesh = null
  var opts = {
    progress: argv.progress ? pbar : null,
    format: argv.format
  }
  if (fmt === 'zip') {
    mesh = createMesh(shp.parseZip(buf), opts)
  } else if (fmt === 'json') {
    mesh = createMesh(JSON.parse(buf.toString('utf8')), opts)
  } else {
    console.error('unsupported format')
    return process.exit(1)
  }
  if (argv.lines) {
    mesh.cells = skeleton(mesh.cells,1)
  }
  console.log(JSON.stringify(mesh))
}))

function pbar (n, total) {
  if (n === total) {
    process.stderr.write('\r' + Array(30).join(' ') + '\r')
  } else {
    process.stderr.write('\r' + n + '/' + total + ' ')
  }
}
