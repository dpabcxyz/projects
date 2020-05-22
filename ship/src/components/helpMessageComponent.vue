<template lang='pug'>
div#helpShip(v-show="isHelp")
  //- 顶部救援消息
  div.help_message_box
    div.left_btn(@click="move('left')" :style="{visibility:helpMsgList.length<3?'hidden':'visible'}")
      img(:src="leftImg")
    div.help_message_list_box
      ul
        li(v-for="(item,index) in helpMsgList" :key="index"  @click="handeleHelpMsgList(index , item)" )
          div.task_box(:class="{click:item.isClick}")
            Button.un_register(size="small" @click="unRegister( $event , item , index )") 解除
            div 救援船舶： {{ item.shipName }}
            div 发起时间： {{ item.startTime||item.taskTime | formatTime }}
    div.right_btn(@click="move('right')" :style="{visibility:helpMsgList.length<3?'hidden':'visible'}")
      img(:src="rightImg")
  //- 右侧提示消息
  #helpMsgBox(v-show="!isCloseAll")
    .help_msg_box 
      .helpMsg(v-for="(item,index) in titleList" :key="index")
        div(@click="closeMsg($event,index,'close')")
          svgIcon.close(name="close")
        .box
          .header 救援指南： 
          .title {{item.title || ''}}
          .number {{item.phone || ''}}
          .number {{item.weixing || ''}}
          .number {{item.wuxian || ''}}
      Button(@click="closeAll" class="close_all") 关闭
  //- 救援船舶列表
  div.help_ship_list(v-show="showShipListView")
    div.help_ship_box
      div.title_box
        div.title 船舶列表
        div(@click="closeHelpShipList")
          svgIcon.close(name="close")
      div.input_box
        div 附近
          <input class="input" @keyup="hlChange($event)" :value="helpHl"/> 海里
        //-海里共{{helpShipConst}}条渔船
        Button.outPut_execl(@click="outPutExecl") 导出
      div.table_box
        <Table class="table" :content="this" border stripe :columns="helpShipListTitle" :data="helpShipListDataCurrent" ></Table>
      div.btn_box
        .prve_page(@click="tablePageChange('prve')" :style="{background:(helpShipListData.length<currentPageConst||currentPage==0)?'#666':'#0a7aec'}") 上一页
        .next_page(@click="tablePageChange('next')" :style="{background:(helpShipListData.length<currentPageConst||(currentPage+1)*currentPageConst>helpShipListData.length)?'#666':'#0a7aec'}") 下一页
  //- 群发救援
  div.help_ship_list(v-show="emergencyHelpMeeeee")
    div.send_help_meee
      .title 紧急救援通知
      div.close(@click="closeHelpMeEditor")
          svgIcon.close(name="close") 
      div.editor_box
        div.send_type 选择发送方式：
        div.send_box 
          CheckboxGroup(v-model="disabledGroup")
            Checkbox(value="App消息通知" :label="'App消息通知'" v-show="false")
            Checkbox(value="短信" :label="'短信'")
        div.center(style="margin-top:13px;")
          div() 内容：
          div.content() 协助救援！一艘渔船遇险，请前往救助!
            //- Input(style="margin-top:13px" type="textarea" disabled v-model="textarea" :rows="2" placeholder="请输入...")
            div.input_box_list(v-show="showShipListView") 距离：{{soloSend.distance}}nm
            div.input_box_list(v-show="showShipListView") 方位：{{soloSend.degree}}°
            div.input_box_list 位置：{{ shipInfo.shipMessage.lat||shipInfo.shipMessage.latitude | formatLat }} / {{shipInfo.shipMessage.lon || shipInfo.shipMessage.longitude | formatLng }}
            div.input_box_list 船上联系方式：{{shipInfo.shipArchives.shipOwnerPhone}}
              
        .btn_box
          Button(@click="closeHelpMeEditor") 返回
          Button(type="primary" @click="sendHelpMeeee('sendAll')") 发送
</template>

<script>
import wsCore from './websocket';
import { mapActions , mapGetters } from 'vuex';
import day from 'dayjs'
import leftImg from '@/assets/left.png';
import rightImg from '@/assets/right.png';
import shipImg from '@/assets/yuchuan.png'
import shipStop from '@/assets/stop.png';
import shipSelect from '@/assets/ship_select.png';
import shipGreenGo from '../assets/unshipfleetdrive1.png';
import shipGreenStop from '../assets/notfleetrstop_icon.png';


import helpSvg from '../assets/icons/warning.svg';
import closeSvg from '../assets/icons/close.svg';

import { formatCoordinates } from '../utils/gps';

import { formatLng , formatLat } from '../utils/gps';

import Api from 'api/api';
import qs from 'qs';

import shipListTableTitle from './helpMessageComponent.js';
import Bus from "plugins/eventBus"


export default {
  name: 'helpMessageComponent',
  components: {
 
  },
  filters:{
    formatTime (time) {
            var myDate = new Date(time)
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
  },
  props:{

  },
  data () {
      return {
        shipListTableTitle,
        disabledGroup:['短信'],
        /* 救援信息当前页 */
        helpPage: 0,
        leftImg,
        rightImg,
        textarea:``,
        /* 是否救援 */
        isHelp: false,
        /* 发送救援消息确认 */
        isSendHelpMeee: true,
        /* 获取受困船舶附近气象数据 */
        ShipMeteorology:{},  
        soloSend:{},
        /* 右侧消息 */
        titleList:[],
        titleListNow:[
          {
            title:  '向遇险船舶了解详细情况',
            phone: '',
            weixing:'',
            wuxian: ''
          },
          {
            title:  '上报海上救援中心',
            phone: '电话：0898-68653899',
          },
          {
            title:  '上报渔政管理站',
            phone: '电话：0898-28312592',
          },
          {
            title:  '了解海上水文气象',
            phone: '当前和未来的情况',
          },
        ],
        /* 右侧提示框是否全部关闭 */
        isCloseAll: true,
        /* 当前救援任务 */
        currentHelpTask: null,
        /* 救援消息集合 */
        helpMsgList:[],
        /* 历史救援消息 */
        helpMsgHistory:[],
        /* 需要救援的船舶信息 */
        helpShipMessage:{
          name:'',
        },
        /* 需要救援的船舶经纬度 */
        helpShiplatlngs: null,

        /* 绘制救援范围对象 */
        helpRange: null,
        /* 救援船舶对象 */
        helpShipIcon: null,

        /* 附近救援船队Marker */
        helpShipList: [],
        
        /* 附近救援船舶数据 */
        helpShipListData: [],
        /* 附近救援船舶数据-当前页 */
        helpShipListDataCurrent:[],
        /* 当前页 */
        currentPage: 0,
        /* 每页显示条数 */
        currentPageConst: 5,

        startTime: this.$day().subtract(20, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.$day().format('YYYY-MM-DD HH:mm:ss'),
        optionsEnd: {},
        optionsStart: {},
        shipInfo: {
          shipOwnerInfo:{},
          shipMessage:{},
          shipArchives:{}
        },
        voyageData: {},
        latlngs: [],
        selectShipMarker: L.featureGroup(),
        shipvoyageLineMarker: '', // 轨迹线marker
        shipVoyageCirMarker: '' ,// 轨迹转向点marker

        /* 隐藏船队的船舶*/
        hideShipList:[],
      }
  },
  created(){
  },
  mounted(){
    let callback = ( task ) => {
        task = JSON.parse( task.content );
        for( let item of this.helpMsgList ){
          item.isClick = false;
        }
        task.isClick = true;
        this.helpMsgList.unshift( task );
              /* 默认当前救援任务 是第一条 */
              this.currentHelpTask = task;
              this.init();
              if(  this.$route.path == '/' || this.$route.path == '/map' ){
                this.isHelp = true;  
              }else{
                this.isHelp = false;  
              }
    };
    wsCore.getInstance().inputCallback( '22' , callback );
    /* 查询当前是否存在救援任务 */
    setTimeout( () => {
      this.queryRescueTask();
      // this.wsInit();
    } , 1000)
    /* 修改table对象原型 */
    Object.setPrototypeOf( shipListTableTitle , this );
    
  },
  watch:{
    "$store.state.shipView.helpHl"( val ){
      this.drawHelpRange();
    },
    "$route"( path ){
      if( path.name !== 'map' ){
        this.isHelp = false;  
      }else{
        this.isHelp = true;  
      }
    },
  },
  computed:{
    ...mapGetters('shipView' , ['helpShipConst','helpHl']),
    ...mapGetters('helpMessageComponent' , ['showShipListView','emergencyHelpMeeeee']),
    helpShipListTitle(){
      return shipListTableTitle.title
    }
  },
  methods: {
    ...mapActions('shipView' , ['openShipInfoView','openShowShipHelpView','helpShipConstChange','helpHlChange','closeShowShipHelpView','closeShipInfoView']),
    ...mapActions('helpMessageComponent' , ['showShipListViewChange','emergencyHelpMeeeeeChange']),
    ...mapGetters('user', ['userId']),
    ...mapGetters(['language']),
    ...mapActions('fleet', ['toggleFleetShip']),

    init( type ){
      /* 获取救援船舶信息 */
      this.getShipInfo( this.currentHelpTask.mmsi );
      /* 打开左侧弹框 */
      this.openShowShipHelpView();
      this.openShipInfoView({
        mmsi: this.currentHelpTask.mmsi , 
        type: 'SOS'
      });
      for( let mmsi of this.hideShipList ){
        this.toggleFleetShip( {
          mmsi: mmsi , 
          status: true
        });  
      }
      this.hideShipList = [];

      this.hideShipList.push( this.currentHelpTask.mmsi );
      /* 隐藏船队船舶 */
      for( let mmsi of this.hideShipList ){
        this.toggleFleetShip( {
          mmsi: mmsi , 
          status: false
        });  
      }
      
      this.titleList = [].concat( this.titleListNow );
      /* 重置右侧关闭状态 */
      for( let item of this.titleList ){
        item.isClose = false;
      }
      this.isCloseAll = false;
    },
    queryRescueTask(){
      let data = {
        params:{
          userId: this.userId('user')
        }
      }
      this.$axios.get( Api.queryRescueTask , data )
      .then( data => {
        if( !data ){
          return 
        }
        this.helpMsgList = this.helpMsgList.concat(data);
        this.helpMsgList.reverse();
        this.helpMsgList[0].isClick = true;
        /* 默认当前救援任务 是第一条 */
        this.currentHelpTask = this.currentHelpTask || this.helpMsgList[0];
        if( data.length > 0 ){
          this.init();
          this.isHelp = true;
        }
      })
      .catch( err => {

      })
    },
    tablePageChange( type ){
      if( type == 'next' ){
        if( this.currentPage * this.currentPageConst + this.currentPageConst > this.helpShipListData.length ){
          return 
        }
        this.currentPage++;
      }else{
        if( this.currentPage == 0 ){
          return 
        }
        this.currentPage--;
      };
      let startIndex = this.currentPage * this.currentPageConst;
      let endIndex = this.currentPage * this.currentPageConst + this.currentPageConst
      this.helpShipListDataCurrent = this.helpShipListData.slice( startIndex , endIndex );
    },
    handeleHelpMsgList( index , item ){
      for( let obj of this.helpMsgList ){
        obj.isClick = false;
      }
      item.isClick = true;
      /* 顶部救援消息处理 */
      this.currentHelpTask = this.helpMsgList[index];
      this.init( 'taskChange' );
      document.querySelector('.help_msg_box').style.marginLeft = '0px';
      this.isCloseAll = false;
    },
    move( type ){
      /* 顶部就选消息切换 */
      let ul = document.querySelector('.help_message_list_box > ul');
      /* 每组救援信息宽度 */
      let step = 240;
      if( type === 'left' ){
        this.helpPage !== 0 && this.helpPage++;
      }
      if( type === 'right' ){
        this.helpPage > -(this.helpMsgList.length-2) && this.helpPage--;
      }
      ul.style.left = this.helpPage * step + 'px';
    },
    
    unRegister( event , item , index ){
      this.$Modal.confirm({
        title: '解除救援任务',
        content: '确定要解除报警，结束救援任务吗？',
        onCancel: () => {},
        onOk: () => {
          event.stopPropagation();
          let data = {
            params: {
              taskId: item.id || item.taskId,
              userId: this.userId('user'),
            }
          };
          this.$axios.get( Api.updateRescueTask , data )
          .then( data => {
             this.helpMsgList.splice( index , 1 );
              if( this.helpMsgList.length > 0 ){
                this.handeleHelpMsgList(0 , this.helpMsgList[0] );
              }else{
                /* 删除最后一条救援任务的图层 */
                setTimeout( () => {
                  map.removeLayer( this.helpShipIcon );
                  map.removeLayer( this.helpRange );
                  for( let item of this.helpShipList ){
                    map.removeLayer( item );
                  }
                  this.isHelp = false;
                  this.closeShowShipHelpView();
                  this.closeShipInfoView();
                  /* 船队船舶 */
                  for( let mmsi of this.hideShipList ){
                    this.toggleFleetShip( {
                      mmsi: mmsi , 
                      status: true
                    });  
                  }
                  this.hideShipList = [];
                } , 1000)
              }
          })
          .catch( err => {

          })
        }
      })
    },
    outPutExecl(){
    let params = {
      hl: this.helpHl,
      mmsi: this.currentHelpTask.mmsi,
      userId: this.userId('user')
    }
    let url = Api.rescueShipExport + '?' + qs.stringify(params);
    // console.log( url );
    window.location.href = url
    },
    /**
     * 发送救援请求
     * @param type [请求类型：单独发送/群体发送] 
     */
    sendHelpMeeee( type , param={} ){
      let content = {
          // content: this.textarea,
          // location:{
          //   lat: this.shipInfo.shipMessage.lat || this.shipInfo.shipMessage.latitude,
          //   lon: this.shipInfo.shipMessage.lon || this.shipInfo.shipMessage.longitude,
          //   formatLat: formatLat(this.shipInfo.shipMessage.lat || this.shipInfo.shipMessage.latitude),
          //   formatLng: formatLng(this.shipInfo.shipMessage.lon || this.shipInfo.shipMessage.longitude),
          // },
          location:`${formatLat(this.shipInfo.shipMessage.lat || this.shipInfo.shipMessage.latitude)} / ${formatLng(this.shipInfo.shipMessage.lon || this.shipInfo.shipMessage.longitude)}`,
          distance: this.soloSend.distance == null?'0':this.soloSend.distance,
          position: this.soloSend.degree == null?'0':this.soloSend.degree,
          /* 被救的联系方式 */
          phone: this.shipInfo.shipArchives.shipOwnerPhone
        }
      let sendType = '';
      
      if( this.showShipListView === true ){ // 单发消息
        sendType = 1;
      }else if( this.showShipListView === false ){  // 群发消息
        sendType = 2;
      } 
      let data = {
        params:{
          content: JSON.stringify( content ),
          distance: this.helpHl,
          mobile: this.soloSend.mobile,
          mmsi: this.shipInfo.shipMessage.mmsi,
          type: sendType,
          taskId:this.currentHelpTask.id
        }
      }
      this.$axios.get( Api.sendRescueInfo , data )
      .then( data => {
        if( data.data.code == 0 ){
          this.$Notice.success({
            title: '发送救援消息成功',
          });
        }
      })
      .catch( err => {
        console.log( err )
      })
      this.emergencyHelpMeeeeeChange( false );
    },
    closeHelpMeEditor(){
      this.emergencyHelpMeeeeeChange( false );
    },
    closeHelpShipList(){
      this.showShipListViewChange( false );
    },
    hlChange( event ){
      /* 计时器用于防抖 */
      clearTimeout( this.timer )
      this.timer = setTimeout( () => {
          this.helpHlChange( event.target.value );
      } , 1000)
    },
    closeMsg( event , index ){
      let target = null;
      if( event.target.nodeName == 'use' ){
        target = event.target.parentNode.parentNode;  
      }
      if( event.target.nodeName == 'svg' ){
        target = event.target.parentNode;
      }
      let dataListBox = document.querySelector('.help_msg_box');
      /* 为当前消息添加 isClose 属性用于标记是否关闭 */
      this.titleList[ index ].isClose = true;
      target.parentNode.style.marginLeft = '300px';
      let list = dataListBox.children;
      
      setTimeout( () => {
        list[index].style.display = 'none';
        this.isCloseAll = true;
        for( let item of this.titleList ){
          if( item.isClose === undefined || item.isClose == false ){
            this.isCloseAll = false;
          }
        }
        if( this.isCloseAll ){
          this.clearDataListBox();
        }
      } , 500)
    },        

    closeAll(){
      document.querySelector('.help_msg_box').style.marginLeft = '300px';
      setTimeout( () => {
        this.clearDataListBox();  
        // document.querySelector('.help_msg_box').style.marginLeft = '0px';
      } , 500)
    },

    clearDataListBox(){
      let dataListBox = document.querySelector('.help_msg_box');
      let list = dataListBox.children;
      for( let i=0; i<list.length; i++ ){
        let item = list[i];
        if( item ){
          item.style.display = 'block';
        }
      }
      this.titleList = [];
    },

    dataPushToDataList( msg ){
      /* 将新消息 push 进dataList */
      this.titleList.push( msg );
      this.helpMsgHistory.push( msg );
      this.isMsgCloseAll = false;
    },
    wsInit(){
      /* 发送websocket */
      let language = this.language('language');
      if( language.indexOf('zh') !== -1 ){
        language = 'zh'
      }else{
        language = 'en'
      };
      let wsTimer = null;
      let host = `ws://server.loongship.com`;
      let test = `ws://101.201.127.109`;
      let ws = new WebSocket( `${test}:9988/webPushService?channel=10&userId=${encodeURIComponent(this.userId('user'))}&language=${language}`);
          ws.onopen = () => {
            wsTimer = setInterval( () => {
              ws.send( JSON.stringify({"msgType":'1'}) );
              console.log('ws轮询');
            } , 10000);
          };

          ws.onmessage = msgEvevnt => {
            let data = JSON.parse( msgEvevnt.data );
            let task = JSON.parse( data.content );
            if( data.msgType == '22' ){
              this.helpMsgList.push( task );
              /* 默认当前救援任务 是第一条 */
              this.currentHelpTask = this.currentHelpTask || task;
              this.init();
              if(  this.$route.path == '/' || this.$route.path == '/map' ){
                this.isHelp = true;  
              }else{
                this.isHelp = false;  
              }
            };

            if( data.msgType == '3' ){
              //这里是预警事件
               Bus.$emit('reminderEvent', data);   
            }
          };

          ws.onclose = ( closeEvent ) => {
            console.log( closeEvent );
            clearInterval( wsTimer );
          };

          ws.onerror = errEvent => {
            console.log( errEvent );
          };
    },
    /**
     * 查询附近渔船 
     */
    getHelpShipRange(){
      let data = {
        params: {
          hl: this.helpHl,
          mmsi: this.currentHelpTask.mmsi,
          userId: this.userId('user')
        }
      };
      this.$axios.get( Api.queryRescueShip , data )
      .then( data => {
        if( !data ){
          // console.log( '没有相关救援船舶' );
          return 
        }
        this.helpShipListData = data;
        this.helpShipListDataCurrent = data.slice( 0 , this.currentPageConst );
        this.helpShipConstChange( data.length );
        this.drawShipList( data );
      })
      .catch( err => {
        console.log( err );
      })
    },
    /**
     * 绘制附近救援船舶
     */
    drawShipList( shipDataList ){
      if( this.helpShipList.length > 0 ){
        /* 删除上条救援船舶图层 */
        for( let item of this.helpShipList ){
          map.removeLayer( item );
        }
        this.helpShipList = [];
      }
       
      /* 绘制当前受困船舶周围船舶 */
      for( let item of shipDataList ){
        this.hideShipList.push( item.mmsi );
        /* 隐藏船队船舶 */
        for( let mmsi of this.hideShipList ){
          this.toggleFleetShip( {
            mmsi: mmsi , 
            status: false
          });  
        }
        /* 因接口返回没有 heading 字段 暂时取消船舶转向 */
        
          let head;
          try{
            head = this.getHeading(item.heading, item.course, item.speed);
          }catch{
            // console.log( item.mmsi + '转向数据为空' );
          }
          let latlngs = L.latLng(item.lat / 600000, item.lon / 600000)
          var shipIcon = L.icon({
              iconUrl: shipImg,
              className: 'ship_icon_style',
              iconSize: [26, 26],
              iconAnchor: [11, 13]
          })
          var shipMarker = L.marker(latlngs, {
              icon: shipIcon,
              // rotationAngle: head
          });

          shipMarker.unbindTooltip().bindTooltip( item.shipName, {
            className: `help_ship_tooltip`,
            // permanent: true,
            direction: 'top',
            interactive: false,
            opacity: 0.8,
          });

          shipMarker.head = head;
          /**
           * 更改角度
           */
          shipMarker.setRotationAngle(head)
          shipMarker.on('click', () => {
          });

          // this.selectShip(item.shipMessage.mmsi, latlngs, head);
          // map.setView(latlngs);
          
          this.helpShipList.push(shipMarker);
          
          shipMarker.addTo( map );
      }
    },
    /**
     * 船舶定位
     */
    shipPosition (ais) {
        let head = this.getHeading(ais.shipMessage.heading, ais.shipMessage.course, ais.shipMessage.speed);
        // console.log( ais );
        let latlngs = L.latLng(ais.shipMessage.latitude || ais.shipMessage.lat / 600000, ais.shipMessage.longitude || ais.shipMessage.lon / 600000)
        this.helpShiplatlngs = latlngs;
        var shipIcon = L.icon({
            iconUrl: ais.shipMessage.ship_status == 1 ? shipGreenGo : shipGreenStop,
            className: 'ship_icon_style',
            iconSize: [26, 26],
            iconAnchor: [12,16],
        })
        var shipMarker = L.marker(latlngs, {
            icon: shipIcon,
            rotationAngle: head
        });
        shipMarker.head = head;
        /* 救援方式 */
        let sourceObj = {
          1: ()=>{return 'IOT设备上SOS按钮'},
          2: ()=>{return '船端AppSOS报警信息'}
        };
        let source = sourceObj[ this.currentHelpTask.source ]();
        let helpShipTitle = `
          <div class="help_ship_title_box">
            <div class='title'>
              <svg width="12px" height="12px" fill="#C2220C" xmlns="http://www.w3.org/2000/svg">
                <use xlink:href="${helpSvg.url}" xmlns:xlink="http://www.w3.org/1999/xlink"/>
              </svg>
              <div>海上求救</div>
            </div>
            <ul>
              <li>船舶：${ais.shipMessage.name}</li>
              <li>经纬度：${ formatLat( ais.shipMessage.lat||ais.shipMessage.latitude )} / ${ formatLng(ais.shipMessage.lon || ais.shipMessage.longitude) }</li>
              <li>发起时间：${day(this.currentHelpTask.startTime||this.currentHelpTask.taskTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</li>
              <li>求救方式: ${source}</li>
              <!--<li>海域深水点：${'无'}</li>-->
              <li>风速/风向：${this.ShipMeteorology.windVo.speed}m/s ${this.ShipMeteorology.windVo.direction}°</li>
              <li>浪高：${this.ShipMeteorology.waveHeight == null ? '无' : this.ShipMeteorology.waveHeight}</li>
            </ul>
            <div class="close">
              <svg width="8px" height="8px" xmlns="http://www.w3.org/2000/svg">
                <use xlink:href="${closeSvg.url}" xmlns:xlink="http://www.w3.org/1999/xlink"/>
              </svg>
            </div>
          </div>
        `;
        setTimeout( () => {
          document.querySelector( '.help_ship_title_box' ).ondblclick = function(e){e.stopPropagation()};
          document.querySelector( '.help_ship_title_box' ).onclick = function(e){e.stopPropagation()};
          let close = document.querySelector('.help_ship_title_box > .close'); 
            close.onclick = function (e){
                shipMarker.toggleTooltip();
              }
        } , 500);
        
        shipMarker.unbindTooltip().bindTooltip(helpShipTitle, {
            className: `help_ship_tooltip`,
            permanent: true,
            direction: 'top',
            offset:[0,-30],
            interactive: true,
            opacity: 0.8,
        })
        /**
         * 更改角度
         */
        shipMarker.setRotationAngle(head)
        shipMarker.on('click', () => {
          shipMarker.toggleTooltip();
        });

        this.selectShip(ais.shipMessage.mmsi, latlngs, head);
        // map.setView(latlngs);
        
        /* 删除上条救援船舶图层 */
        if( this.helpShipIcon ){
          map.removeLayer( this.helpShipIcon );
        }
        this.helpShipIcon = shipMarker;
        shipMarker.addTo( map );
        this.drawHelpRange( latlngs );
    },
    /**
     * 绘制救援范围
     */
    drawHelpRange(){
      /* 绘制救援范围 1海里===1852米 */
      if( this.helpRange ){
        map.removeLayer( this.helpRange );
      }
      this.helpRange = L.circle(this.helpShiplatlngs, {radius: this.helpHl * 1852,color:'#E30052',className:'help_ship_range',dashArray:'10,10'}).addTo(map);
      /* 查询附近船舶 */
      this.getHelpShipRange( this.mmsi );
    },
     /**
     * 获取船舶信息
     */
    getShipInfo( mmsi ){
        let params = {
            userId: this.userId('user'),
            mmsi
        };
        let data = {
          params
        };
        this.$restFull({
            method: 'POST',
            url: Api.queryShipDetails,
            data: params
        }).then((res) => {
          this.$axios.get( Api.queryShipMeteorology , data )
          .then( data => {
            this.ShipMeteorology = data;
            if (res.shipMessage) {
                this.helpShipMessage = res.shipMessage;
                if (res.shipMessage.latitude && res.shipMessage.latitude) {
                    res.shipMessage.latlngs = formatCoordinates([ res.shipMessage.latitude / 600000, res.shipMessage.longitude / 600000 ])
                } else {
                    res.shipMessage.latlngs = res.shipMessage.latlngs ? res.shipMessage.latlngs : 0
                    res.shipMessage.longitude = res.shipMessage.longitude ? res.shipMessage.longitude : 0
                }
            }
            this.titleListNow[0] = {
              title:  '向遇险船舶了解详细情况',
              phone: '手机号码：' + (res.shipArchives.shipOwnerPhone == null ? '无': res.shipArchives.shipOwnerPhone),
              weixing: '卫星电话：' + (res.shipArchives.satellitePhone == null ? '无' :res.shipArchives.satellitePhone),
              wuxian: '无线电呼号：' + (res.shipArchives.callSign == null ? '无' : res.shipArchives.callSign) 
            };
            this.titleList = [].concat( this.titleListNow );
            this.shipInfo = res;
            this.shipPosition(res);
          })
        })
        .catch( err => {
          console.log( err );
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
            iconAnchor: [13, 13],
        })
        var selectShip = L.marker(latlng, {
            icon: shipIcon,
            mmsi: mmsi
            // rotationAngle: head
        })
        this.selectShipMarker.addLayer(selectShip)
        setTimeout( () => {
          map.setView(latlng);
        } , 1)
        map.setZoom(10);
        map.addLayer(selectShip);
    },
  }
}
</script>

<style lang='stylus' >
  @import '../stylus/components/helpMessageComponent';
</style>
