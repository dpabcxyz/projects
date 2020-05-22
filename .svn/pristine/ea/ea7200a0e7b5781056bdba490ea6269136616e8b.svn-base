import L from 'leaflet'
import 'stylus/mapchage.styl'
import img1 from 'img/map1.jpg'
import img2 from 'img/map2.jpg'
import img3 from 'img/map3.jpg'

L.Control.MapChange = L.Control.extend({
    options: {
        position: 'bottomright' // 'topleft', 'topright', 'bottomleft'  'bottomright'
    },

    onAdd: function (map) {
        this._map = map
        var mapType = map.getMapType()
        this._container = L.DomUtil.create('div', 'leaflet-control-mapchange')
        var inner = this._renderContainer(mapType)
        this._container.appendChild(inner)
        L.DomEvent.on(this._container, 'dblclick', (ev) => {
            L.DomEvent.stopPropagation(ev)
        })

        L.DomEvent.on(this._container, 'mouseenter', function (ev) {
            L.DomEvent.stopPropagation(ev)
            var btn = L.DomUtil.get('mapchangebtn')
            L.DomUtil.removeClass(btn, 'min')
        })
        L.DomEvent.on(this._container, 'mouseleave', function (ev) {
            L.DomEvent.stopPropagation(ev)
            var btn = L.DomUtil.get('mapchangebtn')
            L.DomUtil.addClass(btn, 'min')
        })

        L.DomEvent.on(this._container, 'click', (ev) => {
            L.DomEvent.stopPropagation(ev)
            var node = this._nodeParent(ev.target, 'li')
            if (node) {
                var maptype = node.dataset.maptype
                if (this._map && this._map.getMapType() !== maptype) {
                    this._map.setMapType(maptype)
                    this._removeClassName(node, 'current')
                    node.className = 'current'
                }
            }
        })

        return this._container
    },
    _removeClassName (node, className) {
        if (node === undefined || className === undefined) return
        var childs = node.parentNode.childNodes
        for (let i = 0; i < childs.length; i++) {
            const element = childs[i]
            if (element.nodeName !== 'LI' || element === node) continue
            if ('current'.indexOf(element.className) > -1) {
                element.className = ''
            }
        }
    },
    _nodeParent (node, nodeType, max) {
        if (node === undefined || nodeType === undefined) return
        nodeType = nodeType.toUpperCase()
        if (node.nodeName.indexOf(nodeType) > -1) {
            return node
        }
        if ('leaflet-control-mapchange'.indexOf(node.className) > -1) {
            return false
        }
        return this._nodeParent(node.parentNode, nodeType, max)
    },
    _renderContainer (mapType = 'map') {
        var mapMember = {
            chart: {
                img: img1,
                text: '海图'
            },
            map: {
                img: img2,
                text: '地图'
            },
            sat: {
                img: img3,
                text: '卫星图'
            }
        }
        var dom = L.DomUtil.create('div', 'slider-map-bar min')
        dom.id = 'mapchangebtn'
        var ul = L.DomUtil.create('ul')
        ul.id = 'maptype-list'

        for (const key in mapMember) {
            if (mapMember.hasOwnProperty(key)) {
                const element = mapMember[key]
                let li = L.DomUtil.create('li')
                let img = L.DomUtil.create('img', 'mapItem')
                let span = L.DomUtil.create('span', 'mapText')
                li.dataset.maptype = key
                if (key === mapType) {
                    li.className = 'current'
                }

                img.src = element.img
                span.innerHTML = element.text
                li.appendChild(img)
                li.appendChild(span)
                ul.appendChild(li)
            }
        }
        dom.appendChild(ul)
        return dom
    },

    onRemove: function (map) {
        L.DomEvent.off(this._container)
        console.log('onremove')
    }
})

L.Map.mergeOptions({
    mapChangeControl: false
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
    if (this.options.mapChangeControl) {
        this.mapChangeControl = L.control.mapChange()
        this.addControl(this.mapChangeControl)
    }
})

L.control.mapChange = function (options) {
    return new L.Control.MapChange(options)
}
