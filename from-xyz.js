var normalize = require('gl-vec3/normalize')
var tmp = []

module.exports = function (out, p) {
  normalize(tmp, p)
  var x = tmp[0], y = tmp[1], z = tmp[2]
  out[0] = Math.asin(y) / Math.PI * 180 // lat
  out[1] = Math.atan2(z,x) / Math.PI * 180 // lon
  return out
}
