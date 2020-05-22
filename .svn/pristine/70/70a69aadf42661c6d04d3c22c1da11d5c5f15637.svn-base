<template lang='pug'>
    .admin_statis_info
        .admin_statistics-title 数据详情
        <Divider />
        .admin_statis_info-data
            .info-title 基本信息
            .info-area
                ul
                    li
                        span IMEI:
                        | {{$route.params.imei}}
                    li
                        span 绑定船舶:
                        i(@click='bindHistory') 绑定记录
                    li
                        span 所属公司:
                        //- | {{shipinfo}}
        .admin_statis_info-data
            .info-title 数据统计
            .info-area
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
                Button(
                    type="primary"
                    @click="search"
                ) 查询
                Button(
                    type="info"
                    @click="output"
                ) 导出
        .admin_statis_info-data
            .total 总数:
                span {{tableData.length}}
        .admin_statis_info-table
            Table(
                :width="tableWidth"
                :height="tableHeight"
                :columns="tableHeade"
                :data="tableData"
                :loading="loading"
                border
                stripe
            )
                template(
                    slot-scope="{ row, index }"
                    slot="action"
                )
                    Button(type="info" @click="showMore(row, index)") 详情
        Modal(
            v-model="toggleBindHistory"
            title="绑定记录"
            width="80"
        )
            Table(
                :columns="shipBindHistoryTableHeade"
                :data="bindHistoryList"
                border
                stripe
            )

</template>

<script>
import Api from 'api/api'
import { getHeader } from 'utils/tableHeader'
import dayjs from 'dayjs'

const endTime = dayjs().format('YYYY-MM-DD')
const startTime = dayjs(endTime)
    .subtract(7, 'day')
    .format('YYYY-MM-DD')
const minWidth = 110

const shipBindHistoryTableHeade = [
    {
        title: '时间',
        key: 'update_time'
    }, {
        title: '状态',
        key: 'status'
    }, {
        title: '船舶',
        key: 'name_en'
    }, {
        title: 'mmsi',
        key: 'mmsi'
    }, {
        title: '公司',
        key: ''
    }

]
export default {
    name: 'StatisticsInfo',
    computed: {
        showPage () {
            return this.list.length > 0
        }
    },
    data () {
        return {
            toggleBindHistory: false,
            IMEI: null,
            startTime: startTime,
            loading: false,
            endTime: endTime,
            pageNumber: 1,
            total: 0,
            list: [],
            dataCount: {},
            shipInfo: {},
            tableHeade: [],
            tableData: [],
            tableWidth: null,
            tableHeight: null,
            bindHistoryList: [],
            shipBindHistoryTableHeade: shipBindHistoryTableHeade
        }
    },
    created () {

    },
    mounted () {
        this.getTableArea()
        if (this.$route.params.imei) {
            this.oneImeiDaysDetail(this.$route.params.imei)
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
            this.oneImeiDaysDetail(this.$route.params.imei)
        },
        getStartTime (date) {
            if (!date) return null
            this.startTime = date
        },
        getEndTime (date) {
            if (!date) return null
            this.endTime = date
        },
        oneImeiDaysDetail (imei) {
            var params = {
                start: this.startTime,
                end: this.endTime,
                imei: imei
            }

            this.$axios
                .get(Api.oneImeiDaysDetail, {
                    params: params
                })
                .then(res => {
                    this.$nextTick(() => {
                        this.shipInfo = res.shipInfo
                        this.dataCount = res.dataCount
                        this.tableHeade = this.getTableField(this.dataCount)
                        this.tableData = this.getTableData(this.dataCount)
                    })
                })
                .catch(error => {
                    console.log(error)
                    this.$Notice.error({
                        title: '没有获取到数据'
                    })
                })
        },
        output () {
            var params = {
                start: this.startTime,
                end: this.endTime
            }
            if (this.$route.params.imei) {
                params.imei = this.$route.params.imei
            }

            var url = Api.reportExcelDetails + '?'
            url += this.$qs.stringify(params)

            window.open(url)
        },
        download (data) {
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', 'excel.xlsx')

            document.body.appendChild(link)
            link.click()
        },
        getTableData (data) {
            var array = []
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key]
                    let total = 0
                    let obj = {
                        totalField: getHeader(key),
                        total: total
                    }
                    element.forEach(item => {
                        obj = { ...obj, ...item }
                    })

                    array.push(obj)
                }
            }

            return array
        },
        getTableField (data) {
            if (data.length === 0) return
            let array = []
            let columns = []
            let flag = false
            array.push({
                key: 'totalField',
                title: '统计项',
                fixed: 'left',
                width: 160,
                tooltip: true,
                minWidth: minWidth
            })
            array.push({
                key: 'total',
                title: '总数',
                tooltip: true,
                minWidth: minWidth,
                align: 'center'
            })
            for (const key in data) {
                const element = data[key]
                if (flag === false) {
                    element.forEach(item => {
                        if (Object.prototype.toString.call(item) === '[object Object]') {
                            for (const itemKey in item) {
                                columns.push({
                                    key: itemKey,
                                    title: itemKey,
                                    tooltip: true,
                                    minWidth: minWidth,
                                    align: 'center'
                                })
                            }
                        }
                    })
                    flag = true
                } else {
                    break
                }
            }
            return array.concat(columns)
        },
        bindHistory () {
            if (!this.$route.params.imei) return

            this.$axios
                .get(Api.getHistoryBingByImei, {
                    params: {
                        imei: this.$route.params.imei
                    }
                })
                .then(res => {
                    this.$nextTick(() => {
                        if (res.length > 10) {
                            res.length = 10
                        }
                        this.bindHistoryList = res
                        this.toggleBindHistory = true
                    })
                })
                .catch(error => {
                    console.log(error)
                    this.$Notice.error({
                        title: '没有获取到数据'
                    })
                })
        }
    }
}
</script>
