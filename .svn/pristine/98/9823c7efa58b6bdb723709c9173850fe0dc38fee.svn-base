const BASE = process.env.NODE_ENV === 'production' ? 'ws://server.loongship.com' : 'ws://101.201.127.109'

class webSocket {
  constructor(){
    /**
     * @this {WSEventCallback} [WS事件回调存储器,键值对形式，msgType--callback]
     */
    this.WSEventCallback = new Map();
    this.isInit = false;
  }
  static getInstance(){
    if( !webSocket.instance ){
      webSocket.instance = new webSocket();
    }
    return webSocket.instance;
  }
  init( config ){
    if( this.isInit == true ){
      return 
    }
    Object.assign( this , config );
    if( this.language.indexOf('zh') !== -1 ){
        this.language = 'zh'
    }else{
        this.language = 'en'
    };
    this.url = `${BASE}:9988/webPushService?channel=10&userId=${encodeURIComponent(this.userId)}&language=${this.language}`;
    this.ws = new WebSocket( this.url );
    
    /* 打开WS */
    this.ws.onopen = event => {
      this.onopen( event );
    }

    /* 监听WS消息 */
    this.ws.onmessage = event => {
      this.onmessage( event );
    }

    /* 关闭WS */
    this.ws.onclose = event => {
      this.onclose( event );
    }

    /* WS错误信息 */
    this.ws.onerror = event => {
      this.onerror( event );
    }

    this.isInit = true;
  }

  /* WS事件回调入口 */
  inputCallback( msgType , callback ){
    this.WSEventCallback.set( msgType , callback );
  }

  onopen( event ){
    this.wsTimer = setInterval( () => {
      this.ws.send( JSON.stringify({"msgType":'1'}) );
      console.log('ws轮询');
    } , 10000);
  }
  
  onmessage( event ){
    let data = JSON.parse( event.data );
    let msgType = data.msgType;
    /* 如果已经保存 msType 对应的回掉则直接执行 */
    if( this.WSEventCallback.has(String(msgType)) ){
      this.WSEventCallback.get( String(msgType) )( data );
    }
  }

  onclose( event ){
    console.log( event );
    clearInterval( this.wsTimer );
  }

  onerror( event ){
    console.log( event );
  }
}

export default webSocket;