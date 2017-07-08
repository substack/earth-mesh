module.exports = function (data, opts) {
  var g = grid(opts)
  var tkeys = Object.keys(data.triangle)
    .filter(function (x) { return x !== 'positions' && x !== 'cells' })
  var lkeys = Object.keys(data.linestrip)
    .filter(function (x) { return x !== 'positions' && x !== 'count' })
  var pkeys = Object.keys(data.point)
    .filter(function (x) { return x !== 'positions' && x !== 'count' })
  var tiles = []
  for (var i = 0; i < g.length; i++) {
    tiles[i] = {
      bbox: g[i],
      triangle: { positions: [], cells: [] },
      linestrip: { positions: [], count: 0 },
      point: { positions: [], count: 0 }
    }
    for (var j = 0; j < tkeys.length; j++) {
      tiles[i].triangle[tkeys[j]] = []
    }
    for (var j = 0; j < lkeys.length; j++) {
      tiles[i].linestrip[lkeys[j]] = []
    }
    for (var j = 0; j < pkeys.length; j++) {
      tiles[i].point[pkeys[j]] = []
    }
  }
  for (var i = 0; i < g.length; i++) {
    var bbox = g[i]
    var tile = tiles[i]
    var ipts = {}
    for (var j = 0; j < data.triangle.cells.length; j++) {
      var cell = data.triangle.cells[j]
      if (cell.length !== 3) {
        throw new Error('non-triangle cell at position ' + j)
      }
      var pt = data.triangle.positions[cell[0]]
      if (inside(bbox, pt)) insert(tile, cell, ipts)
    }
  }
  return tiles
  function insert (tile, cell, ipts) {
    var ti = 0
    var ncell = [0,0,0]
    for (var k = 0; k < 3; k++) {
      if (ipts[cell[k]] !== undefined) {
        ti = ipts[cell[k]]
      } else {
        ti = tile.triangle.positions.length
        var pt = data.triangle.positions[cell[k]]
        tile.triangle.positions.push(pt)
        ipts[cell[k]] = ti
        for (var x = 0; x < tkeys.length; x++) {
          var tv = data.triangle[tkeys[x]][cell[k]]
          tile.triangle[tkeys[x]].push(tv)
        }
      }
      ncell[k] = ti
    }
    tile.triangle.cells.push(ncell)
  }
}

function inside (bbox, pt) {
  return bbox[0] <= pt[0] && pt[0] <= bbox[2]
    && bbox[1] <= pt[1] && pt[1] <= bbox[3]
}

function grid (opts) {
  if (!opts) opts = {}
  var nx = opts.xcount || 4
  var ny = opts.ycount || 4
  var bbox = opts.bbox || [-180,-90,180,90]
  var xspan = bbox[2] - bbox[0]
  var yspan = bbox[3] - bbox[1]
  var pymin = Math.sin(bbox[1]*Math.PI/180)
  var pymax = Math.sin(bbox[3]*Math.PI/180)
  var pyspan = pymax - pymin
  var g = []
  for (var x = 0; x < nx; x++) {
    var x0 = bbox[0] + x/nx*xspan
    var x1 = bbox[0] + (x+1)/nx*xspan
    for (var y = 0; y < ny; y++) {
      var p0 = f(y)
      var p1 = f(y+1)
      var y0 = Math.asin(p0) / Math.PI * 180
      var y1 = Math.asin(p1) / Math.PI * 180
      g.push([ x0, y0, x1, y1 ])
    }
  }
  return g
  function f (y) { return y/ny*pyspan+pymin }
}
