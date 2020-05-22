import L from 'leaflet'
import 'stylus/coordinate.styl'
import { formatCoordinates } from '../../utils/gps'
import { throttle } from 'lodash'

L.Control.Coordinates = L.Control.extend({
    options: {
        position: 'bottomright' // 'topleft', 'topright', 'bottomleft'  'bottomright'
    },

    onAdd: function (map) {
        this._map = map
        this._container = L.DomUtil.create('div', 'leaflet-control-coordinates')
        var span = document.createElement('span')
        var center = formatCoordinates(this._map.getCenter())
        span.innerHTML = center.lat + '&nbsp;&nbsp;' + center.lng
        this._container.appendChild(span)

        L.DomEvent.on(this._map, 'mousemove', throttle(function (ev) {
            let coord = formatCoordinates(ev.latlng)
            span.innerHTML = coord.lat + '&nbsp;&nbsp;' + coord.lng
        }, 100))
        return this._container
    },

    onRemove: function (map) {
        L.DomEvent.off(this._container)
    }
})

L.Map.mergeOptions({
    mapCoordinatesControl: false
})
L.Map.include({
    addMapChange (map) {
        if (!this.mapChangeControl) {
            this.mapChangeControl = L.control.mapChange()
            this.addControl(this.mapChangeControl)
        }
    },
    removeMapChange () {
        if (this.mapChangeControl) {
            this.mapChangeControl.remove()
            delete this.mapChangeControl
        }
    }
})

L.Map.addInitHook(function () {
    if (this.options.mapCoordinatesControl) {
        this.mapCoordinatesControl = L.control.coordinates()
        this.addControl(this.mapCoordinatesControl)
    }
})

L.control.coordinates = function (options) {
    return new L.Control.Coordinates(options)
}
