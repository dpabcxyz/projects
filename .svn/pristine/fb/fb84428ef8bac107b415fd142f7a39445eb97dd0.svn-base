<template lang="pug">
    transition(name="fade")
        .shipInfoView(
            v-if='Object.keys( shipInfo ).length'
        )
            .topbar
                span {{ shipMessage.name }}&#12288;({{ shipMessage.mmsi }}）
                span(
                    class="closeInfo"
                    @click="closeShipInfo(shipMessage.mmsi)"
                )
                    svgIcon(name="close")
            .shipInfo
                ul
                    li
                        span 状态：
                        span {{ shipMessage.ship_status | shipStatus }}
                    li
                        span 航速(kn)：
                        span {{ shipMessage.speed }}
                    li
                        span 航迹向：
                        span {{ shipMessage.course ? shipMessage.course : '0'}}°
                    li
                        span 经度：
                        span {{ shipMessage.lon | formatLng }}
                    li
                        span 纬度：
                        span {{ shipMessage.lat  | formatLat}}
                    li
                        span 更新：
                        span
                            template(v-if='shipMessage.pos_time')
                                | {{formatTime( shipMessage.pos_time ) }} （{{  parseInt( Date.now() / 1000 )- shipMessage.pos_time | dayOfdate }}）
                    li
                        span 船舶所有人：
                        span {{ shipOwnerInfo.ownerName }}
                    li
                        span 联系电话：
                        span {{ shipOwnerInfo.ownerMobile }}
                div(class="shipInfoBtn"  placement="top")
                    div(@click="showShipDetail") 船舶详情
            .hl(v-show="showShipHelpView")
                .left
                    .title 附近渔船协助搜救
                    div.input_box · 附近
                        <input class="input" @keyup="hlChange($event)" :value="helpHl"/> 海里共{{helpShipConst}}条渔船
                    div(@click="sendHelpMeeee" :style="{'color': (helpShipConst==0 ? '#7a8ca5':'#fff')}") · 群发紧急救援通知
                .right
                    div(@click="showShipList" :style="{'color': (helpShipConst==0 ? '#2b70b1':'#48a6f8')}") 船舶列表
            .shipVoyage
                .voyageBar
                    span 航行轨迹
                    span(class='shipVoyageBtn')
                        i(
                            @click="getVoyageData"
                        ) 确认
                        i &#12288;
                        i(@click="closeVoyage") 取消
                .voyageTime
                    .pickerTime
                        DatePicker(
                            type="datetime"
                            placeholder="选择开始时间"
                            format='yyyy-MM-dd HH:mm:ss'
                            class="pickerSelect"
                            v-model="startTime"
                            :clearable='false'
                            :editable="false"
                            @on-change="startChange"
                            :options='optionsStart'

                        )
                        span.line
                        DatePicker(
                            type="datetime"
                            placeholder="选择结束时间"
                            format='yyyy-MM-dd HH:mm:ss'
                            class="pickerSelect"
                            v-model="endTime"
                            :clearable='false'
                            :editable=false
                            :options='optionsEnd'
                            @on-change="endChange"
                        )

</template>

<script>
import Api from 'api/api'
import { formatCoordinates } from '../utils/gps'
import { mapGetters, mapActions } from 'vuex'
import shipImg from '@/assets/unshipfleetdrive1.png'
import shipStop from '@/assets/notfleetrstop_icon.png'
import shipSelect from '@/assets/ship_select.png'
import day from 'dayjs'
import { formatLat, formatLng } from 'utils/gps'
var popup = L.popup({ className: 'voyagepopup' })

function onMapClick (e, map) {
    if (e.target && e.target.options && map) {
        let { mmsi, shipname, speed, course, pos_time, lat, lon } = e.target.options
        pos_time = day(pos_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        lon = formatLng(lon * 600000)
        lat = formatLat(lat * 600000)
        let html = `
            ${shipname ? '<p>船舶名称: ' + shipname + '</p>' : ''}
            ${mmsi ? '<p>MMSI: ' + mmsi + '</p>' : ''}
            ${lon ? '<p>经度: ' + lon + '</p>' : ''}
            ${lat ? '<p>纬度: ' + lat + '</p>' : ''}
            ${speed ? '<p>航速: ' + speed + '</p>' : ''}
            ${course ? '<p>航迹向: ' + course + '°</p>' : ''}
            ${pos_time ? '<p>更新时间: ' + pos_time + '</p>' : ''}
        `
        popup
            .setLatLng(e.latlng)
            .setContent(html)
            .openOn(map)
    }
}

export default {
    name: 'shipInfoView',
    computed: {
        ...mapGetters(['language']),
        ...mapGetters('user', ['userId']),
        ...mapGetters('shipView', ['shipInfo', 'showShipHelpView', 'helpHl', 'helpShipConst']),
        ...mapGetters('shipView', ['shipInfo', 'sos']),

        shipMessage () {
            return this.shipInfo.shipMessage
        },
        shipOwnerInfo () {
            return this.shipInfo.shipOwnerInfo
        },
        voyageParams () {
            return {
                userId: this.userId,
                mmsi: this.mmsi,
                departTime: Math.floor(new Date(this.startTime) / 1000),
                arrivedTime: Math.floor(new Date(this.endTime) / 1000)
            }
        }
    },
    props: ['mmsi'],
    mounted () {
        // this.getShipAis(this.mmsi)
    },
    watch: {
        mmsi: function (val, oldVal) {
            val && this.getShipAis(val)
        }

    },
    data () {
        return {
            startTime: this.$day().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.$day().format('YYYY-MM-DD HH:mm:ss'),
            optionsEnd: {},
            optionsStart: {},
            // shipInfo: {},
            voyageData: {},
            latlngs: [],
            selectShipMarker: L.featureGroup(),
            shipvoyageLineMarker: '', // 轨迹线marker
            shipVoyageCirMarker: '', // 轨迹转向点marker

            timer: null // 函数防抖
        }
    },
    beforeDestroy () {
        this.selectShipMarker.eachLayer(layer => {
            map.removeLayer(layer)
        })
    },
    filters: {
        'dayOfdate' (anchorTime) {
            if (!anchorTime) return ''
            var strFormat = ''
            var byTime = [
                365 * 24 * 60 * 60 * 1000,
                24 * 60 * 60 * 1000,
                60 * 60 * 1000,
                60 * 1000,
                1000
            ]
            var unit = ['年', '天', '小时', '分钟', '秒']
            var difftime = Math.abs(anchorTime * 1000)
            strFormat = difftime / 3600
            if (difftime < 0) {
                return ''
            }
            var sb = []
            for (var i = 0; i < byTime.length; i++) {
                if (difftime < byTime[i]) {
                    continue
                }
                var temp = Math.floor(difftime / byTime[i])
                difftime = difftime % byTime[i]
                if (temp > 0) {
                    sb.push(temp + unit[i])
                }
                if (sb.length >= 2) {
                    break
                }
            }
            strFormat = sb.toString().replace(',', '')
            return strFormat
        }
    },
    methods: {

        ...mapActions('shipView', ['closeShipInfoView', 'getShipAis', 'helpHlChange']),
        ...mapActions('helpMessageComponent', ['showShipListViewChange', 'emergencyHelpMeeeeeChange']),

        sendHelpMeeee () {
            if (this.helpShipConst == 0) {
                return
            }
            this.emergencyHelpMeeeeeChange(true)
        },
        showShipList () {
            if (this.helpShipConst == 0) {
                return
            }
            this.showShipListViewChange(true)
        },
        hlChange (event) {
            /* 计时器用于防抖 */
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.helpHlChange(event.target.value)
            }, 1000)
        },
        showShipDetail () {
            this.$router.push({ name: 'shipInfo', params: { shipId: this.mmsi } })
        },
        closeVoyage () {
            if (map.hasLayer(this.voyagecircle)) {
                map.removeLayer(this.voyagecircle)
            }

            if (map.hasLayer(this.voyageLine)) {
                map.removeLayer(this.voyageLine)
            }
            // map.removeLayer(this.voyageLine)
        },
        // ...mapActions('map', ['getVoyageData']),
        startChange (date) {
            this.optionsEnd['disabledDate'] = (time) => {
                return new Date(time).getTime() < this.startTime.getTime()
            }
        },
        endChange (date) {
            this.optionsStart['disabledDate'] = (time) => {
                return new Date(time).getTime() > this.endTime.getTime()
            }
        },

        /**
         * 关闭关于船舶一切
         */
        closeShipInfo (mmsi) {
            this.clearShip()
            this.closeShipInfoView(mmsi)
        },

        /**
         * 获取轨迹数据
         */
        getVoyageData () {
            if (this.getTraceAciton) {
                return
            }
            this.clearShip()
            let params = {
                arrivedTime: parseInt(this.endTime.valueOf() / 1000),
                userId: this.userId,
                departTime: parseInt(this.startTime.valueOf() / 1000),
                mmsi: this.mmsi
            }
            this.getTraceAciton = true
            this.$restFull({
                method: 'POST',
                url: Api.selectSingleVoyage,
                data: params
            }).then((res) => {
                // dosomthing
                this.latlngs = []
                if (Object.keys(res).length > 0) {
                    this.voyageData = res
                    this.drawVoyage()
                } else {
                    this.$Message.warning('暂无轨迹数据')
                }
                this.getTraceAciton = false
            }).catch((error) => {
                this.getTraceAciton = false

                console.log(error)
            })
        },
        /**
         * 船舶定位
         */
        shipPosition (ais) {
            let head = this.getHeading(ais.shipMessage.heading, ais.shipMessage.course, ais.shipMessage.speed)
            let latlngs = L.latLng(ais.shipMessage.latitude / 600000, ais.shipMessage.longitude / 600000)
            var shipIcon = L.icon({
                iconUrl: ais.shipMessage.ship_status == 1 ? shipImg : shipStop,
                className: 'shipIcon',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
            var shipMarker = L.marker(latlngs, {
                icon: shipIcon,
                rotationAngle: head

            })
            shipMarker.head = head
            shipMarker.unbindTooltip().bindTooltip(ais.shipMessage.shipname, {
                className: `shiptips tips${ais.shipMessage.mmsi}`,
                permanent: true,
                direction: 'right'
            })
            /**
             * 更改角度
             */
            shipMarker.setRotationAngle(head)
            shipMarker.on('click', () => {
                this.selectShip(ais.shipMessage.mmsi, latlngs, head)
            })

            map.setView(latlngs)
            shipMarker.addTo(map)
        },

        /**
         * 获取船舶信息
         */
        getShipInfo () {
            let params = {
                userId: this.userId,
                mmsi: this.mmsi
            }
            this.$restFull({
                method: 'POST',
                url: Api.queryShipDetails,
                data: params
            }).then((res) => {
                if (res.shipMessage) {
                    if (res.shipMessage.latitude && res.shipMessage.latitude) {
                        res.shipMessage.latlngs = formatCoordinates([ res.shipMessage.latitude / 600000, res.shipMessage.longitude / 600000 ])
                    } else {
                        res.shipMessage.latlngs = res.shipMessage.latlngs ? res.shipMessage.latlngs : 0
                        res.shipMessage.longitude = res.shipMessage.longitude ? res.shipMessage.longitude : 0
                    }
                }
                this.shipInfo = res
                this.shipPosition(res)
            })
        },

        /**
         * 船首向计算
         * @param {heading} hd
         * @param {course} co
         * @param {speed} sp
         */
        getHeading (hd, co, sp) {
            var sphead
            if (hd > 0 && hd < 360) {
                if (sp >= 3 && this.degreeAbs(hd - co) >= 15) {
                    if (co >= 0 && co < 360) {
                        sphead = Math.round(co)
                    } else {
                        sphead = Math.round(hd)
                    }
                } else {
                    sphead = Math.round(hd)
                }
            } else {
                if (co >= 0 && co < 360) {
                    sphead = Math.round(co)
                }
            }
            return sphead
        },
        /**
         * para
         */
        degreeAbs  (para) {
            var result
            var paraAbs = Math.abs(para)
            if (paraAbs > 180) {
                result = 360 - paraAbs
            } else {
                result = paraAbs
            }
            return result
        },

        drawVoyage () {
            for (var i = 0; i < this.voyageData.data.length; i++) {
                // 偏移操作
                let lnglatsTransData = L.latLng(this.voyageData.data[i].lat / 600000, this.voyageData.data[i].lon / 600000)
                this.voyageData.data[i].lat = lnglatsTransData.lat
                this.voyageData.data[i].lon = lnglatsTransData.lng
                this.latlngs.push(lnglatsTransData)
            }
            let datas = this.dealVoyageData(this.voyageData.data, this.shipInfo.shipMessage.postime)

            this.drawLine()
            this.drawCircle(datas)
            this.collision(this.shipVoyageCirMarker)
        },
        drawLine () {
            var shipvoyageLine = L.polyline(this.latlngs, {
                stroke: !0,
                weight: 2,
                color: '#0073f5',
                opacity: 1
            })
            let group = L.featureGroup()
            this.voyageLine = group
            group.addLayer(shipvoyageLine)
            this.shipvoyageLineMarker = shipvoyageLine
            group.addTo(map)
        },
        /**
         *
         * @param {转向点集合 Array} data
         */
        drawCircle (data) {
            // 计算视野内的点
            data = this.countViewDot(data)
            var dataArry = this.pointDataSparing(data, 'lat', 'lon')
            let circleGrounp = L.featureGroup()
            this.voyagecircle = circleGrounp
            for (let i = 0; i < dataArry.length; i++) {
                var voyageData = dataArry[i]
                let colorvalue = this.circleColor(dataArry[i].speed)
                let lnglat = L.latLng(dataArry[i].lat, dataArry[i].lon)
                let { mmsi = '', shipname = '', speed = '', course = '', pos_time = '', lat = '', lon = '' } = voyageData
                var crilMarker = L.circleMarker(lnglat, {
                    stroke: !0,
                    color: colorvalue,
                    weight: 1,
                    opacity: 1,
                    fillColor: colorvalue,
                    fillOpacity: 1,
                    fill: !0,
                    mmsi,
                    shipname,
                    speed,
                    course,
                    pos_time,
                    lat,
                    lon
                }).setRadius(3)
                crilMarker.unbindTooltip().bindTooltip(`${this.formatTime(dataArry[i].pos_time)}`, {
                    direction: i % 2 ? 'left' : 'right',
                    className: 'crilMarker',
                    permanent: true
                    // offset: [10, 10]
                }).on('click', (e) => {
                    // this.component.$store.state.shipRouterDetailShow = dataArry[i]
                    console.log(e)
                    onMapClick(e, map)
                })
                circleGrounp.addLayer(crilMarker)
            }
            circleGrounp.addTo(map)
            this.shipVoyageCirMarker = circleGrounp
            map.fitBounds(circleGrounp.getBounds())
        },

        /**
         * [pointDataSparing 轨迹点抽稀公共方法，抽稀距离为50像素]
         * dataArray:待抽稀数据，latfiled：纬度值字段名称，lngfiled：经度值字段名称
         * @return {[type]} [description]
         */
        pointDataSparing (dataArray, latfiled, lngfiled) {
            var resultData = []
            try {
                if (dataArray && dataArray.length > 2) {
                    var lastlatlng = null
                    lastlatlng = new L.LatLng(dataArray[0][latfiled], dataArray[0][lngfiled])
                    var pt = map.latLngToLayerPoint(lastlatlng)
                    resultData.push(dataArray[0])
                    var len = dataArray.length
                    for (var i = 1; i < len - 1; i++) {
                        var newlatlng = new L.LatLng(dataArray[i][latfiled], dataArray[i][lngfiled])
                        var newpt = map.latLngToLayerPoint(newlatlng)
                        if (newpt.distanceTo(pt) > _TYPHOON_MIN_POINT_DISTANCE) {
                            resultData.push(dataArray[i])
                            lastlatlng = newlatlng
                            pt = newpt
                        }
                    }
                    /** 最后一个点需要存储到数组中**/
                    resultData.push(dataArray[len - 1])
                } else {
                    resultData = dataArray
                }
            } catch (e) {
                resultData = dataArray
            }
            return resultData
        },

        /**
         *
         * @param {经纬度集合} data
         */
        countViewDot (data) {
            // 获取视野经纬度
            let boundsView = map.getBounds()
            let dataArry = []
            for (var i = 0; i < data.length; i++) {
                if (i == 0 || i == data.length - 1) {
                    dataArry.push(data[i])
                    continue
                }
                let lat = data[i].lat
                let lon = data[i].lon
                let latlng = new L.LatLng(lat, lon)
                if (boundsView.contains(latlng)) {
                    dataArry.push(data[i])
                }
            }
            return dataArry
        },

        /**
         *
         * @param {转向点 颜色 speed}}} shipSpeed
         */
        circleColor (shipSpeed) {
            var colorvalue = '#bb0000'
            if (shipSpeed != null && shipSpeed != '') {
                shipSpeed = parseFloat(shipSpeed)
                if (shipSpeed > 10) {
                    colorvalue = '#17bf00'
                } else if (shipSpeed > 5) {
                    colorvalue = '#ff9f19'
                } else if (shipSpeed > 1) {
                    colorvalue = '#f23030'
                }
            }
            return colorvalue
        },

        /**
         * [dealVoyageData 删除超过当前船位的数据，用户没有权限时候]
         * @param  {[type]} data    [description]
         * @param  {[type]} postime [description]
         * @return {[type]}         [description]
         */
        dealVoyageData (data, postime) {
            try {
                /***
                 *说明：用户未付费时候
                *且数据是按倒序排序的
                ***/
                var pointlist = data.result

                for (var i = pointlist.length - 1; i >= 0; i--) {
                    if (parseInt(postime) < parseInt(pointlist[i].pos_time)) {
                        delete pointlist[i]
                        pointlist.length = pointlist.length - 1
                    } else {
                        break
                    }
                }

                /***
                 *所有停泊点时间处理*
                *数据节点按照倒序来的
                */
                var stoppointlist = data.othervalue
                var newstoppoint = []
                if (stoppointlist.length > 0) {
                    for (var i = 0; i < stoppointlist.length; i++) {
                    // 存在停泊点小于，启动点大于的情况，则启动点点时候应该为当前时间
                        if (parseInt(postime) >= parseInt(stoppointlist[i].pos_time)) {
                            if (
                                stoppointlist[i].navigate_status != '1' &&
                        i > 0 &&
                        newstoppoint.length == 0
                            ) {
                                stoppointlist[i - 1].pos_time = postime
                                newstoppoint.push(stoppointlist[i - 1])
                            }
                            newstoppoint.push(stoppointlist[i])
                        }
                    }
                }
                data.result = pointlist
                data.special_Data = newstoppoint
            } catch (e) {}
            return data
        },

        /**
         * 时间换算
         */
        formatTime (time) {
            var myDate = new Date(time * 1000)
            var day = myDate.getDate()
            if (day < 10)day = '0' + day
            let m = (myDate.getMonth() + 1)
            let h = myDate.getHours()
            let min = myDate.getMinutes()
            let s = myDate.getSeconds()
            m < 10 ? m = '0' + m : m
            h < 10 ? h = '0' + h : h
            min < 10 ? min = '0' + min : min
            s < 10 ? s = '0' + s : s
            var YMD = myDate.getFullYear() + '/' + m + '/' + day
            var HMS = h + ':' + min + ':' + s
            var YMDHMS = YMD + ' ' + HMS
            return YMDHMS
        },
        /**
        * @description [船舶标签]
        * @param {单个船舶marker} marker
        * @param {单个船舶ais信息} ais
        * @param {单个船舶经纬度} latlng
        * @param {Bealoon} bol
        */
        shipTip (marker, ais, latlng, type) {
            let rotateAngel = this.shipTipAlgorithm(ais)
            var pos = this.calcDir(rotateAngel)
            marker.pos = pos

            marker.unbindTooltip().bindTooltip(ais.shipename, {
                className: `shiptips tips${ais.mmsi}`,
                permanent: true,
                direction: 'right',
                direc: pos[2],
                offset: [0, 0]
            })
            marker.mmsi = ais.mmsi
        },
        /**
         * 选中船舶
         * @param {船舶mmsi} mmsi
         * @param {经纬度} latlng
         */
        selectShip (mmsi, latlng, head) {
            this.selectShipMarker.eachLayer(layer => {
                map.removeLayer(layer)
            })
            var shipIcon = L.icon({
                iconUrl: shipSelect,
                className: 'shipSelect',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
            var selectShip = L.marker(latlng, {
                icon: shipIcon,
                mmsi: mmsi
                // rotationAngle: head
            })
            this.selectShipMarker.addLayer(selectShip)
            map.addLayer(selectShip)
            map.fitBounds(this.selectShipMarker.getBounds())
        },

        /**
         * 清除选中船的各类
         */
        clearShip () {
            // 清除轨迹
            if (this.shipVoyageCirMarker) {
                this.shipVoyageCirMarker.eachLayer(layer => {
                    map.removeLayer(layer)
                })
                this.shipVoyageCirMarker = ''
            }
            if (this.shipvoyageLineMarker) {
                map.removeLayer(this.shipvoyageLineMarker)
                this.shipvoyageLineMarker = ''
            }
            // 清除选中船舶
            this.selectShipMarker.eachLayer(layer => {
                map.removeLayer(layer)
            })
        },

        /* 计算弹框碰撞 */
        collision (markerList) {
            /* markerList 判断的集合 */
            let bounds = []
            // for( let i in markerList ){
            markerList.eachLayer(layer => {
                let marker = layer
                let tooltipWidth = marker.getTooltip().getElement().offsetWidth // 标签宽度
                let tooltipHeight = marker.getTooltip().getElement().offsetHeight // 标签高度
                /* 获取tooltip左上角像素坐标 */
                let tooltipLT
                tooltipLT = map.latLngToLayerPoint(marker.getLatLng())
                tooltipLT.x -= tooltipWidth / 2
                tooltipLT.y -= tooltipHeight

                let tooltipRB = {
                    x: tooltipLT.x + tooltipWidth,
                    y: tooltipLT.y + tooltipHeight
                }
                if (tooltipLT.x < 1 || tooltipLT.y < 1) {
                    return
                }
                /* 创建 bound 对象 传递左上，右下坐标 */
                let bound = new L.bounds(
                    { x: tooltipLT.x, y: tooltipLT.y },
                    { x: tooltipRB.x, y: tooltipRB.y }
                )

                /* markerList 依次判断碰撞 */
                let flag = true
                if (bounds.length > 0) {
                    for (let n = 0; n < bounds.length; n++) {
                        let b = bounds[n]
                        if (b.contains(bound) || b.intersects(bound)) {
                            marker.closeTooltip()
                            flag = false
                            break
                        }
                    }
                }

                if (flag) {
                    bounds.push(bound)
                    marker.openTooltip()
                }
            })
        }
    }
}
</script>

<style lang='stylus'>
    @import '../stylus/components/shipInfoView.styl';
</style>
