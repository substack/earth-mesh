# earth-mesh

generate triangulated meshes from shapefiles and geojson

# usage

```
usage: earth-mesh FILE {OPTIONS}

  -i --iformat   Input format: zip, json
  -f --format    Output format: xyz, lonlat, latlon, thetaphi, phitheta
  -p --progress  Show a progress bar.
  -l --lines     Output mesh edges instead of triangles.

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

* `opts.progress(n,total)` - function to call when units of work are finished
* `opts.format` - control the output format for position vertices

Available formats:

* `'xyz'` - `[x,y,z]` coordinates on the unit sphere (default)
* `'lonlat'` - `[lon,lat]` pairs in degrees
* `'latlon'` - `[lat,lon]` pairs in degrees
* `'thetaphi'` - `[theta,phi]` pairs in radians
* `'phitheta'` - `[phi,theta]` pairs in radians

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
