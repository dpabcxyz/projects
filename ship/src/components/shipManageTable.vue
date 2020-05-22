<template lang='pug'>
  .admin-grow
    .admin-grow_table
        Table(
            border
            :columns="tableHeade"
            :data="list"
            :loading="loading"
            stripe
            @on-selection-change="selectAction"
        )
            .table-btn(
                slot-scope="{ row, index }"
                slot="action"
            )
                Button(size='small' @click="showShipInfo(row)") 详情
    .admin-grow_page
        .total 选择了
            i {{selection.length}}
            | 条
        .pagecontrol
            Page(
                v-if="list.length"
                :total="total"
                :page-size='pageSize'
                :current="pageNumber"
                @on-change="changePage"
            )
            span(v-if='total > 0') 共 {{total}} 条
</template>

<script>
import Api from 'api/api'

export default {
    name: 'ShipManageTables',
    computed: {

    },
    mounted () {

    },
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 1
        },
        pageNumber: {
            type: Number,
            default: 1
        },
        list: {
            type: Array,
            default: function () {
                return []
            }
        },
        tableHeade: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data () {
        return {
            selection: []
        }
    },
    methods: {
        changeSeclectItem (selection) {
            this.$emit('changeSelectItem', selection || this.selection)
        },
        selectAction (selection, row) {
            this.selection = selection
            this.changeSeclectItem()
        },
        resetSeclect () {
            this.selection = []
            this.changeSeclectItem([])
        },
        showShipInfo (row) {
            this.$emit('showShipInfo', row)
        },
        changePage (page) {
            this.$emit('pageChanged', page)
            this.resetSeclect()
        },
        companyDetails (event, row, index) {
            this.$router.push({
                path: `/admin/company/show/${row.id}`
            })
        }
    }
}
</script>
