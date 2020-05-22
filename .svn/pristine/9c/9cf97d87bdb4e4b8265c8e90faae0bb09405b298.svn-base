<template lang='pug'>
transition(name="fade")
    .shipSearch#shipSearch(ref='shipSearch')
        .search-area
            .left(ref='retracting')
                .shipIcon(@click="toggleWindowExclude('fleet')" :class="{active: displayWindowFleet}")
                    svgIcon(name="ship")
                .input
                    Input(:class='["searchinput" , searchKey.length>0 ? "light" : ""]' v-model.trim.lazy="searchKey" placeholder="输入船名、ID" @on-keyup.enter="search" @on-change="searchAction" @on-focus="search")
                .searchIcon()
                    template(v-if="searchKey.length==0")
                        svgIcon(name="search" @click="search")
                    template(v-else)
                        svgIcon(name="delete" @click.native="clearSearch")
            .retractingIcon(@click="retracting")
                span
                    svgIcon(name="retract" :class='[transition ? "" : "transition"]')
        .fixedView
            transition
                keep-alive
                    SearchResult(
                        :type='cmpType'
                        @close='closeWindow("search")'
                        :searchList = "searchList"
                        v-if='displayWindowSearch'
                        @showViewWindow = 'showViewWindow'
                    )
                    Fleet(v-if='displayWindowFleet')
                    ShipInfoView(v-if='displayWindowInfo' :mmsi="showShipInfoViewMMSI" v-drag)
</template>

<script>
import { throttle } from 'lodash'
import SearchResult from './shipsearchResult'
import ShipInfoView from './shipInfoView'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Api from 'api/api'
import Fleet from './fleet/fleet'

export default {
    name: 'Search',
    data () {
        return {
            searchKey: '',
            transition: true,
            showSearchResultBox: false,
            type: 'search',
            searchList: [],
            // 需要在详情中显示的船舶mmsi
            mmsi: ''
            // 显示船队窗口
            // showShipFleetView: false

        }
    },
    computed: {
        ...mapGetters('user', ['userId']),
        ...mapGetters('shipView', ['showShipInfoView', 'showShipInfoViewMMSI']),
        ...mapGetters(['displayWindowFleet', 'displayWindowInfo', 'displayWindowSearch']),

        cmpType () {
            var type = this.searchKey.length ? 'search' : 'search'
            return type
        }
    },
    methods: {
        // ...mapActions('shipView', ['openShipInfoView', 'closeShipInfoView']),
        ...mapMutations(['openWindow', 'closeWindowAll', 'openWindowExclude', 'closeWindow', 'toggleWindow', 'toggleWindowExclude']),
        showViewWindow (mmsi) {
            this.mmsi = mmsi
            this.openWindowExclude('info')
        },
        showShipHistory () {
            this.type = 'history'
            this.openWindowExclude('search')
        },
        getShipInfo (mmsi) {
            var params = {
                mmsi,
                userId: this.userId
            }
            this.$restFull({
                method: 'GET',
                url: Api.queryShipInfo,
                data: params
            }).then((res) => {
                console.log(res)
            })
        },
        changeSearchListType (type) {
            this.type = type
            this.openWindowExclude('search')
        },
        clearSearch () {
            this.searchKey = ''
            this.showSearchResultBox = false
        },
        search () {
            if (!this.searchKey) {
                this.closeWindow('search')
                return
            }
            this.openWindowExclude('search')
            var params = {
                userId: this.userId,
                likename: this.searchKey
            }
            this.$restFull({
                method: 'post',
                url: Api.searchShip,
                data: params
            }).then((res) => {
                this.searchList = res
            }).catch((res) => {
                this.searchList = []
            })
        },
        searchAction: throttle(function () {
            this.search()
        }, 500),
        retracting () {
            if (this.transition) {
                let left = this.$refs.retracting
                let width
                if (left) {
                    width = left.offsetWidth
                    this.$refs.shipSearch.style.left = -width + 'px'
                }
            } else {
                this.$refs.shipSearch.style.left = 0
            }
            this.transition = !this.transition
            this.closeWindow('fleet')
            this.closeWindow('search')
        }
    },
    components: {
        SearchResult,
        ShipInfoView,
        Fleet
    }
}
</script>

<style lang='stylus'>
    @import '../stylus/components/shisearch.styl';
</style>
