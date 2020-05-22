<template lang='pug'>
    .admin_statistics
        .admin_statistics-title 运营数据统计
        <Divider />

        .stats_area
            .stats_area_search
                .stats_area_search-item
                    span.pr10 IMEI
                    Input(
                        v-model="IMEI"
                        placeholder="请输入IMEI"
                        clearable
                        style="width: 130px"
                    )
                .stats_area_search-item
                    span.pr10 日期选择
                    DatePicker(
                        type="date"
                        placeholder="选择开始时间"
                        :value='startTime'
                        @on-change="getStartTime"
                    )
                    .split-icon -
                    DatePicker(
                        type="date"
                        placeholder="结束时间"
                        :value='endTime'
                        @on-change="getEndTime"
                    )
                    span.pr10
                    Button(
                        type="primary"
                        @click="search"
                    ) 查询
            .stats_area_export
                Row(
                    type="flex"
                    justify="space-between"
                )
                    Col 总数:
                        span {{this.total}}
                    Col()
                        Button(
                            type="info"
                            @click="output"
                        ) 导出
            .stats_area_table
                Table(
                    border
                    :columns="tableHeade"
                    :data="list"
                    :loading="loading"
                    :width="tableWidth"
                    :height="tableHeight"
                    stripe
                )
                    template(
                        slot-scope="{ row, index }"
                        slot="action"
                    )
                        Button(type="info" @click="showMore(row, index)") 详情
            .stats_area_page
                Page(
                    v-if='showPage'
                    :total="total"
                    :page-size='20'
                    :current="pageNumber"
                    @on-change="countAllImeisPage"
                )
    </Row>

</template>

<script>
import Api from 'api/api'
import { tableHeader } from 'utils/tableHeader'
import dayjs from 'dayjs'

const listField = [
    {
        key: 'imei',
        sortable: true,
        width: '150'
    },
    {
        key: 'REPORT_WEI_ZONG_NUMBER', // 报位总数
        sortable: true
    },
    {
        key: 'REPORT_MORE_PERSONS_CHATS_NUMER', // 群聊消息总数
        sortable: true
    },
    {
        key: 'REPORT_MORE_TO_MORE_IDIDUM_NUMBER', // 群聊卫星消息数
        sortable: true
    },
    {
        key: 'REPORT_MORE_TO_MORE_IDIDUM_BYTES', // 群聊卫星字节数
        sortable: true
    },
    {
        key: 'REPORT_IRIDUM_ONE_TO_ONE_NUMBER', // 单聊卫星消息数
        sortable: true
    },
    {
        key: 'REPORT_ONE_TO_ONE_BYTES', // 单聊卫星字节数
        sortable: true
    },
    {
        key: 'REPORT_IRIDUM_SHIPS_TOTAL_NUMBER', // 卫星船位报数
        sortable: true
    },
    {
        key: 'REPORT_IRIDUM_SHIPS_TOTAL_BYTES', // 船位报字节数
        sortable: true
    },
    {
        key: 'REPORT_IRIDUM_REPORT_TOTAL_NUMBER', // 卫星报告数
        sortable: true
    },
    {
        key: 'REPORT_IRIDUM_REPORT_TOTAL_NUMBER', // 卫星报告数
        sortable: true
    },
    {
        key: 'ACTION',
        title: '操作',
        slot: 'action'
    }
]
const endTime = dayjs().format('YYYY-MM-DD')
const startTime = dayjs(endTime).subtract(7, 'day').format('YYYY-MM-DD')
const tableHeade = tableHeader(listField)

export default {
    name: 'statistics',
    computed: {
        showPage () {
            return this.list.length > 0
        }
    },
    mounted () {
        this.getTableArea()
        this.search()
    },
    data () {
        return {
            IMEI: null,
            startTime: startTime,
            loading: false,
            endTime: endTime,
            pageNumber: 1,
            total: 0,
            list: [],
            tableHeade: tableHeade,
            tableWidth: null,
            tableHeight: null
        }
    },
    methods: {
        getTableArea () {
            var table = document.querySelector('.admin_statis_info-table')
            if (table) {
                this.tableWidth = table.offsetWidth
                this.tableHeight = table.offsetHeight
            }
        },
        search () {
            if (!this.startTime || !this.endTime) {
                this.$Notice.error({
                    title: '请输入查询时间区间'
                })
                return
            }

            this.countAllImeisPage()
        },
        getStartTime (date) {
            if (!date) return null
            this.startTime = date
        },
        getEndTime (date) {
            if (!date) return null
            this.endTime = date
        },
        countAllImeisPage (pageNumber) {
            var params = {
                start: this.startTime,
                end: this.endTime,
                pageNumber: pageNumber || this.pageNumber,
                pageSize: 10
            }
            if (this.IMEI) {
                params.imei = this.IMEI
            }
            this.loading = true
            this.$axios.get(Api.countAllImeisPage, {
                params: params
            }).then(res => {
                var { total, pageNumber, list } = res
                this.$nextTick(() => {
                    this.total = total
                    this.pageNumber = pageNumber
                    this.list = list
                    this.loading = false
                })
            }).catch(error => {
                console.log(error)
                this.$Notice.error({
                    title: '没有获取到数据'
                })
                this.loading = false
            })
        },
        output () {
            var params = {
                start: this.startTime,
                end: this.endTime
            }

            if (this.IMEI) {
                params.imei = this.IMEI
            }

            var url = Api.reportExcelList + '?'
            url += this.$qs.stringify(params)
            console.log(url)
            window.open(url)
        },
        showMore (row, index) {
            this.$router.push({ path: 'statistics/' + row.imei })
        }
    }
}
</script>
