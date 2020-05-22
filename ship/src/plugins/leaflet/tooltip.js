L.Tooltip.include({
    getPos: function () {
        return this._pos
    },
    getBound: function () {
        var container = this._container
        var width = container.offsetWidth
        var height = container.offsetHeight
        var pointLT = this.getPos()
        var pointRB = {
            x: pointLT.x + width,
            y: pointLT.y + height
        }
        var bound = L.bounds(pointLT, pointRB)
        return bound
    },
    _setPosition: function (pos) {
        var map = this._map
        var container = this._container
        var centerPoint = map.latLngToContainerPoint(map.getCenter())
        var tooltipPoint = map.layerPointToContainerPoint(pos)
        var direction = this.options.direction
        var tooltipWidth = container.offsetWidth
        var tooltipHeight = container.offsetHeight
        var offset = L.point(this.options.offset)
        var anchor = this._getAnchor()

        if (direction === 'top') {
            pos = pos.add(L.point(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true))
        } else if (direction === 'bottom') {
            pos = pos.subtract(L.point(tooltipWidth / 2 - offset.x, -offset.y, true))
        } else if (direction === 'center') {
            pos = pos.subtract(L.point(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true))
        } else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
            direction = 'right'
            pos = pos.add(L.point(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true))
        } else {
            direction = 'left'
            pos = pos.subtract(L.point(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true))
        }

        this._pos = pos

        L.DomUtil.removeClass(container, 'leaflet-tooltip-right')
        L.DomUtil.removeClass(container, 'leaflet-tooltip-left')
        L.DomUtil.removeClass(container, 'leaflet-tooltip-top')
        L.DomUtil.removeClass(container, 'leaflet-tooltip-bottom')
        L.DomUtil.addClass(container, 'leaflet-tooltip-' + direction)
        L.DomUtil.setPosition(container, pos)
    }
})
