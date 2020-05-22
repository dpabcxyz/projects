<template lang="pug">
    .typhoon(v-if="displayTyphoon")
        .title 当前台风
        template(v-if="currentTy.length")
            .filterTy
                RadioGroup(
                    v-model="single"
                )
                    Radio(v-for="(item,index) in currentTy" :key="index" :label="getTyName(item)")
            .title
                | 受台风影响的渔船
                span.notice
                    Button(type="primary" size='small' :disabled="shipList.length === 0" @click='announceShow = true') 公告
                    Button(type="primary" size='small' :disabled="shipList.length === 0" @click="exportShip") 导出
            .title
                span
                    |未来
                    Select(
                        v-model="selectTime"
                        class="timerSelect"
                        size="small"
                        style="width:120px"
                    )
                        Option(
                            v-for="(item,index) in timeQuantum"
                            :value="item.key" :key="item.key"
                        ) {{item.value}}
            .list(v-if="shipList.length")
                scrollBar(style='max-height: 250px')
                    .list-item(v-for="(item,index) in shipList" :key="index" )
                        span 船舶：{{item.shipName}}（ID：{{item.mmsi}}）
                        span 状态：{{item.shipStatus | shipStatus}}
                        span 联系人：{{item.shipOwner}}
                            i(@click="showContactLayerFn(index)") 联系TA

                        span 位置：{{item.lat |formatLat}} / {{item.lon |formatLng}}
                .loadMore(v-if="showAddMore" @click="getTyphoonShipInfo(true)") 加载更多
            template(v-else)
                .notwarning 暂无预警信息
        template(v-else)
            .emptyData 当前没有台风
        div
        Modal(
            v-model="showContactLayer"
            title="联系方式"
            :z-index='2000'
            width='220'
        )
            .contact_modal
                p
                    span 手机号码:
                    span {{shipContactData.shipOwnerPhone}}
                p
                    span 卫星电话:
                    span {{shipContactData.satellitePhone}}
                p
                    span 无线电呼号:
                    span {{shipContactData.callSign}}
        Modal(
            v-model="announceShow"
            title="发布避台公告"
            :z-index='2000'
            width='440'
            @on-ok="announceAll"
        )
            .sendmsghtml
                .sendform
                    span 选择发送方式：
                    Select(
                        v-model="selectTimeAnnounce"
                        class="timerSelect"
                        size="small"
                        style="width:100px"
                    )
                        Option(
                            v-for="(item,index) in timeQuantum"
                            :value="item.key" :key="item.key"
                        ) {{item.value}}
                //-.sendform
                    span 选择发送方式：
                    CheckboxGroup(v-model="selectSendType")
                        Checkbox(label="App消息通知")
                        Checkbox(label="短信")
                .sendform
                    span 内容：
                    Input(
                        class="textarea_disabled"
                        v-model="sendMsg"
                        maxlength="200"
                        type="textarea"
                        disabled
                        :placeholder="`受台风：${tyName}影响，您所在的附近海域将受大风和强降雨影响，请尽快防台避台`"
                        style="height: 110px"
                        :autosize ='{ minRows: 5, maxRows: 8 }'
                    )

</template>

<script>
import Api from 'api/api'
import Bus from 'plugins/eventBus'
import { lonLatTranslate } from 'utils/gps'
import { mapMutations, mapGetters } from 'vuex'
import tymark from 'img/typhoon.gif'
let timeQuantum = [
    {
        key: 48,
        value: '未来48小时'
    },
    {
        key: 24,
        value: '24小时'
    },
    {
        key: 12,
        value: '12小时'
    },
    {
        key: 3,
        value: '3小时'
    },
    {
        key: 1,
        value: '1小时'
    }
]

let tooltipOption = {
    direct: 'right',
    opacity: 1,
    className: 'ls_tooltip_ty'
}
export default {
    name: 'Typhoon',
    computed: {
        ...mapGetters(['language']),
        ...mapGetters('map', ['typhoonLayersGroup', 'map']),
        comTyName () {
            for (let i = 0; i < this.currentTy.length; i++) {
                const element = this.currentTy[i]
                if (this.single === this.getTyName(element)) {
                    return element
                }
            }
            return null
        },
        tyName () {
            return this.getTyName(this.comTyName)
        }
    },
    mounted () {

    },
    props: {
        displayTyphoon: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            single: '',
            timeQuantum: timeQuantum,
            selectTime: timeQuantum[0].key,
            selectTimeAnnounce: timeQuantum[0].key,
            currentTy: [],
            shipList: [],
            // 显示公告窗口
            announceShow: false,
            sendMsg: '',
            selectSendType: [],
            pageSize: process.env.NODE_ENV === 'production' ? 1 : 5,
            pageNumber: 1,
            showAddMore: false,
            showContactLayer: false,
            shipContactData: {}
        }
    },
    watch: {
        displayTyphoon: function (val, oldVal) {
            if (val) {
                this.currentTy = []
                this.currentTyphoon()
            } else {
                this.clearTyphoonLayer()
                this.single = ''
            }
            this.toggleIconLigh()
        },
        single: function (val, old) {
            if (this.currentTy.length) {
                let array = this.currentTy
                for (let i = 0; i < array.length; i++) {
                    const element = array[i]
                    let name = this.getTyName(element)
                    if (name === val) {
                        this.typhoonLayersGroup.clearLayers()
                        this.getTYdetailsById(element)
                        this.getTyphoonShipInfo()
                        return
                    }
                }
            }
        },
        selectTime: function (val, oldVal) {
            if (val) {
                this.getTyphoonShipInfo()
            }
        }

    },
    methods: {
        ...mapMutations('map', ['clearTyphoonLayer']),
        toggleIconLigh () {
            var typhoon = document.querySelector("[toolItem = 'typhoon']")
            if (typhoon) {
                typhoon.classList.toggle('active')
            }
        },
        openTyphoon () {
            this.displayTyphoon = true
        },
        closeTyphoon () {
            this.displayTyphoon = false
        },
        currentTyphoon () {
            var params = {
                method: 'GET',
                url: Api.currentTy
            }
            this.$restFull(params).then((res) => {
                var nowTime = new Date() * 1 - 10 * 24 * 60 * 60 * 1000
                var newRes = res.filter((item) => {
                    return item.starttime > nowTime
                })
                this.currentTy = newRes
                this.single = this.getTyName(res[res.length - 1])
            })
        },
        getTyName (data) {
            if (!data) return ''
            if (this.language.indexOf('zh') && data.stormCnname) {
                return data.stormCnname
            }
            return data.stormEnname ? data.stormEnname : ''
        },

        getTYdetailsById (storm) {
            if (!this.ty_data) {
                this.ty_data = {}
            }
            let { id } = storm
            var params = {
                method: 'GET',
                url: Api.getTyphoonDetail,
                params: {
                    stormvalue: id
                }
            }
            this.$restFull(params).then((res) => {
                if (!res) return
                // 180°转换一下数据
                res.presentdatalist && this._translatelonlat(0, res.presentdatalist)
                res.forecastdatalist && this._translatelonlat(1, res.forecastdatalist)
                res = { ...res, ...{ stromId: id } }
                this.ty_data[id] = res
                this.addTyphoonTrack(res)
            })
        },
        _translatelonlat (datatype, typhoondata) {
            try {
                if (datatype == 0) {
                    if (typhoondata.length > 1) {
                        typhoondata = this._typhoonTrackSUtil(typhoondata)
                    }
                } else if (datatype == 1) {
                    for (var key in typhoondata) {
                        var _thisdata = typhoondata[key].storm
                        typhoondata[key].storm = this._typhoonTrackSUtil(_thisdata)
                    }
                }
            } catch (e) {
                console.log(e)
            }
            return typhoondata
        },
        _typhoonTrackSUtil: function (dataArray) {
            return this._tracksUtilCom(dataArray, 'lon', 1)
        },

        /**
         * [_tracksUtilCom 跨180度公共处理方法，以第一个点或者最后一个点为标准处理]
         * @param  {[type]} dataArray [需要处理的数组集合]
         * @param  {[type]} filedname [字段名称，lon或者longitude类似的]
         * @param  {[type]} rate      [倍率，及是否需要除6000000]
         * @return {[type]}           [description]
         */
        _tracksUtilCom: function (dataArray, filedname, rate) {
            try {
                if (!dataArray || dataArray.length <= 1) return dataArray
                var course_targ = false
                var latLonmark = dataArray[0][filedname]
                dataArray[0].oldlon = dataArray[0][filedname]
                /** *顺序执行，从第二个点开始***/
                for (var i = 1; i < dataArray.length; i++) {
                    dataArray[i].oldlon = dataArray[i][filedname]
                    var subValue = Math.abs(dataArray[i - 1].oldlon - dataArray[i][filedname]) / rate
                    if (subValue >= 180 && !course_targ) {
                        latLonmark = dataArray[i - 1].oldlon
                        dataArray[i][filedname] = this._getCalcuteLtlg(latLonmark, dataArray[i][filedname], rate)

                        course_targ = true
                    } else if (subValue >= 180 && course_targ) {
                        course_targ = false
                    } else if (course_targ) {
                        dataArray[i][filedname] = this._getCalcuteLtlg(latLonmark, dataArray[i][filedname], rate)
                    }
                }
                return dataArray
            } catch (e) {
                console.log(e)
                return dataArray
            }
        },
        addTyphoonTrack (data, opts) {
            let defaultOpt = {
                showForecast: true,
                locate: true
            }
            opts = L.extend(defaultOpt, opts)
            let { forecastdatalist, presentdatalist, stromId } = data

            if (presentdatalist) {
            // 现在的台风轨迹
                this.getTYPresentTraceById(presentdatalist, stromId, opts.locate)
            }

            if (forecastdatalist && opts.showForecast) {
            // 预测轨迹
                this.getTYForecastTraceById(forecastdatalist, stromId)
            }
        },
        getTYPresentTraceById (data, stromId, locate = true) {
            if (!this.ty_layers) {
                this.ty_layers = {}
            }
            // 当前台风
            if (typeof data === 'undefined') {
                throw new Error('没有获取到台风数据')
            }
            var tyName = this.getTyName(data[0])
            var i = 0
            var len = data.length
            var latlngs = []
            var layers = L.layerGroup([], { layerType: 'typhoon-present' })
            var line = L.layerGroup([], { layerType: 'typhoon-present-line' })
            var marker = L.layerGroup([], { layerType: 'typhoon-present-marker' })
            var center = null
            var marker_gif
            for (var i = 0; i < len; i++) {
                var element = data[i]
                element.tyName = tyName
                var latlng = [element.lat, element.lon]
                latlngs.push(latlng)
                var tips = this._getTooltipHTML(element)
                var layer = L.circleMarker(latlng, this._cicleOptions('#eea01d', 1, 'typhoon-present-circleMarker'))
                    .unbindTooltip()
                    .bindTooltip(tips, tooltipOption)

                if (i == len - 1) {
                // 最后一个点挂载台风动画
                    center = latlng
                    marker_gif = this._TYMarker(element)
                    // window.tb = marker_gif
                    /**
                .eachLayer(function(layer) {
                    layer.unbindTooltip()
                        .bindTooltip(tips, {
                            direct: 'right',
                            opacity: 1
                        })
                });
                */
                }
                marker.addLayer(layer)
            }
            line = L.polyline(latlngs, {
                weight: 2,
                color: '#3385ff',
                opacity: 1
            })

            layers.addLayer(marker_gif)
            layers.addLayer(line)
            layers.addLayer(marker)

            var id = stromId
            if (!this.ty_layers[id]) {
                this.ty_layers[id] = {}
            }
            if (!this.ty_layers[id]['latlngs']) {
                this.ty_layers[id]['latlngs'] = []
            }
            this.ty_layers[id]['present'] = layers
            this.ty_layers[id]['latlngs'] = this.ty_layers[id]['latlngs'].concat(latlngs)

            if (this.map) {
                layers.addTo(this.typhoonLayersGroup)

                if (locate) {
                    var zoom = this.map.getZoom()
                    this.map.setView(center, zoom, {
                        animate: true
                    })
                }
            }
        },
        getTYForecastTraceById (data, id) {
        // 预测台风轨迹
            if (typeof id === 'undefined' || typeof data === 'undefined') {
                throw new Error('台风 id 不能为空')
            }

            var i = 0
            var len = data.length
            var latlngs = []
            var layers = L.layerGroup([], { layerType: 'typhoon-forecast' })
            var item_line = L.layerGroup([])
            var item_marker = L.layerGroup([])

            var tyName = this.getTyName(data[0])
            layers.addLayer(item_line)
            layers.addLayer(item_marker)
            for (var i = 0; i < len; i++) {
                var { colourLine, foreOrgName, foretype } = data[i]
                var element = data[i]['storm']
                var element_len = element.length
                var item_polyline = null
                // item_layers = L.layerGroup([], { pane: this.options.pane, layerType: "typhoon-forecast-" + i }),
                var item_latlngs = []
                for (var j = 0; j < element_len; j++) {
                    var elm = element[j]
                    var latlng = [elm.lat, elm.lon]
                    item_latlngs.push(latlng)
                    latlngs.push(latlng)
                    var marker = L.circleMarker(latlng, {
                        radius: 3,
                        color: '#F6F200',
                        fillOpacity: 1,
                        fill: true,
                        layerType: 'typhoon-forecast-circleMarker'
                    })

                    elm = { ...elm, foreOrgName, tyName }
                    var tips = this._getTooltipHTML(elm)
                    marker.unbindTooltip().bindTooltip(tips, tooltipOption)
                    item_marker.addLayer(marker)
                // window.ta = marker
                }

                item_polyline = L.polyline(item_latlngs, {
                    color: colourLine,
                    dashArray: '5,5'
                })
                item_line.addLayer(item_polyline)
            // layers.addLayer(item_layers)
            }

            var layersId = L.Util.stamp(layers)

            if (!this.ty_layers[id]) {
                this.ty_layers[id] = {}
            }
            if (!this.ty_layers[id]['latlngs']) {
                this.ty_layers[id]['latlngs'] = []
            }

            this.ty_layers[id]['forecast'] = layers
            this.ty_layers[id]['latlngs'] = this.ty_layers[id]['latlngs'].concat(latlngs)

            if (this.map) {
                layers.addTo(this.typhoonLayersGroup)
                this.ty_layers[id]['latlngs'] && this.map.fitBounds(this.ty_layers[id]['latlngs'], {
                    padding: [100, 100]
                })
            }
        },
        _TYMarker (data) {
        // 生成台风 marker
            if (typeof data === 'undefined') {
                return
            }
            var typhoonIcon = L.icon({
                iconUrl: tymark,
                iconSize: [32, 32],
                shadowSize: [0, 0],
                shadowAnchor: [0, 0],
                popupAnchor: [0, -10]
            })
            var radiusSeven
            var radiusTen
            var tips = this._typhoonEyeTooltip(data)
            var marker = L.marker([data.lat, data.lon], {
                icon: typhoonIcon,
                layerType: 'typhoon-marker-gif'
            }).unbindTooltip()
                .bindTooltip(tips, { ...this._tooltipOption, ...{ permanent: true, direction: 'top', offset: [0, -10] } })

            if (data.radNeq34kt) {
                var option1 = this._cicleOptions('#eea01d', 0.3, 'typhoon-marker-gif-circle')
                radiusSeven = L.circle([data.lat, data.lon], option1)
                radiusSeven.setRadius((data.radNeq34kt) * 1000)
            }
            /** **10级风圈半径***/
            if (data.radNeq50kt) {
                var option2 = this._cicleOptions('#F6F200', 0.3, 'typhoon-marker-gif-circle')
                radiusTen = L.circle([data.lat, data.lon], option2)
                radiusTen.setRadius((data.radNeq50kt) * 1000)
            }
            var group = L.layerGroup([], {
                layerType: 'typhoon-marker-gif-group'
            })
            radiusTen && group.addLayer(radiusTen)
            radiusSeven && group.addLayer(radiusSeven)

            group.addLayer(marker)
            return group
        },
        _cicleOptions (colorvalue, opacity, type = '') {
            return {
                radius: 3,
                stroke: !0,
                color: colorvalue,
                weight: 1,
                opacity: opacity,
                fillColor: colorvalue,
                fillOpacity: opacity,
                fill: !0,
                layerType: type
            }
        },
        _getTooltipHTML (data) {
        // 显示台风参数
            if (typeof data === 'undefined') {
                return
            }
            var html = '<div class="tooltips_opacity">'
            // 台风名称
            data.tyName && (html += '<h3>' + data.tyName + '</h3>')

            // 最大风速
            data.maxWindGust && (html += '<p><span>最大风速:</span>' + data.maxWindGust + '米/秒</p>')

            // 风力
            data.power && (html += '<p><span>风力:</span>' + data.power + '级</p>')

            // 等级
            data.strong && (html += '<p><span>等级:</span>' + data.strong + '</p>')

            // 经度
            data.lon && (html += '<p><span>经度:</span>' + lonLatTranslate(data.lon, 'lon') + '</p>')

            // 纬度
            data.lat && (html += '<p><span>纬度:</span>' + lonLatTranslate(data.lat, 'lat') + '</p>')

            // 移动速度
            data.moveSpeed && (html += '<p><span>移动速度:</span>' + data.moveSpeed + '公里/小时</p>')

            // 七级半径
            data.radNeq34kt && (html += '<p><span>七级风圈半径:</span>' + data.radNeq34kt + '公里</p>')

            // 十级半径
            data.radNeq50kt && (html += '<p><span>十级风圈半径:</span>' + data.radNeq50kt + '公里</p>')

            // 移动方向
            data.moveDirection && (html += '<p><span>移动方向:</span>' + this._angleToDirection().degreeAbbr(data.moveDirection) + '</p>')

            // 时间点 2019-01-02 08:00:00 -> 01-02 08:00
            data.commonTimeStr && (html += '<p><span>时间点:</span>' + data.commonTimeStr.slice(5, 16) + '</p>')
            html += '</div>'
            return html
        },
        _typhoonEyeTooltip (data) {
            console.log(data)

            // 显示台风参数
            if (typeof data === 'undefined') {
                return
            }
            var html = '<div class="tooltips_ty_eye">'
            // 台风名称
            data.tyName && (html += '<h3>' + data.tyName + '</h3>')

            // 最大风速
            data.maxWindGust && (html += '<p><span>最大风速:</span>' + data.maxWindGust + '米/秒</p>')

            // 风力
            data.power && (html += '<p><span>风力:</span>' + data.power + '级</p>')

            // 等级
            data.strong && (html += '<p><span>等级:</span>' + data.strong + '</p>')

            // 经度
            data.lon && (html += '<p><span>经度:</span>' + lonLatTranslate(data.lon, 'lon') + '</p>')

            // 纬度
            data.lat && (html += '<p><span>纬度:</span>' + lonLatTranslate(data.lat, 'lat') + '</p>')

            // 移动速度
            data.moveSpeed && (html += '<p><span>移动速度:</span>' + data.moveSpeed + '公里/小时</p>')

            // 七级半径
            data.radNeq34kt && (html += '<p><span>七级风圈半径:</span>' + data.radNeq34kt + '公里</p>')

            // 十级半径
            data.radNeq50kt && (html += '<p><span>十级风圈半径:</span>' + data.radNeq50kt + '公里</p>')

            // 移动方向
            data.moveDirection && (html += '<p><span>移动方向:</span>' + this._angleToDirection().degreeAbbr(data.moveDirection) + '</p>')

            // 时间点 2019-01-02 08:00:00 -> 01-02 08:00
            data.commonTimeStr && (html += '<p><span>时间点:</span>' + data.commonTimeStr.slice(5, 16) + '</p>')
            html += '</div>'
            return html
        },
        getTyphoonShipInfo (addto) {
            var params = {
                method: 'GET',
                url: Api.typhoonShipInfo,
                params: {
                    timeRange: this.selectTime,
                    tfId: this.comTyName.tfid,
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                }
            }
            this.$restFull(params).then((res) => {
                if (!res || (Array.isArray(res) && res.length === 0)) {
                    this.shipList = []
                    this.pageNumber = 1
                    return
                }
                if (addto) {
                    this.shipList = this.shipList.concat(res.items)
                    this.pageNumber++
                } else {
                    this.shipList = res.items
                    this.pageNumber = 2
                }

                this.showAddMore = res.totalPage > res.currentPage
            })
        },
        announceAll () {
            // 公告所有船舶
            var params = {
                method: 'post',
                url: Api.sendTyphoonInfo,
                data: {
                    timeRange: this.selectTimeAnnounce,
                    tfId: this.comTyName.tfid
                }
            }
            if (this.comTyName && this.comTyName.stormEnname) {
                params.data.stormName = this.comTyName.stormEnname
            }

            this.$restFull(params).then((res) => {
                this.$Notice.success({
                    title: '发送成功'
                })
            })
        },

        exportShip () {
            var params = {
                timeRange: this.selectTime,
                tfId: this.comTyName.tfid
            }
            let url = Api.typhoonShipExport + '?' + this.$qs.stringify(params)
            console.log('export Url:', url)
            /*
            var data = {
                method: 'GET',
                url: Api.typhoonShipExport,
                params: params,
                responseType: 'arraybuffer'

            }
            this.$restFull(data).then((res) => {
            }) */
            window.location.href = url
        },

        showContactLayerFn (index) {
            this.shipContactData = this.shipList[index]
            this.showContactLayer = true
        }

    }
}
</script>
<style lang='stylus'>
    @import '../../stylus/components/mapToolbar/typhoon.styl';
</style>
