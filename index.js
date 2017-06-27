var earcut = require('earcut')

module.exports = function (mesh, f) {
  var draw = {
    points: { attributes: { positions: [] }, count: 0 },
    linestrip: { attributes: { positions: [] }, count: 0 },
    triangles: { attributes: { positions: [] }, cells: [] }
  }
  walk(mesh)
  return draw

  function walk (m) {
    if (m.features) m.features.forEach(walk)
    if (m.geometry) geometry(m.geometry, m)
  }
  function geometry (g, m) {
    if (g.type === 'Point') {
      draw.points.attributes.positions.push(g.coordinates)
      draw.points.count++
      if (f) {
        var xattrs = f(m, g, 0)
        if (xattrs) {
          var keys = Object.keys(xattrs)
          for (var i = 0; i < keys.length; i++) {
            if (!draw.points.attributes[keys[i]]) {
              draw.points.attributes[keys[i]] = []
            }
            draw.points.attributes[keys[i]].push(xattrs[keys[i]])
          }
        }
      }
    } else if (g.type === 'MultiPoint') {
      for (var i = 0; i < g.coordinates.length; i++) {
        draw.points.attributes.positions.push(g.coordinates[i])
        draw.points.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.points.attributes[keys[i]]) {
                draw.points.attributes[keys[i]] = []
              }
              draw.points.attributes[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
    } else if (g.type === 'LineString') {
      if (draw.linestrip.attributes.positions.length > 0) {
        var prev = draw.linestrip.attributes.positions[
          draw.linestrip.attributes.positions.length-1]
        draw.linestrip.attributes.positions.push(prev)
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, prev, 0, 1)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip.attributes[keys[i]]) {
                draw.linestrip.attributes[keys[i]] = []
              }
              draw.points.attributes[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
        draw.linestrip.attributes.positions.push(g.coordinates[0])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[0], 0, 0)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip.attributes[keys[i]]) {
                draw.linestrip.attributes[keys[i]] = []
              }
              draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
      for (var i = 0; i < g.coordinates.length; i++) {
        draw.linestrip.attributes.positions.push(g.coordinates[i])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i, 0)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip.attributes[keys[i]]) {
                draw.linestrip.attributes[keys[i]] = []
              }
              draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
        draw.linestrip.attributes.positions.push(g.coordinates[i])
        draw.linestrip.count++
        if (f) {
          var xattrs = f(m, g.coordinates[i], i, 1)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var i = 0; i < keys.length; i++) {
              if (!draw.linestrip.attributes[keys[i]]) {
                draw.linestrip.attributes[keys[i]] = []
              }
              draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
            }
          }
        }
      }
    } else if (g.type === 'MultiLineString') {
      for (var j = 0; j < g.coordinates.length; j++) {
        if (draw.linestrip.attributes.positions.length > 0) {
          var prev = draw.linestrip.attributes.positions[
            draw.linestrip.attributes.positions.length-1]
          draw.linestrip.attributes.positions.push(prev)
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, prev, j, 0, 1)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip.attributes[keys[i]]) {
                  draw.linestrip.attributes[keys[i]] = []
                }
                draw.points.attributes[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
          draw.linestrip.attributes.positions.push(g.coordinates[j][0])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][0], j, 0, 0)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip.attributes[keys[i]]) {
                  draw.linestrip.attributes[keys[i]] = []
                }
                draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
        }
        for (var i = 0; i < g.coordinates[j].length; i++) {
          draw.linestrip.attributes.positions.push(g.coordinates[j][i])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][i], j, i, 0)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip.attributes[keys[i]]) {
                  draw.linestrip.attributes[keys[i]] = []
                }
                draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
          draw.linestrip.attributes.positions.push(g.coordinates[j][i])
          draw.linestrip.count++
          if (f) {
            var xattrs = f(m, g.coordinates[j][i], j, i, 1)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var i = 0; i < keys.length; i++) {
                if (!draw.linestrip.attributes[keys[i]]) {
                  draw.linestrip.attributes[keys[i]] = []
                }
                draw.linestrip.attributes[keys[i]].push(xattrs[keys[i]])
              }
            }
          }
        }
      }
    } else if (g.type === 'Polygon') {
      var data = earcut.flatten(g.coordinates)
      var cells = earcut(data.vertices, data.holes, data.dimensions)
      var len = draw.triangles.attributes.positions.length
      for (var i = 0; i < cells.length; i++) {
        draw.triangles.cells.push(len + cells[i])
      }
      for (var i = 0; i < data.vertices.length; i++) {
        draw.triangles.attributes.positions.push(data.vertices[i])
        if (f) {
          var xattrs = f(m, data.vertices[i], i)
          if (xattrs) {
            var keys = Object.keys(xattrs)
            for (var j = 0; j < keys.length; j++) {
              if (!draw.triangles.attributes[keys[j]]) {
                draw.triangles.attributes[keys[j]] = []
              }
              draw.triangles.attributes[keys[j]].push(xattrs[keys[j]])
            }
          }
        }
      }
    } else if (g.type === 'MultiPolygon') {
      for (var j = 0; j < g.coordinates.length; j++) {
        var data = earcut.flatten(g.coordinates[j])
        var cells = earcut(data.vertices, data.holes, data.dimensions)
        var len = draw.triangles.attributes.positions.length
        for (var i = 0; i < cells.length; i++) {
          draw.triangles.cells.push(len + cells[i])
        }
        for (var i = 0; i < data.vertices.length; i++) {
          draw.triangles.attributes.positions.push(data.vertices[i])
          if (f) {
            var xattrs = f(m, data.vertices[i], j, i)
            if (xattrs) {
              var keys = Object.keys(xattrs)
              for (var k = 0; k < keys.length; k++) {
                if (!draw.triangles.attributes[keys[k]]) {
                  draw.triangles.attributes[keys[k]] = []
                }
                draw.triangles.attributes[keys[k]].push(xattrs[keys[k]])
              }
            }
          }
        }
      }
    } else if (g.type === 'GeometryCollection') {
    }
  }
}
