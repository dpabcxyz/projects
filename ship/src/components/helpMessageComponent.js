
class tableTitle{
  constructor(){
    this.title =  [
      {
        // type: 'index',
        width: '60',
        align: 'center',
        title: '序号',
        render:(cakkback , params)=>{
          let num = this.currentPageConst * this.currentPage + params.index;
              num++;
          return cakkback('span',{},num)
        }
      },
      {
        title: '船名',
        key: 'shipName',
        width: 'auto',
        align: 'center'
      },
      {
        title: '船ID',
        key: 'mmsi',
        width: '110',
        align: 'center'
      },
      {
        title: '状态',
        key: 'shipStatus',
        width: '62',
        align: 'center',
        render( callback , params ){
          let data = {
            1:()=>{ return '在航'},
            2:()=>{ return '靠泊'},
            3:()=>{ return '锚泊'},
            4:()=>{ return '停泊'},
          }
          return callback('span',{},
            data[ params.row.shipStatus ]()
          );
        }
      },
      {
        title: '距离(nm)',
        key: 'distance',
        width: '87',
        align: 'center'
      },
      {
        title: '方位(°)',
        key: 'degree',
        width: '75',
        align: 'center'
      },
      {
        title: '速度(kn)',
        key: 'speed',
        width: '85',
        align: 'center'
      },
      {
        title: '航迹向(°)',
        key: 'course',
        width: '86',
        align: 'center'
      },
      {
        title: '手机号',
        key: 'mobile',
        width: 'auto',
        align: 'center'
      },
      {
        title: '卫星电话',
        key: 'satellitePhone',
        width: 'auto',
        align: 'center'
      },
      {
        title: '无线电呼号',
        key: 'callSign',
        width: 'auto',
        align: 'center'
      },
      {
        title: '操作',
        key: 'control',
        width: '150',
        align: 'center',
        render: ( callback , table ) => {
          return callback( 'div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}}, [
            /* 发消息按钮 */
            callback( 'Button' , {
              props: {
                type: 'text',
                size: 'small'
              },
              on:{ click:() => { 
                this.soloSend = table.row;
                this.emergencyHelpMeeeeeChange( true );
              }}
            } , '发消息'),
            /* 船舶详情按钮 */
            callback( 'Button' , {
              props: {
                type: 'text',
                size: 'small'
              },
              on:{ click: () => { this.$router.push({ name: 'shipInfo', params: { shipId: table.row.mmsi } }) }}
            },'船舶详情'),
          ]);
          
        }
      },
    ]
  };
}
export default new tableTitle();