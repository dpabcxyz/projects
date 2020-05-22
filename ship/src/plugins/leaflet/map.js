import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
import { ChartLayer } from './chartLayer'
const MAX_ZOOM = 18
const MIN_ZOOM = 2
const STATE_URL_NEW = '//www.google.cn/maps/vt?lyrs=s@804&gl=cn&x={x}&y={y}&z={z}'
const MAP_URL2 = '//www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0'
const COPYRIGHT = '© Loongship Tech Inc. Map©C-map'

let Map = L.Map.extend({
    options: {
        _lastUsedMapType: null
    }
})

Map.addInitHook(function () {
    let mapType = this.options.mapType
    this.setMapType(mapType)
})

Map.include({
    _getLastMapType () {
        // 获取上一次使用的地图类型
        return this.options._lastUsedMapType
    },
    _setLastMapType (mapType) {
        // 设置上一次使用的地图类型
        this.options._lastUsedMapType = mapType
    },
    hasChangeMapType (mapType) {
        // 判断是否切换地图类型
        return this.options._lastUsedMapType !== mapType
    },
    eachLayers () {
        return // todo
        var mapType = this.getMapType()
        var coodType = mapType === 'chart' ? 'normalLatlng' : 'transLatLng'

        this.eachLayer((layer) => {
            layer._latlng && layer.setLatLng(layer.options[coodType])
            layer._latlngs && layer.setLatLngs(layer.options[coodType])
        })
    },
    getMapType: function () {
        return this.mapType
    },
    setMapType: function (mapType) {
        if (!mapType) return
        this.fire('measureFire', {}, true)
        this.mapType = mapType

        // 防止重复加载相同类型地图
        if (this.options._lastUsedMapType === mapType) {
            return
        }

        if (this.options._lastUsedMapType === null) {
            this.options._lastUsedMapType = mapType
        }

        if (this.layer) {
            this.removeLayer(this.layer)
        }

        if (this.layer_overlay) {
            this.removeLayer(this.layer_overlay)
        }

        var center = this.getCenter()
        var zoom = this.getZoom()

        switch (mapType) {
        case 'chart':
            this._drawChatLayer()
            break
        case 'map':
            this._drawMapLayer()
            break
        case 'sat':
            this._drawSiteLayer()
            break
        }
        // this.setView(center,zoom,{animate: false})
        this._resetView(center, zoom, true)
        this.options._lastUsedMapType = mapType
        this.eachLayers()
    },
    /**
     *
     * 绘制海图
     * @memberof MapObject
     */
    _drawChatLayer: function () {
        let layer = ChartLayer('', {
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            continuousWorld: true,
            crs: L.CRS.EPSG3395,
            // attribution: COPYRIGHT,
            id: 'chart'
        })
        L.Util.setOptions(this, {
            crs: L.CRS.EPSG3395
        })
        this.layer = layer
        this.addLayer(this.layer)
    },

    /**
     *卫星图
     *
     * @memberof MapObject
     */
    _drawSiteLayer: function () {
        let layer = L.tileLayer(STATE_URL_NEW, {
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            continuousWorld: true,
            crs: L.CRS.EPSG3857,
            // attribution: COPYRIGHT,
            id: 'sate'
        })
        // 卫星图叠加公路信息
        var mapURL = `//www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i430134816!3m17!2szh-CN!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmapSatellite!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjMzfHMuZTpsfHAudjpvZmYscy50OjJ8cy5lOmx8cC52Om9mZg!4e0!23i1301875&key=AIzaSyDer5qPNgUIqnhrYiunMgKT81mFtO4q2oA`
        let overlay = L.tileLayer(mapURL, {
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            continuousWorld: true,
            crs: L.CRS.EPSG3857,
            id: 'sate2'
        })
        this.layer_overlay = overlay

        L.Util.setOptions(this, {
            crs: L.CRS.EPSG3857
        })
        this.layer = layer
        this.addLayer(this.layer)
        this.addLayer(this.layer_overlay)
    },
    /**
     *
     * 地图
     * @memberof MapObject
     */
    _drawMapLayer: function () {
        let layer = L.tileLayer(MAP_URL2, {
            subdomains: [0, 1, 2, 3],
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            continuousWorld: true,
            crs: L.CRS.EPSG3857,
            // attribution: COPYRIGHT,
            id: 'mapbox.streets'
        })
        L.Util.setOptions(this, {
            crs: L.CRS.EPSG3857
        })
        this.layer = layer
        this.addLayer(this.layer)
    },

    setCenter: function (lat, lng) {
        return this.setView(L.latLng(lat, lng))
    },

    mapbounds () {
        let southWest = L.latLng(-90, -720)
        let northEast = L.latLng(90, 720)
        let bounds = L.latLngBounds(southWest, northEast)
        this.setMaxBounds(bounds)
    }
})
export default Map
