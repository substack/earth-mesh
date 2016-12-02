module.exports = function (out, p) {
  var lon = -p[0] / 180 * Math.PI
  var lat = p[1] / 180 * Math.PI
  out[0] = Math.cos(lon) * Math.cos(lat)
  out[1] = Math.sin(lat)
  out[2] = Math.sin(lon) * Math.cos(lat)
  return out
}
