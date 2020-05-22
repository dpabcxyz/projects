const tableHeader = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '船名',
        key: 'shipName',
        width: 150,
        resizable: true,
        tooltip: true
    },
    {
        title: '船ID',
        key: 'shipId'
    },
    {
        title: '设备IMEI',
        key: 'deviceImei',
        width: 160
    },
    {
        title: '设备编码',
        key: 'deviceNo',
        width: 120
    },
    {
        title: '所有人',
        key: 'userName'
    },
    {
        title: '联系电话',
        key: 'phone'
    },
    {
        title: '所在分组',
        key: 'groupName'
    },
    {
        key: 'ACTION',
        title: '操作',
        slot: 'action',
        align: 'center',
        width: 80
    }
]
export default tableHeader
