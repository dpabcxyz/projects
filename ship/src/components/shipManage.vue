<template lang='pug'>
    .ship_manage
        .ship_manage_area
            .ship_manage_searchbar
                .left
                    Input(
                        class="search_input"
                        v-model="keyWords"
                        placeholder="输入船名、ID"
                        clearable
                        prefix="md-search"
                        style="width: 300px"
                        @on-enter="search"
                    )
                .right

                    Group(
                        @saveShipGroup="saveGroups"
                        style='width:130px;margin-right: 20px;display: inline-block;'
                    )

                    //-Select(v-model='areaSelect' filterable placeholder='设置区域' style='width:130px;margin-right: 20px;position:relative' @on-change="saveShipArea")
                        Option(v-for='item in areas', :value='item.id', :key='item.id') {{ language === 'zh-CN' ?  item.nameZh : item.nameEn }}

                    Button(style='margin-right: 20px' @click="shipsExport(false)")
                        svgIcon(name="export")
                        | 导出所选 ({{changeSelectItem.length}})

                    Button(type="primary" @click='shipsExport(true)')
                        svgIcon(name="export")
                        | 导出全部
            .ship_manage_table
                Table(
                    border
                    :tableHeade="tableHeader"
                    :list="list"
                    :loading="loading"
                    :pageNumber='pageNumber'
                    :pageSize="pageSize"
                    :pageSizeC="pageSize"
                    :total="totalNum"
                    stripe
                    ref="table"
                    @showShipInfo="showShipInfo"
                    @pageChanged="searchShipForKey"
                    @changeSelectItem="changeSelectItemAction"
                )
        copyRight(class="shipinfo_copy" )
</template>

<script>
import copyRight from './copyRight'
import tableHeader from './shipManageTableHeader'
import Table from './shipManageTable'
import Api from 'api/api'
import { mapGetters } from 'vuex'
import Group from './group'
import qs from 'qs'

export default {
    name: 'shipManage',
    computed: {
        ...mapGetters('user', ['userId']),
        ...mapGetters(['language']),
        selectShipMmsi () {
            let array = []
            for (let i = 0; i < this.changeSelectItem.length; i++) {
                const element = this.changeSelectItem[i]
                array.push(element.shipId)
            }
            return array
        }
    },
    data () {
        return {
            keyWords: '', // 2147483628
            shipGroupSelect: '',
            areaSelect: '',
            shipGroup: [],
            areas: [],
            tableHeader: tableHeader,
            loading: false,
            list: [],
            // 选中项数量
            changeSelectItem: [],
            pageNumber: 1,
            pageSize: process.env.NODE_ENV === 'production' ? 20 : 10,
            totalNum: 0
        }
    },
    components: {
        copyRight,
        Table,
        Group
    },
    mounted () {
        // this.getArea()   //todo 区域
        this.searchShipForKey()
    },
    methods: {
        shipsExport (exportAll) {
            let mmsis = []
            let params = {
                userId: this.userId
            }

            if (!exportAll) {
                if (this.changeSelectItem.length === 0) {
                    this.$Notice.error({
                        title: '请选择需要导出的数据!'
                    })
                    return
                }
                this.changeSelectItem.forEach((item) => {
                    mmsis.push(item.shipId)
                })
                params.mmsis = mmsis.join()
            }

            var url = Api.shipsExport + '?' + qs.stringify(params)
            window.location.href = url
        },
        saveShipArea (areaId) {
            // 保存船舶的分组
            if (typeof areaId === 'undefined') return
            if (this.selectShipMmsi.length < 1) {
                this.$Notice.info({
                    title: '没有选中船舶'
                })
            }

            var data = {
                method: 'post',
                url: Api.saveArea,
                jointData: {
                    mmsi: this.selectShipMmsi.toString(),
                    areaId: areaId,
                    userId: this.userId
                }
            }
            this.$restFull(data).then((res) => {
                // 这里遍历修改属性
                this.$Notice.success({
                    title: '设置区域成功'
                })
            })
        },
        saveGroups (groupItem) {
            // 保存船舶的分组

            if (typeof groupItem === 'undefined') return
            if (this.selectShipMmsi.length < 1) {
                this.$Notice.info({
                    title: '没有选中船舶'
                })
                return
            }

            var data = {
                method: 'post',
                url: Api.saveGroups,
                data: {
                    groupId: groupItem.id,
                    mmsi: this.selectShipMmsi.toString(),
                    userId: this.userId
                }
            }
            this.$restFull(data).then((res) => {
                // 这里遍历修改属性
                this._eachGroupList(groupItem.groupName)
                this.$refs.table.resetSeclect() // 重置选中项
            })
        },
        _eachGroupList (groupName) {
            let len = this.selectShipMmsi.length
            let total = 0
            for (let i = 0; i < this.list.length; i++) {
                let item = this.list[i]
                if (this.selectShipMmsi.indexOf(item.shipId) > -1) {
                    item.groupName = groupName
                    total++
                    if (total >= len) break
                }
            }
        },

        getArea () {
            var data = {
                method: 'get',
                url: Api.areas
            }
            this.$restFull(data).then((res) => {
                this.areas = res
            })
        },
        searchShipForKey (pageNumber = this.pageNumber) {
            this.loading = true
            var params = {
                method: 'GET',
                url: Api.shipList,
                params: {
                    userId: this.userId,
                    pageNumber: pageNumber,
                    pageSize: this.pageSize
                }
            }
            if (this.keyWords) {
                params.params.keyWords = this.keyWords
            }
            this.$restFull(params).then((res) => {
                this.pageNumber = 1
                this.totalNum = res.totalNum
                this.list = res.items
                this.loading = false
            })
        },
        changeSelectItemAction (data) {
            this.changeSelectItem = data
        },
        showShipInfo (row) {
            this.$router.push({
                name: 'shipInfo',
                params: { shipId: row.shipId }
            })
        },
        search () {
            this.searchShipForKey(1)
        }
    }
}
</script>

<style lang='stylus'>
    @import '../stylus/components/shipManage.styl';
</style>
