
import {
    Events
} from '../utils/EventManageUtil'
import Eventkey from '../constants/Eventkey'
import Globalkey from '../constants/Globalkey'
import {
    datastore
} from '../utils/DataStore'
// import {
//     measureTool
// } from "../features/measure";
import svgConfig from '../../images/reminder/shezhi.svg'
import svgMsg from '../../images/reminder/tixing1.svg'
import svgNewMsg from '../../images/reminder/tixing2.svg'
import loading from '../../images/loading2.gif'
import svgClose from '../../images/reminder/guanbi1.svg'

import 'jquery-confirm'
import 'jquery-confirm/dist/jquery-confirm.min.css'
require('../../css/measure.css')

var devlist = [/localhost/, /^192.168.16/, /59.110.53.219/, /0.0.0.0/]
var isDev = function () {
    for (let i = 0; i < devlist.length; i++) {
        const item = devlist[i]
        if (item.test(location.href)) {
            isDev = true
            console.log('%c你现在正在测服上浏览', ' text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:14px')
            return
        }
    }
    isDev = false
}
isDev()
// 生产接口
var baseUrl = 'http://101.201.124.64:9082/easyShippingService/area/'
var socket = 'ws://101.201.124.64:9988/webPushService'
// 环境的切换
if (isDev) {
    // 测服接口
    baseUrl = 'http://60.205.250.22:9082/easyShippingService/area/'
    socket = 'ws://101.201.127.109:9988/webPushService'
}

export default class ReminderControler {
    constructor (map) {
        this.options = Object.create({
            utilBoxDom: '',
            mapview: map
        })
        this.reminderLayerGroup = L.layerGroup()
        this.timer = null // 接收定时器
        this.updateTimer = null // 提交定时器
        this.baseData = {
            socketUrl: socket,
            historyMsg: `${baseUrl}queryAreaHistoryNews`, // 用户历史消息
            userArea: `${baseUrl}queryUserAreaGourp`, // 用户区域
            userShip: `${baseUrl}queryUserShip`, // 用户关注船舶
            upDateUserArea: `${baseUrl}updateUserAreaGourp`, // 修改用户关注的区域
            upDateUserShip: `${baseUrl}updateUserShip`, // 修改用户关注的船舶
            getAreaInfoByGroup: `${baseUrl}getAreaInfoByGroup`, // 获取区域数据
            ws: null,
            lastMsgId: null,
            pageSize: 10,
            msgDom: $('#newreminderdom'),
            heartbeat: null,
            heartbeatInterval: 20000
        }
        this.msgAlreadyRead = false // 消息已读
        this.requestsNumber = 0 // 更新用户区域船舶的请求数量

        this.updatatag = [] // 判断更新数据是否全部完成
        this.currentShowShip = null // 当前显示的船舶
        this.socketHistory = [] // websocket历史消息
        this.paramOptions = {
            'userId': window.userid,
            'channel': 10,
            'language': 'zh'
        }
        var language = (navigator.browserLanguage || navigator.language).toLowerCase()
        if (language.indexOf('en') > -1) {
            this.paramOptions.language = 'en'
        }

        this.init = this.init.bind(this)
        this.initSocket = this.initSocket.bind(this)
        this.getUserData = this.getUserData.bind(this)
        this.initAreaAjax = this.initAreaAjax.bind(this)
        this.initShipAjax = this.initShipAjax.bind(this)
        this.getUserHistoryMsg = this.getUserHistoryMsg.bind(this)
        this.clearLayer = this.clearLayer.bind(this)
        this.showSlider = this.showSlider.bind(this)
        Events.addEvent(Eventkey.REMINDER_RENDER, 'REMINDER_RENDER', this.showSlider)
        Events.addEvent(Eventkey.REMINDER_RENDER_CLEARLAYER, 'REMINDER_RENDER_CLEARLAYER', this.clearLayer)
    }
    showSlider (prams) {
        this.init(prams)
    }

    /**
     *
     * 初始化dom
     * @param {*} paramsObject
     * @memberof reminder
     */
    init (params) {
        this.params = params
        this.clearMsg()
        $('#reminderMsgList').html('')
        if (this.params.clicked) {
            this.readCommitted()
            this.msgAlreadyRead = true
            $('#map-ship-reminder').show()
        } else {
            this.msgAlreadyRead = false
            this.removeLayer()
            $('#map-ship-reminder').hide()
            return
        }
        var _self = this
        var boxDom = params.boxDom
        var reminderDom = boxDom.find('#map-ship-reminder')
        if (!reminderDom || reminderDom.length < 1) {
            reminderDom = $(`
            <div id="map-ship-reminder" class="map-ship-reminder">
            <div class="reminder_bar">
                <span id='usertest' data-i18n="map.reminde.popname">提醒列表</span>
                <span id="openConfig"><img src="${svgConfig}" alt=""/></span>
            </div>
            <div class="reminder_nomsg" data-i18n="map.reminde.noreminder">
                暂无提醒信息
            </div>
            <div class="reminder_msg" id="reminder_msg">
                <div class="loading_reminder" id="reminder_loading">
                    <img src="${loading}" alt=""/>
                </div>

                <ul id="reminderMsgList" class="reminderMsgList">
                </ul>
                <div class="addMore" id="addMore" data-i18n="map.reminde.addmore">加载更多</div>
            </div>
        </div>`)

            reminderDom.css('max-height', $('#winMg').height() - 180)
            boxDom.append(reminderDom)

            $('#reminderMsgList').on('click', function (e) {
                _self.showShipInfo(e)
            })

            $('#addMore').on('click', function () {
                _self.getUserHistoryMsg(_self.lastMsgId)
            })
            if (this.params.clicked) {
                this.initHistorySocket()
            }
            Events.fire(Eventkey.SITE_LANGUAGE_LOAD_PART, reminderDom) // 更新国际化 部分区域
        }
        this.popupOpenConfig() // 绑定config
        if (!params.clicked) {
            reminderDom.slideUp('fast')
        } else {
            reminderDom.slideDown('fast')
        }

        this.initSocket()
        this.initHistorySocket()
        this.getUserHistoryMsg()
    }
    showShipAndArea (options) {
        if (!options) return
        var opts = {
            areaLayer: this.reminderLayerGroup
        }
        Object.assign(opts, options)
        opts.mmsi && (opts.mmsi = opts.mmsi.toString())
        // Events.fire(Eventkey.SHIP_POSITION_KEY_REMINDER, opts);
        Events.fire(Eventkey.SHIP_REMINDER_SHOW_SHIP, opts)
    }
    initHistorySocket () {
        return

        if (this.socketHistory.length > 0) {
            for (let i = 0; i < this.socketHistory.length; i++) {
                const ele = this.socketHistory[i]
                this.parseSocketData(ele)
            }
        }

        this.socketHistory = []
    }
    checkoutNewMsg () {
        // 查询是否有新消息
        this.getUserHistoryMsg(null, false)
        this.initSocket()
    }
    popupOpenConfig () {
        var _self = this
        $('#openConfig').on('click', function () {
            _self.initPopup()
        })
    }
    renderPopup (data, tip, name) {
        if (!data) return
        var html = ''
        var list = ''
        var dataKey = ''
        var id = ''
        if (name === 'ship') {
            dataKey = 'shipName'
            id = 'mmsi'
        } else if (name === 'area') {
            dataKey = 'groupName'
            id = 'groupId'
        }
        for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            const isopen = ele.isOpen
            list += `<li><label><input type="checkbox" ${isopen == '1' ? 'checked' : ''} id="${ele[id]}" name="${name}"><span>${ele[dataKey]}</span></label></li>`
        }

        html += `
        <div class="reminder_popup_box_content_tip">
            ${tip}
        </div>
        <ul>
            ${list}
        </ul>
        `
        return html
    }
    initPopup () {
        var configText = $.i18n.prop('map.reminde.config')
        var ok = $.i18n.prop('map.reminde.ok')
        var cancel = $.i18n.prop('map.reminde.cancel')

        var html = `<div id="reminder_popup" class="reminder_popup">
        <div class="reminder_marker"></div>
        <div class="reminder_popup_box">
            <div class="reminder_popup_box_bar">
                <span>
                    <img class='imgsvg' src="${svgConfig}" alt="">
                    <b>${configText}</b>
                </span>
                <span class="reminder_close">
                    <img class='imgsvg' src="${svgClose}" alt="">
                </span>
            </div>
            <div class="reminder_popup_box_content" id="reminder_user_select">
                <div class="reminder_popup_box_content_scroll">
                    <div class="loading_reminder" id="reminder_loading_popup">
                        <img src="${loading}" alt=""/>
                    </div>
                    <div id="userArea"></div>
                    <div id="userAreShip"> </div>
                </div>
            </div>
            <div class="btns">
                <button class="submit" id='reminder_submit'>${ok}</button>
                <button class="cancel reminder_close">${cancel}</button>
            </div>
        </div>
    </div>`

        if (!$('#reminder_popup').length > 0) {
            $('body').append(html)
            this.getUserData()
            this.popupEvents()
        }
    }
    popupEvents () {
        this.bindClosePopupEvent()
        this.submintBtn()
    }
    bindClosePopupEvent () {
        if ($('.reminder_close')) {
            $('.reminder_close').on('click', function () {
                $('#reminder_popup') && $('#reminder_popup').remove()
            })
        }
    }
    closePopup () {
        $('#reminder_popup') && $('#reminder_popup').remove()
    }
    submintBtn () {
        if ($('#reminder_user_select')) {
            var _self = this
            $('#reminder_submit').on('click', function () {
                $(this).attr('disabled', 'disabled')
                var update_area = _self.getSeclectOptios('userArea', 'area')
                var update_ship = _self.getSeclectOptios('userAreShip', 'ship')

                // _self.requestsNumber += update_area.length;
                // _self.requestsNumber += update_ship.length > 1 ? 1 : 0;
                _self.requestsNumber = 2
                _self.updateUserData(update_area, 'area')
                _self.updateUserData(update_ship, 'ship')
                $(this).attr('disabled', false)
            })
        }
    }
    _updataUserData (url, data, cb) {
        var _self = this
        $.ajax({
            type: 'POST',
            url: url,
            async: false,
            data: data,
            success: function (data) {
                cb && cb(data)
                $('#reminder_submit').attr('disabled', false)
                --_self.requestsNumber
                if (_self.requestsNumber == 0) {
                    var msg = $.i18n.prop('map.reminde.submitsuccess')
                    _self.alert(msg)
                    _self.closePopup()
                }
            },
            error: function (err) {
                if (!_self.isError) {
                    var msg = $.i18n.prop('map.reminde.submiterror')
                    _self.alert(msg)
                    _self.isError = true
                }
            }
        })
    }
    updateUserData (data, type) {
        if (!data || !type) return
        // if (data.length === 0) return;
        var param = Object.assign({}, this.paramOptions)

        if (type === 'area') {
            param['groupId'] = data.length === 0 ? -1 : data.join(',')
            this._updataUserData(this.baseData.upDateUserArea, param)

            return
        }

        if (type === 'ship') {
            param['mmsis'] = data.length === 0 ? -1 : data.join(',')
            this._updataUserData(this.baseData.upDateUserShip, param)
            console.log('update ship')
        }
    }
    getSeclectOptios (id, name) {
        // [name=所有的checkboxname同名]
        if (!$('#' + id)) return
        var options = []

        $('#' + id).find('input[name=' + name + ']:checkbox:not(:checked)').each(function () {
            options.push($(this).attr('id'))
        })
        return options
    }
    readCommitted () {
        // 发送已读通知
        var opts = Object.assign({}, this.paramOptions, { msgType: '91', 'contentType': '20', channelId: 4 })
        setTimeout(() => {
            if (this.baseData.ws) {
                this.baseData.ws.send(JSON.stringify(opts))
            }
        }, 100)
    }

    parseSocketData (data) {
        var { content } = data
        var msgContent = content.split('~')
        var [mmsi, type, areaId, sendTime, shipName, groupName, typeName, areaName] = msgContent

        content = {
            mmsi,
            type,
            areaId,
            sendTime,
            shipName,
            groupName,
            typeName,
            areaName
        }
        this._renderSocketMsg(content)
    }
    initSocket () {
        if (this.baseData.ws) return
        var param = '?' + $.param(this.paramOptions)

        var _self = this
        console.log(this.baseData.socketUrl + param)
        this.baseData.ws = new WebSocket(this.baseData.socketUrl + param)
        this.baseData.ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            _self.heartbeat()
        }

        this.baseData.ws.onmessage = function (evt) {
            var received_msg = evt.data

            if (_self.msgAlreadyRead === false) {
                _self.newMsg()
                _self.socketHistory.push(JSON.parse(received_msg))
                return
            }
            // console.log("数据已接收...", received_msg);
            // content=mms~type~areaId~sendTime~shipName~areaName ( type   1：进入区域；2：区域启动；3：驶出区域；4：区域停泊)
            // {"channelId":4,"content":"201806666~1~156637543942296289~1566378513~shipName~areaName","contentType":20,"fromId":-1,"msgId":4554022565283840,"msgType":3,"toId":95943}

            _self.parseSocketData(JSON.parse(received_msg))
        }

        this.baseData.ws.onclose = function () {
            // 关闭 websocket
            console.log('连接已关闭...')
            _self.stopHeartbeat()
        }
    }
    heartbeat () {
        var _self = this
        this.baseData.heartbeat = setInterval(() => {
            var param = Object.assign({}, this.paramOptions, { 'msgType': '1', channelId: 4 })
            _self.baseData.ws.send(JSON.stringify(param))
            console.log('💓')
        }, this.baseData.heartbeatInterval)
    }
    stopHeartbeat () {
        clearInterval(this.baseData.heartbeat)
    }
    checkLoad () {
        if (this.areaData && this.shipData) {
            // done
            clearInterval(this.timer)
            this.timer = null
            console.log('done')
            this.showUserPopup()
        } else {
            this.timer = null
            this.timer = setInterval(() => {
                this.checkLoad()
            }, 1000)
        }
    }
    getUserData () {
        this.initAreaAjax()
        this.initShipAjax()
        this.checkLoad()
    }
    showUserPopup () {
        $('#reminder_loading_popup').hide()
        $('#userArea,#userAreShip').show()
    }
    initAreaAjax () {
        this.areaData = false
        // 获取区域消息
        var param = this.paramOptions
        var _self = this
        $.ajax({
            type: 'POST',
            url: this.baseData.userArea,
            data: param,
            success: function (data) {
                _self.areaData = true
                var result = data.result
                var focusarea = $.i18n.prop('map.reminde.area')
                var html = _self.renderPopup(result, focusarea, 'area')
                $('#userArea') && $('#userArea').html(html)
            }
        })
    }
    initShipAjax () {
        // 获取船舶数据
        this.shipData = false
        var param = this.paramOptions
        var _self = this
        $.ajax({
            type: 'POST',
            url: this.baseData.userShip,
            data: param,
            success: function (data) {
                _self.shipData = true
                var result = data.result
                var focusShip = $.i18n.prop('map.reminde.focus')
                var html = _self.renderPopup(result, focusShip, 'ship')
                $('#userAreShip') && $('#userAreShip').html(html)
            }
        })
    }
    showMsgLoading () {
        if ($('#reminder_loading')) {
            $('#reminder_loading').show()
        }
    }
    hideMsgLoading () {
        if ($('#reminder_loading')) {
            $('#reminder_loading').hide()
        }
    }
    _renderSocketMsg (data) {
        var html = this._renderMsgtml(data)
        if ($('#reminderMsgList')) {
            this.hideMsgLoading()

            $('#reminderMsgList').prepend(html)
            $('#reminder_msg').scrollTop(0)

            // $("#reminderMsgList")
            $('#addMore').show()
        }
    }
    alert (msg, title = '提示:') {
        $.alert({
            title: title,
            content: msg,
            boxWidth: '360px',
            useBootstrap: false
        })
    }
    getAreaData (data) {
        if (!data) return
        var { mmsi, shipName, type, areaId, groupName, typeName, areaName } = data

        var param = {
            userId: window.userid,
            areaId
        }
        var _self = this
        $.ajax({
            type: 'POST',
            url: _self.baseData.getAreaInfoByGroup,
            data: param,
            success: function (data) {
                if (data.code != 0) {
                    data.msg = data.msg || 'No Data'
                    _self.alert(data.msg)
                    return
                }
                var geoJSON = data.data[0].geometry
                var style = data.data[0].areaRule
                if (!geoJSON) return
                geoJSON = JSON.parse(geoJSON)
                var weight = 1.4
                var { areaColor: fillColor = 'red', areaOpacity: fillOpacity = 100, borderColor: color = '#3388ff' } = style

                _self.clearLayer()
                _self.reminderLayerGroup = L.geoJSON(geoJSON, {
                    style: function (feature) {
                        return {
                            color,
                            weight,
                            fillOpacity: fillOpacity.replace('%', '') / 100,
                            fill: true
                        }
                    }
                })

                var latLngs = _self._reversLatLngs(geoJSON.coordinates)

                _self.reminderLayerGroup.addTo(_self.options.mapview)

                Events.fire(Eventkey.SHIP_REMINDER_SHOW_SHIP, {
                    mmsi: `${mmsi}`,
                    areaLayer: _self.reminderLayerGroup,
                    latLngs: latLngs

                })
            }
        })
    }
    _reversLatLngs (array) {
        if (!Array.isArray(array)) return
        var tmpArray = []

        for (let i = 0; i < array.length; i++) {
            if (Array.isArray(array[i][0])) {
                return this._reversLatLngs(array[i])
            } else {
                let [x, y] = array[i]
                tmpArray.push([y, x])
            }
        }
        return tmpArray
    }
    removeLayer () {
        this.options.mapview.removeLayer(this.reminderLayerGroup)
    }
    clearLayer () {
        this.reminderLayerGroup.clearLayers()
    }
    getUserHistoryMsg (msgId, hasRender) {
        // 获取历史消息

        var param = Object.assign({}, this.paramOptions, { pageSize: 5 })
        if (msgId) {
            param.msgId = msgId
        }

        !msgId ? this.showMsgLoading() : ''
        var _self = this
        $.ajax({
            type: 'POST',
            url: this.baseData.historyMsg,
            data: param,
            success: function (data) {
                var nData = data.result

                if (hasRender === false) {
                    if (nData == null || nData.length == 0) {
                        // _self.initSocket(false) // true 连接websocket 不渲染页面
                        return
                    }

                    if (nData.length > 0) {
                        for (var j = 0; j < nData.length; j++) {
                            if (nData[j].isRead == 0) {
                                _self.newMsg()
                                break
                            }
                        }
                    }
                    return
                }

                !msgId ? _self.hideMsgLoading() : ''

                if (nData == null || nData.length == 0) {
                    if ($('#reminderMsgList li').length > 0) {
                        _self.alert('没有查询到相关数据')
                    } else {
                        $('.reminder_nomsg').show()
                    }
                    $('#addMore').hide()
                    return ''
                }

                var html = ''

                for (let i = 0; i < nData.length; i++) {
                    const ele = nData[i]

                    var data = nData[i]['content'].split('~')
                    var [mmsi, type, areaId, sendTime, shipName, groupName, typeName, areaName] = data
                    var content = {
                        mmsi,
                        type,
                        areaId,
                        sendTime,
                        shipName,
                        groupName,
                        typeName,
                        areaName
                    }

                    html += _self._renderMsgtml(content)
                }
                if ($('#reminderMsgList')) {
                    $('#reminderMsgList').append(html)
                    $('#addMore').show()
                }
                if (nData[nData.length - 1].msgId) {
                    _self.lastMsgId = nData[nData.length - 1].msgId
                }
            }
        })
    }
    _LongToStr (timemills) {
        var newDate = new Date()
        newDate.setTime(timemills)

        return this.paramOptions.language == 'zh' ? newDate.Format('yyyy-MM-dd hh:mm:ss') : newDate.Format('hh:mm dd-MM-yyyy')
    }
    _getAreaType (type) {
        var tmp = null
        // ( type   1：进入区域；2：区域启动；3：驶出区域；4：区域停泊)
        switch (type * 1) {
        case 1:
            tmp = 'map.reminde.shipin'
            break
            // case 2:
            //     tmp = "区域启动"
            //     break;
        case 3:
            tmp = 'map.reminde.shipout'
            break

            // case 4:
            //     tmp = "区域停泊"
            //     break;
        default:
            break
        }

        var txt = $.i18n.prop(tmp)
        return txt
    }
    _renderMsgtml (data) {
        if (!data) return
        var html = ''
        var { mmsi, type, areaId, sendTime, shipName, areaName, groupName, typeName } = data

        var shipType = this._getAreaType(type)
        data.shipType = shipType

        var tip1 = $.i18n.prop('map.reminde.shipTip1')
        var tip1_2 = $.i18n.prop('map.reminde.shipTip1-2')
        var tip2 = $.i18n.prop('map.reminde.shipTip2')
        var tip3 = $.i18n.prop('map.reminde.shipTip3')
        var tip3_2 = $.i18n.prop('map.reminde.shipTip3-2')
        var tip4 = $.i18n.prop('map.reminde.content')

        var text_temp1 = L.Util.template(tip1, data)
        var text_temp2 = L.Util.template(tip2, data)
        var text_temp3 = L.Util.template(tip3, data)
        if (type == 3) {
            // 驶入
            text_temp1 = L.Util.template(tip1_2, data)
            text_temp3 = L.Util.template(tip3_2, data)
        }

        html += `<li class="showshipinfo" data-mmsi="${mmsi}" data-ship-name="${shipName}" data-area-id="${areaId}" data-type="${type}" data-area-name="${areaName}">
            <div class="msg_type">
                <span title="${text_temp1}">${text_temp1}</span>
                <span>${this._LongToStr(sendTime * 1000)}</span>
            </div>
            <div class="msg_shipname">${text_temp2}</div>
            <div class="msg_content">
                <span>${tip4}</span>
                <div class="msg">${text_temp3}</div>
            </div>
        </li>`
        $('.reminder_nomsg').hide()
        return html
    }

    newMsg () {
        var msg = this.baseData.msgDom
        if (msg) {
            msg.find('.remindericon').eq(0).attr('src', svgNewMsg)
        }
    }
    clearMsg () {
        var msg = this.baseData.msgDom
        if (msg) {
            msg.find('.remindericon').eq(0).attr('src', svgMsg)
        }
    }

    showShipInfo (e) {
        var shipItem
        if ($(e.target).hasClass('showshipinfo')) {
            shipItem = $(e.target)
        } else {
            shipItem = $(e.target).parents('.showshipinfo')
        }

        var data = shipItem.data()
        shipItem.addClass('active')
        shipItem.siblings().removeClass('active')
        this.getAreaData(data)
        if (data.mmsi) {
            this.currentShowShip = data.mmsi
        }
    }
}
