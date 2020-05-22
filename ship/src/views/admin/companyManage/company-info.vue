<template lang="pug">
    #companyManage
        .admin-title
            router-link(
                :to='add'
            )  企业管理
            | >> 企业详情
        Divider
        .admin-area
            .search_box 搜索:
                Input(
                        class="search_input"
                        v-model="keyWords"
                        placeholder="请输入企业名称/员工名称/员工电话/员工邮箱/船舶MMSI/IMEI"
                        clearable
                        style="width: 420px"
                        @on-enter="search"
                    )
            .search_box
                Button(
                    type="primary"
                    class="search_btn"
                    @click="search"
                ) 搜索
                Button(
                    type="primary"
                    class="search_btn"
                    @click="add"
                ) 新增
        .admin-grow
            .admin-grow_table
                div.aa
                    Table(
                        border
                        :columns="tableHeade"
                        :data="list"
                        :loading="loading"
                        :width="tableWidth"
                        :height="tableHeight"
                        stripe
                    )
                        .table-btn(
                            slot-scope="{ row, index }"
                            slot="action"
                        )
                            Button(type="info" @click="showMore(row, index)") 详情
                            Button(type="success" @click="showMore(row, index)") 模板
                            Button(type="primary" @click="showMore(row, index)") 管理
            .admin-grow_page
                Page(
                    v-if='list.length > 0'
                    :total="total"
                    :page-size='20'
                    :current="pageNumber"
                    @on-change="getCompanyList"
                )

</template>

<script>
import Api from 'api/api'
const COMPANY_HEADER = [
    {
        title: '企业名称',
        key: 'companyName',
        minWidth: 250,
        tooltip: true
    },
    {
        title: '管理员名称',
        key: 'userName',
        width: 100
    },
    {
        title: '管理员电话',
        key: 'serviceMobile',
        width: 100
    },
    {
        title: '关注船舶上限',
        key: 'shipcount',
        width: 100
    },
    {
        title: '管理船舶数量',
        key: 'managerShipNum',
        width: 100
    },
    {
        title: '员工账号数量',
        key: 'usernumber',
        width: 100
    },
    {
        key: 'ACTION',
        title: '操作',
        slot: 'action',
        width: 230,
        align: 'center'
    }
]
export default {
    name: 'companyManage',
    computed: {

    },
    mounted () {
        // this.getTableArea()
        this.search()
    },
    data () {
        return {
            companyName: '',
            IMEI: null,
            loading: false,
            list: [],
            tableHeade: COMPANY_HEADER,
            tableWidth: null,
            tableHeight: null,
            keyWords: '',
            pageNumber: 1,
            pageSize: 20
        }
    },
    methods: {
        add () {
            console.log('add')
        },
        search () {
            this.getCompanyList(1)
        },
        getTableArea () {
            var table = document.querySelector('.admin-grow_table')
            if (table) {
                this.tableWidth = table.style.width
                // this.tableHeight = table.clientWidth
            }
        },
        getCompanyList (pageNumber = this.pageNumber) {
            var params = {}
            if (this.keyWords) {
                params = {
                    keyWords: this.keyWords
                }
            }
            this.$restFull({
                method: 'GET',
                url: Api.companyList,
                jointData: {
                    pageNumber: pageNumber,
                    pageSize: this.pageSize
                },
                data: params
            }).then((res) => {
                this.$nextTick(() => {
                    this.list = res.list
                    this.total = res.total
                    this.pageNumber = pageNumber
                })
            })
        }
    }
}
</script>

<style>

</style>
