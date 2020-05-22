<template lang="pug">
    .ship-fleet
        .topbar
            span 共{{fleet.length}}艘
            span 全选
                Checkbox(v-model='single')
        .ship-fleet_list
            Tree(
                :data="fleet"
                show-checkbox
                @on-select-change="selectChange"
                :render= "renderContent"
            )

</template>

<script>
import Api from 'api/api'
import { mapGetters } from 'vuex'
import fleetTest from './fleetTestdata'

export default {
    name: 'Fleet',
    props: {

    },
    data () {
        return {
            single: false,
            fleet: [],
            group: [],
            data: [{
                title: 'parent',
                loading: false,
                children: []
            }]
        }
    },
    mounted () {
        this.getFleetList()
        this.arrangeData()
        // this.filterShipGrpup()
        // console.log(this.group)
    },
    computed: {
        ...mapGetters('user', ['userId'])
    },
    methods: {
        loadData (item, callback) {
            callback(this.fleet)
        },
        selectChange (selectedList) {
            const node = selectedList[selectedList.length - 1] // 获取当前点击的节点
            if (node) {
                this._loadData(node.id, (response) => {
                    if (!response) return // 没有子节点则返回
                    let array = []
                    response.forEach((item) => { // 遍历子节点，然后在各子节点上递归调用请求下一层后代
                        array.push(item)
                        this._loadData(item.id, () => {})
                    })
                    node.children = array // 挂载子节点
                    node.expand = true // 展开子节点树
                })
            }
        },
        renderContent (h, { root, node, data }) {
            console.log(h)

            return (
                <span class="grow">{data.shipName}<br/></span>
            )
        },
        filterShipGrpup () {
            var data = fleetTest
            var tmp = []
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                tmp.push(item.groupName)
            }
            this.group = new Set([...tmp])
            return this.group
        },
        arrangeData () {
            // 整理数据
            var data = fleetTest
            var self = this
            var groupName = []
            var arrangeData = {
                // title: '标题1',
                // children: []
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i]

                // 获取分组名称
                groupName.push(item.groupName)

                // 归集数据
                var opitons = arrangeData[item.groupName]
                if (opitons) {
                    opitons.children.push(item)
                } else {
                    arrangeData[item.groupName] = {
                        colorvalue: item.colorvalue,
                        // checout: false,
                        title: `${item.groupName} (${item.mmsi})`,
                        children: [],
                        render (h, { root, node, data }) {
                            return (
                                <span class="grow">{data.title}<br/></span>
                            )
                        }
                    }
                    item.render = self.renderContent
                    arrangeData[item.groupName].children.push(item)
                }
            }
            // console.log(groupName)
            console.log(arrangeData)
            var treeData = []
            for (const key in arrangeData) {
                treeData.push(arrangeData[key])
            }
            this.group = new Set([...groupName])
            this.fleet = treeData
        },
        loadData (item, callback) {
            var data = []
            callback(data)
        },
        getFleetList () {
            var res = [
                {
                    'id': 4297,
                    'operatorId': 96080,
                    'companyId': '315354f3134f440cb6850afbf75e8185',
                    'mmsi': 123904324,
                    'insertTime': 1570618183434,
                    'updateTime': 1570618183434,
                    'isDelete': 0,
                    'username': null,
                    'userrole': null,
                    'headImg': null,
                    'mobile': null,
                    'colorvalue': '08b012',
                    'shipName': 'TESTSHIP4',
                    'groupName': '三无测试组'
                },
                {
                    'id': 4297,
                    'operatorId': 96080,
                    'companyId': '315354f3134f440cb6850afbf75e8185',
                    'mmsi': 123904324,
                    'insertTime': 1570618183434,
                    'updateTime': 1570618183434,
                    'isDelete': 0,
                    'username': null,
                    'userrole': null,
                    'headImg': null,
                    'mobile': null,
                    'colorvalue': '08b012',
                    'shipName': 'TESTSHIP4',
                    'groupName': '三无测试组'
                },
                {
                    'id': 4297,
                    'operatorId': 96080,
                    'companyId': '315354f3134f440cb6850afbf75e8185',
                    'mmsi': 123904324,
                    'insertTime': 1570618183434,
                    'updateTime': 1570618183434,
                    'isDelete': 0,
                    'username': null,
                    'userrole': null,
                    'headImg': null,
                    'mobile': null,
                    'colorvalue': '08b012',
                    'shipName': 'TESTSHIP4',
                    'groupName': '三无测试组'
                },
                {
                    'id': 4297,
                    'operatorId': 96080,
                    'companyId': '315354f3134f440cb6850afbf75e8185',
                    'mmsi': 123904324,
                    'insertTime': 1570618183434,
                    'updateTime': 1570618183434,
                    'isDelete': 0,
                    'username': null,
                    'userrole': null,
                    'headImg': null,
                    'mobile': '三无测试组2',
                    'colorvalue': '08b012',
                    'shipName': 'TESTSHIP4',
                    'groupName': '三无测试组2'
                },
                {
                    'id': 4297,
                    'operatorId': 96080,
                    'companyId': '315354f3134f440cb6850afbf75e8185',
                    'mmsi': 123904324,
                    'insertTime': 1570618183434,
                    'updateTime': 1570618183434,
                    'isDelete': 0,
                    'username': null,
                    'userrole': null,
                    'headImg': null,
                    'mobile': '三无测试组2',
                    'colorvalue': '08b012',
                    'shipName': 'TESTSHIP4',
                    'groupName': '三无测试组2'
                }
            ]
            return res
            
            var params = {
                userId: this.userId
            }

            var language = (navigator.language || navigator.browserLanguage)
            // if(language.indexOf('zh'))

            this.$axios.get(Api.selectManagerShip, { params: params })
                .then((res) => {
                    return res
                })
            /*  this.$restFull({
                method: 'get',
                url: Api.selectManagerShip,
                // data: params
                params: params
            }).then((res) => {
                console.log(res)
            }) */
        },
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    color: '#666',
                    cursor: 'pointer'
                },
                domProps: {
                    className: 'btn'
                },
                on: {
                    click: (e) => {

                    }
                }
            }, data.name)
        }
    }

}
</script>

<style lang='stylus'>
    @import '../mixins.styl'
.ship-fleet
    margin-top 10px
    background linear-gradient(0deg, rgba(0, 46, 103, 1), rgba(4, 51, 130, 1))
    box-shadow 0px 0px 4px 0px rgba(10, 32, 79, 0.9)
    border-radius 0px 2px 2px 0px
    margin-right 34px
    cursor auto
    .ivu-checkbox-inner
        background none
        border 1px solid #89A6D1
    .topbar
        height 24px
        background rgba(10, 122, 236, 0.6)
        border-radius 0px 2px 0px 0px
        font-size 12px
        color #fff
        flexBox(space-between, center)
        padding-left 19px
        padding-right 14px
        span:last-child
            color #89A6D1
        i
            font-style normal
            color #1FB8FF
            padding 0 3px
        .ivu-checkbox-inner
            margin-left 10px
    .ship-fleet_list
        .svg-icon_unfold
            width 6px
            height 10px
            margin-right 14px
            fill #8AA1C4
        .svg-icon_edit
            width 12px
            height 12px
            margin-right 10px
            fill #8AA1C4
            cursor pointer
        ul
            flexBox()
            flex-direction column
            li
                height 44px
                line-height 44px
                border-bottom 1px dashed rgba(227, 227, 227, 0.3)
                padding 0 14px 0 20px
                color #fff
                flex-grow 1
                flexBox(space-between, center)
            ul
                padding-left 20px
        .groupName
            height 44px
            line-height 44px
            border-bottom 1px dashed rgba(227, 227, 227, 0.3)
            padding 0 14px 0 20px
            color #fff
            flex-grow 1
            flexBox(space-between, center)
            span:first-child
                flex-grow: 1
                border: 1px solid red

</style>
