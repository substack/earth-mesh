var createMesh = require('../')
var shp = require('shpjs')
var fs = require('fs')

var file = process.argv[2]
var geodata = shp.parseZip(fs.readFileSync(file,'utf8'))
var mesh = createMesh(geodata)

console.log(JSON.stringify(mesh))
