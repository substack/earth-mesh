var cdt = require('cdt2d')
var clean = require('clean-pslg')
var dist = require('gl-vec3/distance')
var fs = require('fs')
var skeleton = require('simplicial-complex').skeleton
var toxyz = require('./to-xyz.js')
var fromxyz = require('./from-xyz.js')
var center = require('triangle-centroid')
var aeq = require('almost-equal')

module.exports = function (data, opts) {
  if (!opts) opts = {}
  var mesh = { positions: [], cells: [] }
  var total = 0
  for (var i = 0; i < data.features.length; i++) {
    var coords = data.features[i].geometry.coordinates
    for (var j = 0; j < coords.length; j++) {
      total += coords[j].length
    }
  }
  var progress = 0
  for (var i = 0; i < data.features.length; i++) {
    var edges = [], points = []
    var coords = data.features[i].geometry.coordinates
    var xmin = Infinity, xmax = -Infinity
    var ymin = Infinity, ymax = -Infinity
    for (var j = 0; j < coords.length; j++) {
      var n = points.length
      var len = coords[j].length
      for (var k = 0; k < len; k++) {
        var p = coords[j][k]
        var pp = coords[j][(k+1)%len]
        var epsilon = 0.0001
        if (aeq(p[0], pp[0], epsilon) && aeq(p[1], pp[1], epsilon)) {
          // remove duplicates, hangs clean-pslg otherwise
          coords[j].splice(k,1)
          k--
          len--
        }
      }
      for (var k = 0; k < len; k++) {
        var p = coords[j][k]
        if (p[0] < xmin) xmin = p[0]
        if (p[0] > xmax) xmax = p[0]
        if (p[1] < ymin) ymin = p[1]
        if (p[1] > ymax) ymax = p[1]
        edges.push([n+k,n+(k+1)%len])
        points.push(p)
      }
    }
    clean(points, edges)
    for (var y = Math.max(ymin,-82); y < Math.min(ymax,82); y+=4) {
      for (var x = Math.max(xmin,-179.999); x < Math.min(xmax,179.999); x+=4) {
        points.push([x,y])
      }
    }
    var cells = cdt(points, edges, { exterior: false, delaunay: true })
    mesh.cells = mesh.cells.concat(cells.map(function (cs) {
      return cs.map(function (c) {
        return c + mesh.positions.length
      })
    }))
    mesh.positions = mesh.positions.concat(points)
    progress += coords.length
    if (typeof opts.progress === 'function') {
      opts.progress(progress, total)
    }
  }
  if (opts.format === 'lonlat') {
    for (var i = 0; i < mesh.positions.length; i++) {
      var lat = mesh.positions[i][0]
      var lon = mesh.positions[i][1]
      mesh.positions[i][0] = lon
      mesh.positions[i][1] = lat
    }
  } else if (opts.format === 'latlon') {
    //
  } else if (opts.format === 'thetaphi') {
    for (var i = 0; i < mesh.positions.length; i++) {
      var lat = mesh.positions[i][0]
      var lon = mesh.positions[i][1]
      mesh.positions[i][0] = lon * Math.PI / 180
      mesh.positions[i][1] = lat * Math.PI / 180
    }
  } else if (opts.format === 'phitheta') {
    for (var i = 0; i < mesh.positions.length; i++) {
      var lat = mesh.positions[i][0]
      var lon = mesh.positions[i][1]
      mesh.positions[i][0] = lat * Math.PI / 180
      mesh.positions[i][1] = lon * Math.PI / 180
    }
  } else if (opts.format === 'xyz' || true) {
    for (var i = 0; i < mesh.positions.length; i++) {
      mesh.positions[i] = toxyz([], mesh.positions[i])
    }
  }
  return mesh
}
