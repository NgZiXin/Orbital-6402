// Extend the L.Polyline class to add a getDistance method
L.Polyline = L.Polyline.include({
  getDistance: function () {
    // distance in meters
    var mDistance = 0,
      length = this._latlngs.length;
    for (var i = 1; i < length; i++) {
      mDistance += this._latlngs[i].distanceTo(this._latlngs[i - 1]);
    }
    return mDistance;
  },
});
