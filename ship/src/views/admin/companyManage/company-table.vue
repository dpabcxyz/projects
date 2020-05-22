<template lang='pug'>
  .admin-grow
    .admin-grow_table
        Table(
            border
            :columns="tableHeade"
            :data="list"
            :loading="loading"
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
            v-if="list.length"
            :total="total"
            :page-size='20'
            :current="pageNumber"
            @on-change="changePage"
        )
</template>

<script>
import Api from 'api/api'

export default {
    name: 'companyManageTables',
    computed: {

    },
    mounted () {

    },
    props: ['loading', 'total', 'page-size', 'page-number', 'list', 'table-heade'],
    data () {
        return {
        }
    },
    methods: {

        changePage (page) {
            this.$emit('pageChanged', page)
        },
        companyDetails (event, row, index) {
            this.$router.push({
                path: `/admin/company/show/${row.id}`
            })
        }
    }
}
</script>

<style>

</style>
