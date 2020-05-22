<template lang="pug">
    #companyManage
        .admin-bread
            Breadcrumb
                BreadcrumbItem(
                    to="/admin"
                ) admin
                BreadcrumbItem(
                ) 企业管理

        .admin-title 企业管理
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
                    to='/admin/company/add'
                ) 新增
        companyTable(
            :table-heade="tableHeade"
            :list="list"
            :total="total"
            :page-size='20'
            :page-number="pageNumber"
            :loading="loading"
            @pageChanged="getCompanyList"
        )
        //- .admin-grow
            .admin-grow_table
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
                        Button(type="info" @click="companyDetails($event,row,index)") 详情
                        Button(type="success") 模板
                        Button(type="primary") 管理
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
import companyTable from './company-table'
import { COMPANY_HEADER } from './companyTableHeader'

export default {
    name: 'companyManage',
    components: {
        companyTable
    },
    computed: {

    },
    mounted () {
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
            pageSize: 20,
            total: 0
        }
    },
    methods: {
        add () {
            console.log('add')
        },
        search () {
            this.getCompanyList(1)
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
