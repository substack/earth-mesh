var earcut = require('earcut')

module.exports = function (mesh, opts, f) {
  if (typeof opts === 'function') {
    f = opts
    opts = {}
  }
  if (!opts) opts = {}
  if (!f) f = function (x) { return null }
  var draw = {
    point: { positions: [], count: 0 },
    linestrip: { positions: [], count: 0 },
    triangle: { positions: [], cells: [] }
  }
  walk(mesh)
  return draw

  function walk (m) {
    if (m.features) m.features.forEach(walk)
    if (m.geometry) geometry(m.geometry, m)
    if (m.geometries) {
      m.geometries.forEach(function (g) { geometry(g, m) })
    }
  }
  function geometry (g, m) {
    if (g.type === 'Point') {
      draw.point.positions.push(g.coordinates)
      draw.point.count++
      if (f) {
        var xattrs = f(m, g, 0)
        if (xattrs) {
          var keys = Object.keys(xattrs)
          for (var i = 0; i < keys.length; i++) {
            if (!draw.point[keys[i]]) {
              draw.point[keys[i]] = []
            }
            draw.point[keys[i]].push(xattrs[keys[i]])
          }
        }
      }
    } else if (g.type === 'MultiPoint') {
      for (var i = 0; i < g.coordinates.length; i++) {
        draw.point.positions.push(g.coordinates[i])
        draw.point.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.point[keys[i]]) {
                draw.point[keys[i]] = []
              }
              draw.point[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
    } else if (g.type === 'LineString') {
      if (draw.linestrip.positions.length > 0) {
        var prev = draw.linestrip.positions[
          draw.linestrip.positions.length-1]
        draw.linestrip.positions.push(prev)
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, prev, 0, 1)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip[keys[i]]) {
                draw.linestrip[keys[i]] = []
              }
              draw.point[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
        draw.linestrip.positions.push(g.coordinates[0])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[0], 0, 0)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip[keys[i]]) {
                draw.linestrip[keys[i]] = []
              }
              draw.linestrip[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
      for (var i = 0; i < g.coordinates.length; i++) {
        draw.linestrip.positions.push(g.coordinates[i])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i, 0)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip[keys[i]]) {
                draw.linestrip[keys[i]] = []
              }
              draw.linestrip[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
        draw.linestrip.positions.push(g.coordinates[i])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i, 1)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip[keys[i]]) {
                draw.linestrip[keys[i]] = []
              }
              draw.linestrip[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
    } else if (g.type === 'MultiLineString') {
      for (var j = 0; j < g.coordinates.length; j++) {
        if (draw.linestrip.positions.length > 0) {
          var prev = draw.linestrip.positions[
            draw.linestrip.positions.length-1]
          draw.linestrip.positions.push(prev)
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, prev, j, 0, 1)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip[keys[i]]) {
                  draw.linestrip[keys[i]] = []
                }
                draw.point[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
          draw.linestrip.positions.push(g.coordinates[j][0])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][0], j, 0, 0)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip[keys[i]]) {
                  draw.linestrip[keys[i]] = []
                }
                draw.linestrip[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
        }
        for (var i = 0; i < g.coordinates[j].length; i++) {
          draw.linestrip.positions.push(g.coordinates[j][i])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][i], j, i, 0)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip[keys[i]]) {
                  draw.linestrip[keys[i]] = []
                }
                draw.linestrip[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
          draw.linestrip.positions.push(g.coordinates[j][i])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][i], j, i, 1)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip[keys[i]]) {
                  draw.linestrip[keys[i]] = []
                }
                draw.linestrip[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
        }
      }
    } else if (g.type === 'Polygon') {
      var data = earcut.flatten(g.coordinates)
      var cells = earcut(data.vertices, data.holes, data.dimensions)
      var len = draw.triangle.positions.length
      for (var i = 0; i < cells.length; i+=3) {
        var c = [len+cells[i],len+cells[i+1],len+cells[i+2]]
        draw.triangle.cells.push(c)
      }
      for (var i = 0; i < data.vertices.length; i+=2) {
        draw.triangle.positions.push(data.vertices.slice(i,i+2))
        if (f) {
          var xattrs = f(m, g.coordinates[i], i)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var j = 0; j < keys.length; j++) {
              if (!draw.triangle[keys[j]]) {
                draw.triangle[keys[j]] = []
              }
              draw.triangle[keys[j]].push(xattrs[keys[j]])
            }
          }
        }
      }
    } else if (g.type === 'MultiPolygon') {
      for (var j = 0; j < g.coordinates.length; j++) {
        var data = earcut.flatten(g.coordinates[j])
        var cells = earcut(data.vertices, data.holes, data.dimensions)
        var len = draw.triangle.positions.length
        for (var i = 0; i < cells.length; i+=3) {
          var c = [len+cells[i],len+cells[i+1],len+cells[i+2]]
          draw.triangle.cells.push(c)
        }
        for (var i = 0; i < data.vertices.length; i+=2) {
          draw.triangle.positions.push(data.vertices.slice(i,i+2))
          if (f) {
            var xattrs = f(m, g.coordinates[j][i], j, i)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var k = 0; k < keys.length; k++) {
                if (!draw.triangle[keys[k]]) {
                  draw.triangle[keys[k]] = []
                }
                draw.triangle[keys[k]].push(xattrs[keys[k]])
              }
            }
          }
        }
      }
    } else if (g.type === 'GeometryCollection') {
      if (g.geometries) {
        g.geometries.forEach(function (g) { geometry(g, m) })
      }
    }
  }
}
