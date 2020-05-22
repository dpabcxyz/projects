<template lang="pug">
    #companyManage
        .admin-bread
            Breadcrumb
                BreadcrumbItem(
                    to="/admin"
                ) admin
                BreadcrumbItem(
                    to="/admin/company"
                ) 企业管理
                BreadcrumbItem(
                    v-if="$route.params.ActionType=== 'add'"
                ) 新增企业
                BreadcrumbItem(
                    v-if="$route.params.ActionType=== 'edit'"
                ) 编辑企业
                BreadcrumbItem(
                    v-if="$route.params.ActionType=== 'show'"
                ) 查看企业详情
        Divider
        .admin-area
            .search_box

            .search_box
                Button(
                    v-if="$route.params.ActionType === 'edit'"
                    type="primary"
                    class="search_btn"
                    @click="updateFrom"
                ) 保存
                Button(
                    v-if="$route.params.ActionType === 'show'"
                    type="primary"
                    class="search_btn"
                    @click="editFrom"
                ) 编辑
                Button(
                    type="info"
                    class="search_btn"
                    to='/admin/company/add'
                ) 新增

        Form(
                class="comanyFrom" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100"
            )
            .admin-title2
                .text
                    span 基本信息
            .admin-area
                    Row()
                        Col(span="8")
                            FormItem(label="企业名称" prop="companyName")
                                Input(
                                    v-model="formValidate.companyName"
                                    placeholder="企业名称"
                                    :disabled="!disabledInput"
                                )
                        Col(span="8")
                            FormItem(label="联系电话" prop="serviceMobile")
                                Input(
                                    v-model="formValidate.serviceMobile"
                                    placeholder="联系电话"
                                    :disabled="!disabledInput"
                                )
                        Col(span="8")
                            FormItem(label="联系人" prop="contact")
                                Input(
                                    v-model="formValidate.contact"
                                    placeholder="请输入联系人"
                                    :disabled="!disabledInput"
                                )
            .admin-title2
                .text
                    span 管理员信息
            .admin-area
                    Row()
                        Col(span="8")
                            FormItem(label="管理员手机" prop="phone")
                                Input(
                                    v-model="formValidate.phone"
                                    placeholder="管理员手机"
                                    :disabled="!disabledInput"
                                )
                        Col(span="8")
                            FormItem(label="管理员名称" prop="userName")
                                Input(
                                    v-model="formValidate.userName"
                                    placeholder="请输入管理员名称"
                                    :disabled="!disabledInput"
                                )
                        Col(span="8")
                            FormItem(label="管理员邮箱" prop="email")
                                Input(
                                    v-model="formValidate.email"
                                    placeholder="请输入管理员邮箱"
                                    :disabled="!disabledInput"
                                )
            .admin-title2
                .text
                    span 管理员权限
            .admin-area
                    Row()
                        Col(span="8")
                            FormItem(label="员工账号数量" prop="usernumber")
                                Input(
                                    v-model="formValidate.usernumber"
                                    placeholder="员工账号数量"
                                    :disabled="!inEdit"
                                )
                        Col(span="8")
                            FormItem(label="关注船舶上限" prop="shipcount")
                                Input(
                                    v-model="formValidate.shipcount"
                                    placeholder="关注船舶上限"
                                    :disabled="!inEdit"
                                )

            companyTable(
                :table-heade="tableHeade"
                :list="list"
                :total="total"
                :page-size='20'
                :page-number="pageNumber"
                :loading="loading"
                @pageChanged="getCompanyList"
            )
</template>

<script>
import Api from 'api/api'
import companyTable from './company-table'
import { COMPANY_HEADER } from './companyTableHeader'
export default {
    name: 'companyManageAction',
    components: {
        companyTable
    },
    computed: {
        disabledInput () {
            return this.$route.params.ActionType === 'show'
        }

    },
    watch: {
        $route (to, from) {
            console.log(to, from)
        // to , from 分别表示从哪跳转到哪，都是一个对象
        // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
        }
    },
    mounted () {
        this.runAction()
    },
    data () {
        return {
            companyId: '',
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
            total: 0,
            formValidate: {
                companyName: '', // 企业名称
                serviceMobile: '', // 联系电话
                contact: '', // 联系人
                phone: '', // 管理员手机
                userName: '', // 管理员名称
                email: '', // 管理员邮箱
                usernumber: '', // 员工账号数量
                shipcount: '' // 关注船舶上限
            },
            ruleValidate: {
                companyName: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                serviceMobile: [
                    { message: '请输入联系电话', trigger: 'change' }
                ],
                contact: [
                    { message: '请输入联系人', trigger: 'change' }
                ],
                phone: [
                    { required: true, message: '管理员手机', trigger: 'change' }
                ],
                userName: [
                    { required: true, message: '请输入管理员名称', trigger: 'blur' }
                ],
                mail: [
                    { required: true, message: '管理员邮箱不能为空', trigger: 'blur' },
                    { required: true, type: 'email', message: '请输入管理员名称', trigger: 'blur' }
                ],
                usernumber: [
                    { required: true, message: '员工账号数量', trigger: 'blur' }
                ],
                shipcount: [
                    { required: true, message: '关注船舶数量', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        editFrom () {
            this.$router.push({ path: `/admin/company/edit/${this.companyId}` })
        },
        updateFrom () {
            this.add(null, this.$route.params.companyId)
        },
        search () {
            this.getCompanyList(1)
        },
        resetFrom () {
            this.formValidate.companyName = ''
            this.formValidate.serviceMobile = ''
            this.formValidate.contact = ''
            this.formValidate.phone = ''
            this.formValidate.userName = ''
            this.formValidate.email = ''
            this.formValidate.usernumber = ''
            this.formValidate.shipcount = ''
        },
        add (event, companyId) {
            var params = {
                locale: 'zh'
            }
            if (this.$route.params.ActionType === 'edit') {
                params.id = companyId
                this.companyId = companyId
            }
            var _self = this
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    _self.$restFull({
                        method: 'POST',
                        url: Api.companyAdd,
                        jointData: {
                            companyName: _self.formValidate.companyName,
                            serviceMobile: _self.formValidate.serviceMobile,
                            contact: _self.formValidate.contact,
                            phone: _self.formValidate.phone,
                            userName: _self.formValidate.userName,
                            email: _self.formValidate.email,
                            usernumber: _self.formValidate.usernumber,
                            shipcount: _self.formValidate.shipcount
                        },
                        data: params
                    }).then((res) => {
                        console.log(res)

                        // _self.$Message.success('Success!')
                    })
                } else {
                    _self.$Message.error('规范填写数据!')
                }
            })
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
        },
        companyDetails (row, index) {
            console.log(row)
            console.log('查看')
        },
        getCompanyDetails (companyId) {
            if (!companyId && !this.companyId) return
            var params = {}
            this.$restFull({
                method: 'GET',
                url: Api.companyDetails,
                jointData: {
                    companyId: companyId
                },
                data: params
            }).then((res) => {
                this.$nextTick(() => {
                    let { adminEmail, adminMobile, phone, contact, companyName, adminName, shipcount, usersCount, shipsDTOS } = res

                    this.companyId = companyId

                    this.formValidate.companyName = companyName
                    this.formValidate.serviceMobile = adminMobile
                    this.formValidate.contact = contact
                    this.formValidate.phone = phone
                    this.formValidate.userName = adminName
                    this.formValidate.email = adminEmail
                    this.formValidate.usernumber = usersCount
                    this.formValidate.shipcount = shipsDTOS.toString()
                })
            })
        },
        runAction () {
            if (!this.$route.params.ActionType) return
            switch (this.$route.params.ActionType) {
            case 'add':
                this.resetFrom()
                break
            case 'edit':
                this.$route.params.companyId && this.getCompanyDetails(this.$route.params.companyId)
                break
            case 'show':
                this.$route.params.companyId && this.getCompanyDetails(this.$route.params.companyId)
                break
            default:
                break
            }
        },
        showCompanyDetail () {
            console.log(1)
            console.log(this.$route)
            this.$router.push({ path: `/admin/company/show/{$row.id}` })
        }
    }
}
</script>

<style>

</style>
