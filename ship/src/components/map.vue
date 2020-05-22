<template lang='pug'>
    .map
        #map
        Shipsearch
        MapToolbar
        helpMessageComponent
        copyright(class="mapcopy")
        Loading(v-if='loading')

</template>

<script>
/* 首页右侧救援消息组件 */
import helpMessageComponent from '../components/helpMessageComponent.vue'
import copyright from './copyRight'
import Loading from './loading'
import L from '../plugins/leaflet/leaflet.js'
// import '../plugins/leaflet/offset.js'    // todo
import Shipsearch from 'components/shipSearch.vue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import MapToolbar from 'components/mapToolbar/mapToolbar'

/* websocket */
import webSocket from '../components/websocket'
window.L = L
const COPYRIGHT = '© Loongship Tech Inc. Map©C-map'

export default {
    name: 'mapView',
    computed: {
        ...mapGetters(['loading'])
    },
    data () {
        return {}
    },
    components: {
        copyright,
        Shipsearch,
        MapToolbar,
        helpMessageComponent,
        Loading
    },
    created () {
        this.closeShipInfoView()
    },
    mounted () {
        /* 初始化 ws */
        let wsConfig = {
            userId: this.userId('user'),
            language: this.language('language')
        }
        webSocket.getInstance().init(wsConfig)

        this.map = L.map('map', {
            center: [18.6462504963, 109.5556643139],
            zoom: 7,
            mapType: 'map',
            mapCoordinatesControl: true,
            mapChangeControl: true,
            zoomControl: false
        })
        this.map.mapbounds()

        this.map.attributionControl.setPrefix('')
        this.map.attributionControl.setPosition('bottomleft')
        this.map.attributionControl.addAttribution(COPYRIGHT)

        L.control.scale().addTo(this.map)

        L.control.zoom({ position: 'bottomright' }).addTo(this.map)

        window.map = this.map
        this.setMapView(this.map)
        this.map.on('zoomend', () => {
            this.zoomEnd()
        })
        this.getFleetList()
    },
    methods: {
        ...mapGetters('user', ['userId']),
        ...mapGetters(['language']),
        ...mapActions('shipView', ['closeShipInfoView']),
        ...mapMutations('map', ['setMapView', 'addShipLayer', 'addLighLayer', 'removeAllLigh']),
        ...mapActions('fleet', ['getFleetList']),
        ...mapActions('map', ['zoomEnd']),
        ...mapActions(['toggleLoading'])
    }

}
</script>

<style lang='stylus'>
    @import '../stylus/components/map.styl';
</style>
