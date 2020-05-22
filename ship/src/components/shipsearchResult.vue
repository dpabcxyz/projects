<template lang='pug'>
    transition(name="fade")
        .searchResult
            .topbar
                span 船舶
                span(v-if="inSearch") 共
                    i {{this.searchList.length}}
                    |条
                span(@click="close")
                    svgIcon(name="close")
            .searchlist
                ScrollBar(ref="searchScroll")
                    ul
                        template(v-if="type === 'history'")
                            template(v-if="shipClickHistory.length === 0")
                                li.noData 没有历史数据
                            template(v-else)
                                li(v-for="i in shipClickHistory" @click="showViewWindow(i)") {{i.name}} ({{i.mmsi}})

                        template(v-else-if="type === 'search'")
                            template(v-if="searchList.length === 0")
                                li.noData 没有搜索结果
                            template(v-else)
                                    li(v-for="i in searchList" @click="showViewWindow(i)") {{i.name}} ({{i.mmsi}})
                    .footerbar(v-if="inHistory && shipClickHistory.length>0")
                        span(@click="clearHistory") 清空搜索历史

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
var LOCAL_HISTORY_KEY = 'shipClickHistory'
export default {
    name: 'SearchResult',
    data () {
        return {
            shipClickHistory: []
        }
    },
    computed: {
        inHistory () {
            return this.type === 'history'
        },
        inSearch () {
            return this.type === 'search'
        }
    },
    props: {
        type: {
            type: String,
            default: 'history'
        },
        searchList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    mounted () {
        if (this.type === 'history') {
            this.getHistory()
        }
    },
    watch: {
        type: 'changeType'
    },
    methods: {
        ...mapActions('shipView', ['openShipInfoView']),
        close () {
            this.$emit('close')
        },
        _forIn (mmsi) {
            let len = this.shipClickHistory.length
            for (var i = 0; i < len; i++) {
                if (this.shipClickHistory[i].mmsi === mmsi) {
                    return true
                }
            }

            return false
        },
        showViewWindow (row) {
            var inItem = this._forIn(row.mmsi)
            if (!inItem) {
                this.shipClickHistory.push(row)
                this.saveHistory()
            }

            this.openShipInfoView(row.mmsi)
            // this.$emit('showViewWindow', row.mmsi)
        },
        changeType (val, oldVal) {
            if (val === 'history') {
                this.getHistory()
            } else {
                this.getSearchData()
            }
            this.$refs.searchScroll.update()
        },
        getSearchData () {
            console.log('请求接口')
        },
        clearHistory () {
            this.shipClickHistory = []
            this.saveHistory()
            this.$emit('close')
        },
        saveHistory () {
            this.$storage.set(LOCAL_HISTORY_KEY, this.shipClickHistory)
        },
        getHistory () {
            var list = this.$storage.get(LOCAL_HISTORY_KEY)
            if (list) {
                this.shipClickHistory = list
            }
        }
    }
}
</script>

<style lang='stylus'>
    @import '../stylus/components/shiSearchResult.styl';
</style>
