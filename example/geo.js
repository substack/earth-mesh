var createMesh = require('../')
var fs = require('fs')

var file = process.argv[2]
var geodata = JSON.parse(fs.readFileSync(file,'utf8'))
var mesh = createMesh(geodata)

console.log(JSON.stringify(mesh))
