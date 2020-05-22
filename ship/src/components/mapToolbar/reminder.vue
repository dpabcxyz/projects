<template lang="pug">
    .map-ship-reminder(v-if='displayReminder' )
        .reminder_nomsg(v-if="!messageList.length") 暂无预警信息
        .reminder_msg(v-else)
            .loading_reminder(v-if="getHistoryLoading")
                Icon(type="ios-loading")
            ScrollBar(ref="searchScroll" style="max-height: 400px")
                ul
                    li.showshipinfo(
                        :class="{active:currentItem == index}"
                        v-for='(item,index) in messageList'
                        @click="getAreaData(index)"
                        :data-mmsi='item.mmsi'
                        :data-ship-name='item.shipName'
                        :data-area-id='item.areaId'
                        :data-type='item.type'
                        :data-area-name='item.areaName'
                        :key="item.id"
                    )
                        .msg_type
                            span(:title="`类型：船舶${item.type} ${item.groupName}区域`" ) 类型：船舶{{item.type}}{{item.groupName}}区域
                            span {{item.sendTime | formatTime}}
                        .msg_shipname 船舶：{{item.shipName}} ({{item.mmsi}})
                        .msg_content
                            span 内容：
                            .msg 请注意，船舶已{{item.type}}{{item.typeName}}-{{item.areaName}}区域

            .addMore(@click="getHistory('addMore')" v-if="showAddMore")
                Icon(v-if='addmoreLoading' type="ios-loading" size=18 class="demo-spin-icon-load")
                |加载更多
</template>

<script>
import Api from 'api/api'
import Bus from 'plugins/eventBus'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { reversLatLngs } from 'utils/utils'
import webSocket from 'components/websocket'

export default {
    name: 'Reminder',
    computed: {
        ...mapGetters('user', ['userId']),
        ...mapGetters(['language'])
    },
    mounted () {
        webSocket.getInstance().inputCallback('3', (data) => {
            console.log(data)
            this.parseSocketData(data)
        })
        // this.getHistory()
        Bus.$on('toggelReminder', () => {
            this.displayReminder = !this.displayReminder
        })
    },
    data () {
        return {
            displayReminder: false,
            messageList: [],
            getHistoryLoading: false,
            lastMsgId: '',
            currentItem: '',
            addmoreLoading: false,
            showAddMore: false
        }
    },
    watch: {
        displayReminder: function (val, oldVal) {
            if (val) {
                this.getHistory()
                document.querySelector("[toolItem = 'reminder']")
                this.clearNewMsg()
            } else {
                this.clearReminderLayer()
                // this.clearNewMsg()
            }
            this.toggleIconLigh()
        }
    },
    methods: {
        ...mapActions('map', ['addReminderLayer', 'clearReminderLayer']),
        toggleIconLigh () {
            var reminder = document.querySelector("[toolItem = 'reminder']")
            if (reminder) {
                reminder.classList.toggle('active')
            }
        },
        openReminder () {
            this.displayReminder = true
        },
        closeReminder () {
            this.displayReminder = false
        },
        newMsg () {
            console.log('你有新消息')
            var reminder = document.querySelector("[toolItem = 'reminder']")
            if (reminder) {
                reminder.classList.toggle('heartBeat')
            }
        },
        clearNewMsg () {
            var reminder = document.querySelector("[toolItem = 'reminder']")
            if (reminder) {
                reminder.classList.remove('heartBeat')
            }
        },
        parseSocketData (data) {
            if (!this.displayReminder) {
                this.newMsg()
                return
            }
            var { content } = data
            content = this.processData(content)

            this.messageList.unshift(content)
        },
        processData (item) {
            var data = item.split('~')
            var [mmsi, type, areaId, sendTime, shipName, groupName, typeName, areaName] = data
            type = this._getAreaType(type)
            return { mmsi, type, areaId, sendTime, shipName, groupName, typeName, areaName }
        },
        getHistory (type) {
            var params = {
                method: 'GET',
                url: Api.reminderHistory,
                params: {
                    userId: this.userId,
                    channel: 10,
                    language: 'zh',
                    pageSize: 5
                }
            }
            if (type === 'addMore') {
                params.params.msgId = this.lastMsgId
                this.addmoreLoading = true
            } else {
                this.getHistoryLoading = true
            }
            this.$restFull(params).then((res) => {
                if (!res.length) {
                    this.addmoreLoading = false
                    return
                }
                if (res.length < 5) {
                    this.showAddMore = false
                } else {
                    this.showAddMore = true
                }

                var list = []
                list = res.map((item) => {
                    let content = this.processData(item.content)
                    item = { ...item, ...content }
                    return item
                })

                if (type === 'addMore') {
                    // this.messageList = this.messageList.concat(list)
                    list.forEach((item) => {
                        this.messageList.push(item)
                    })
                    this.addmoreLoading = false
                } else {
                    this.messageList = list
                    this.getHistoryLoading = false
                }
                this.lastMsgId = list[list.length - 1] && list[list.length - 1].msgId
            }).catch((err) => {
                console.log(err)
                this.getHistoryLoading = false
                this.addmoreLoading = false
                this.messageList = []
            })
        },
        getAreaData (index) {
            if (!this.messageList[index]) return
            let data = this.messageList[index]
            let { areaId, mmsi } = data
            let params = {
                type: 'POST',
                url: Api.getUserArea,
                params: {
                    userId: this.userId,
                    areaId
                }
            }

            this.$restFull(params).then((res) => {
                this.currentItem = index
                var geoJSON = res[0].geometry
                var style = res[0].areaRule
                if (!geoJSON) return
                geoJSON = JSON.parse(geoJSON)
                var weight = 1.4
                var { areaColor: fillColor = 'red', areaOpacity: fillOpacity = 1, borderColor: color = '#3388ff' } = style
                fillOpacity = fillOpacity ? fillOpacity.replace('%', '') / 100 : '0.5'
                let geoLayer = L.geoJSON(geoJSON, {
                    style: function (feature) {
                        return {
                            color,
                            weight,
                            fillOpacity,
                            fill: true
                        }
                    }
                })
                geoLayer.areaId = areaId
                geoLayer.mmsi = mmsi
                var latLngs = reversLatLngs(geoJSON.coordinates)
                geoLayer.latLngs = latLngs
                this.addReminderLayer(geoLayer)
            })
        },
        _getAreaType (type) {
            var tmp = null
            // ( type   1：进入区域；2：区域启动；3：驶出区域；4：区域停泊)
            switch (type * 1) {
            case 1:
                tmp = '驶入'
                break
            case 2:
                tmp = '区域启动'
                break
            case 3:
                tmp = '驶出'
                break

            case 4:
                tmp = '区域停泊'
                break
            default:
                break
            }

            return tmp
        }
    }

}
</script>
<style lang='stylus'>
    @import '../../stylus/components/mapToolbar/reminder.styl';
</style>
