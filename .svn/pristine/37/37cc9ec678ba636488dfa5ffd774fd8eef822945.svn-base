import L from 'leaflet'
import {
    bd09togcj02,
    gcj02tobd09,
    wgs84togcj02,
    gcj02towgs84
} from './correct'

function tmpArray (array, fn) {
    if (!array || !fn) return []
    return array.map(item => {
        if (Array.isArray(item)) {
            return tmpArray(item, fn)
        }
        if (item.lat) {
            return fn.call(this, item.lat, item.lng || item.lon)
        }

        if (Object.prototype.toString.call(item[0]) === '[object Number]') {
            return fn.call(this, item[0], item[1])
        }
    })
}

function setCoordlatlngs (that) {
    if (!that) return
    let latlngs
    const opts = that.options
    // 防止重复设置
    if (opts.coordinateType) return
    if (that._latlngs) {
        let latlngs = that._latlngs
        if (!opts.coordinateType || opts.coordinateType === 'WGS84') {
            opts.coordinateType = 'WGS84'
            opts.normalLatlng = [...latlngs]
            opts.transLatLng = tmpArray(latlngs, wgs84togcj02)
            return
        }

        if (opts.coordinateType === 'GCJ02') {
            opts.normalLatlng = tmpArray(latlngs, gcj02towgs84)
            opts.transLatLng = [...latlngs]
            return
        }

        if (opts.coordinateType === 'BD09') {
            const gcj02 = tmpArray(latlngs, bd09togcj02)
            opts.normalLatlng = tmpArray(gcj02, gcj02towgs84)
            opts.transLatLng = gcj02
        }
    } else if (that._latlng) {
        let { lat, lng } = that._latlng
        if (!opts.coordinateType || opts.coordinateType === 'WGS84') {
            opts.coordinateType = 'WGS84'
            opts.normalLatlng = L.latLng(lat, lng)
            opts.transLatLng = wgs84togcj02(lat, lng)
            return
        }

        if (opts.coordinateType === 'GCJ02') {
            const wgs84 = gcj02towgs84(lat, lng)
            opts.normalLatlng = wgs84
            opts.transLatLng = L.latLng(lat, lng)
            return
        }

        if (opts.coordinateType === 'BD09') {
            const gcj02 = bd09togcj02(lat, lng)
            opts.normalLatlng = gcj02towgs84(gcj02.lat, gcj02.lng)
            opts.transLatLng = gcj02
        }
    }
}

L.Map.include({
    addLayer: function (layer) {
        if (!layer._layerAdd) {
            throw new Error('The provided object is not a Layer.')
        }
        var id = L.Util.stamp(layer)
        if (this._layers[id]) { return this }
        setCoordlatlngs(layer)
        this._layers[id] = layer

        layer._mapToAdd = this

        if (layer.beforeAdd) {
            layer.beforeAdd(this)
        }

        this.whenReady(layer._layerAdd, layer)

        return this
    }
})

L.LayerGroup.include({
    addLayer: function (layer) {
        var id = this.getLayerId(layer)
        setCoordlatlngs(layer)
        this._layers[id] = layer

        if (this._map) {
            this._map.addLayer(layer)
        }

        return this
    }
})

L.Layer.include({
    _setCood: function (map) {
        let coodTtype = map.getMapType() == 'chart' ? 'normalLatlng' : 'transLatLng'
        this.setLatLngs && this.setLatLngs(this.options[coodTtype])
        this.setLatLng && this.setLatLng(this.options[coodTtype])
    },
    _layerAdd: function (e) {
        var map = e.target
        // check in case layer gets added and then removed before the map is ready
        if (!map.hasLayer(this)) { return }

        this._map = map
        this._zoomAnimated = map._zoomAnimated

        if (this.getEvents) {
            var events = this.getEvents()
            map.on(events, this)
            this.once('remove', function () {
                map.off(events, this)
            }, this)
        }

        if (map.getMapType) {
            this._setCood(map)
        }
        this.onAdd(map)

        if (this.getAttribution && map.attributionControl) {
            map.attributionControl.addAttribution(this.getAttribution())
        }

        this.fire('add')
        map.fire('layeradd', { layer: this })
    },
    addTo: function (map) {
        setCoordlatlngs(this)
        if (map.getMapType) {
            this._setCood(map)

            if (this._layers) {
                for (let key in this._layers) {
                    let item = this._layers[key]
                    item.setLatLngs && item.setLatLngs(item.options[coodTtype])
                    item.setLatLng && item.setLatLng(item.options[coodTtype])
                }
            }
        }
        map.addLayer(this)
        return this
    }
})
