#!/usr/bin/env node
var shp = require('shpjs')
var fs = require('fs')
var path = require('path')
var skeleton = require('simplicial-complex').skeleton
var concat = require('concat-stream')
var fivecolor = require('five-color-map')
var createMesh = require('../')
var tiles = require('../tiles.js')

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  boolean: [ 'lines', 'progress', 'fivecolor' ],
  alias: { i: 'iformat', o: 'outdir', h: 'help' }
})
if (argv.help) {
  return fs.createReadStream(path.join(__dirname,'usage.txt'))
    .pipe(process.stdout)
}

var input = argv._[0] === '-' || argv._.length === 0
  ? process.stdin
  : fs.createReadStream(argv._[0])

input.pipe(concat(function (buf) {
  if (argv.tiles) {
    var xy = argv.tiles.split(',').map(Number)
    var ts = tiles(JSON.parse(buf.toString('utf8')), {
      xcount: xy[0],
      ycount: xy[1],
      bbox: argv.bbox
    })
    if (argv.outdir) {
      var meta = {}
      var pending = ts.length
      var errors = []
      for (var n = 0; n < ts.length; n++) {
        meta[n] = ts[n].bbox
        delete ts[n].bbox
        var file = path.join(argv.outdir, n + '.json')
        fs.writeFile(file, JSON.stringify(ts[n]), function (err) {
          if (err) errors.push(err)
          if (--pending === 0) done()
        })
      }
      function done () {
        var mfile = path.join(argv.outdir, 'meta.json')
        fs.writeFile(mfile, JSON.stringify(meta), function (err) {
          if (err) errors.push(err)
          errors.forEach(function (err) { console.error(err) })
          if (errors.length) process.exit(1)
        })
      }
    } else {
      console.log(JSON.stringify(ts))
    }
  } else readGeoShp(buf)
}))

function readGeoShp (buf) {
  var fmt = argv.iformat
  if (!fmt && /\.(geo)?json$/i.test(argv._[0])) {
    fmt = 'json'
  } else if (!fmt && /^[{\[]/.test(buf)) {
    fmt = 'json'
  } else if (!fmt && /\.zip$/i.test(argv._[0])) {
    fmt = 'zip'
  } else if (!fmt) {
    fmt = 'zip'
  }
  var mesh = null
  var opts = {
    progress: argv.progress ? pbar : null,
    format: argv.format
  }
  if (fmt === 'zip') {
    mesh = parse(shp.parseZip(buf), opts)
  } else if (fmt === 'json') {
    mesh = parse(JSON.parse(buf.toString('utf8')), opts)
  } else {
    console.error('unsupported format')
    return process.exit(1)
  }
  if (argv.lines) {
    mesh.cells = skeleton(mesh.cells,1)
  }
  var size = 50000
  Object.keys(mesh).forEach(function (key,i) {
    process.stdout.write((i===0?'{':',')+JSON.stringify(key)+':')
    Object.keys(mesh[key]).forEach(function (k,j) {
      process.stdout.write((j===0?'{':',')+JSON.stringify(k)+':[')
      for (var n = 0; n < mesh[key][k].length; n+=size) {
        var s = JSON.stringify(mesh[key][k].slice(n,n+size))
        process.stdout.write((n===0?'':',')+s.slice(1,-1))
      }
      process.stdout.write(']')
    })
    process.stdout.write('}')
  })
  process.stdout.write('}\n')
}

function pbar (n, total) {
  if (n === total) {
    process.stderr.write('\r' + Array(30).join(' ') + '\r')
  } else {
    process.stderr.write('\r' + n + '/' + total + ' ')
  }
}

function parse (geojson) {
  if (argv.fivecolor) {
    geojson = fivecolor(geojson)
    var colors = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6']
    return createMesh(geojson, function (m) {
      return {
        colors: colors.indexOf(m.properties.fill)
      }
    })
  } else return createMesh(geojson)
}
