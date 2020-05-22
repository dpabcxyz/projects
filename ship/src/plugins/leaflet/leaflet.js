import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Map from './map'
import './gpsCoord'
import './mapchange'
import '../../utils/rotatedmarker'
import './tooltip'
// L.map = new map(id, options)
L.map = (id, options) => {
    return new Map(id, options)
}

export default L
