# earth-mesh

generate triangulated meshes from shapefiles and geojson

# usage

```
usage: earth-mesh FILE {OPTIONS}

  -i --iformat   Input format: zip, json

Reads from stdin when FILE is "-" or not provided.

```

# example

## from geojson

``` js
var createMesh = require('earth-mesh')
var fs = require('fs')

var file = process.argv[2]
var geodata = JSON.parse(fs.readFileSync(file,'utf8'))
var mesh = createMesh(geodata)

console.log(JSON.stringify(mesh))
```

## from a zipped shapefile

``` js
var createMesh = require('earth-mesh')
var shp = require('shpjs')
var fs = require('fs')

var file = process.argv[2]
var geodata = shp.parseZip(fs.readFileSync(file,'utf8'))
var mesh = createMesh(geodata)

console.log(JSON.stringify(mesh))
```

# api

``` js
var createMesh = require('earth-mesh')
```

## var mesh = createMesh(geodata, opts)

Create a simplicial complex `mesh` from some geojson-formatted data.

# install

To get the library:

```
npm install earth-mesh
```

To get the command:

```
npm install -g earth-mesh
```

# license

BSD
