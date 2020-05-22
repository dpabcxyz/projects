<template lang='pug'>
    .login
        ToolBar(type="out")
        .login-area
            .login-area_box
                h1 渔船救援管理监控
                .userlogin(v-if="!forgot")
                    .title  用户登录
                    Form(
                        :model="userData" label-position="top"
                    )
                        FormItem(label="账号")
                            Input(v-model="userData.userName" @on-enter='login' size="large" placeholder="请输入账号")
                        FormItem(label="密码")
                            Input(v-model="userData.pwd" @on-enter='login' password type="password" size="large" placeholder="请输入密码")
                        Button(class='shipbutton' @click="toLoading" size="large" long)
                            span(v-if="!loading") 登录
                            span(v-else) 登录中...

                    .login-area_link()
                        ul
                            li
                                //- 联系我们
                            li
                                a(href="javascript:;" @click="forgot = true") 忘记密码
                .forgot(v-else)
                    .title  忘记密码
                    Form(
                        :model="forgotUserData" label-position="top" autocomplete='off'
                    )
                        FormItem()
                            Input(v-model.trim="forgotUserData.usermobile"  size="large" placeholder="请填写手机号")
                        FormItem()
                            Row(:gutter="5")
                                Col(span='17')
                                    Input(v-model="forgotUserData.validatecode" size="large" placeholder="图形验证码")
                                Col(span='7')
                                    .canvas(@click="getValidateCode")
                                        canvas(
                                            id="myCanvas"
                                            width='96'
                                            height='42'
                                        )
                        FormItem()
                            Row(:gutter="5")
                                Col(span='17')
                                    Input(v-model.trim="forgotUserData.phonecode" size="large" placeholder="请填写手机验证码")
                                Col(span='7' style="text-align:right")
                                    Button(type="primary" size="large" long	:loading='getPhoneCodeloading' :disabled="getPhoneCodeloading" @click="countdownAction")
                                        template(v-if='!getPhoneCodeloading') 点击获取
                                        template(v-else) {{countdown}}秒
                        FormItem()
                            Input(v-model.trim="forgotUserData.password1" type="password" password size="large" placeholder="请填写新密码")
                        FormItem()
                            Input(v-model.trim="forgotUserData.password2" type="password" password size="large" placeholder="请填写确认密码")

                        Button(class='shipbutton' @click="resetUserPassword" size="large" long)
                            span(v-if="!loading") 重置
                            span(v-else) 重置中...
                        .backLogin
                            span(@click='forgot=false') 返回登录

            CopyRight

</template>

<script>
import ToolBar from 'components/toolbar.vue'
import CopyRight from 'components/copyRight.vue'
import Api from 'api/api'
import { mapGetters, mapMutations } from 'vuex'
// import { Base64 } from 'js-base64'

const countdown = 60

export default {
    name: 'login',
    data () {
        return {
            loading: false,
            userData: {
                userName: process.env.NODE_ENV === 'production' ? '' : '13700000001',
                pwd: process.env.NODE_ENV === 'production' ? '' : '123456'
            },
            forgotUserData: {
                usermobile: '',
                password1: '',
                password2: '',
                phonecode: '',
                validatecode: ''
            },
            countdown: countdown,
            forgot: false,
            getPhoneCodeloading: false

        }
    },
    mounted () {
        // this.getValidateCode()
    },
    computed: {
        ...mapGetters('user', [
            'getUserInfo'
        ])
    },
    watch: {
        forgot: function (val, oldVal) {
            if (val) {
                this.getValidateCode()
            }
        }
    },
    methods: {
        ...mapMutations('user', ['setUserInfo']),
        createVCode (code) {
            var codeLength = 4// 验证码的长度，可变
            var canvas = document.getElementById('myCanvas')// 获取画布

            if (canvas) {
                var ctx = canvas.getContext('2d')
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, 92, 40)
                ctx.font = '20px arial'
                // 创建渐变
                var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
                gradient.addColorStop('0', 'magenta')
                gradient.addColorStop('0.5', 'blue')
                gradient.addColorStop('1.0', 'red')
                // 用渐变填色
                ctx.strokeStyle = gradient
                ctx.strokeText(code, 20, 28)// 画布上添加验证码
            }
        },
        randomTxt () {
            return 'a' + Math.floor(Math.random() * 10)
        },
        toLoading () {
            this.loading = true
            this.login()
        },
        countdownAction () {
            if (this.forgotUserData.usermobile.length !== 11) {
                this.$Notice.error({
                    title: '请输入正确的手机号'
                })
                return
            }

            if (this.forgotUserData.validatecode === '') {
                this.$Notice.error({
                    title: '请输入图形验证码'
                })
                return
            }

            if (!this.getPhoneCodeloading) {
                this.getPasswordCodeValue()
            }
            this.getPhoneCodeloading = true
            let fn = setInterval(() => {
                if (this.countdown <= 1) {
                    clearInterval(fn)
                    this.getPhoneCodeloading = false
                    this.countdown = countdown
                    return
                }
                this.countdown--
            }, 1000)
        },
        getPasswordCodeValue () {
            var params = {
                method: 'GET',
                url: Api.getPasswordCodeValue,
                params: {
                    usermobile: this.forgotUserData.usermobile,
                    validatecode: this.forgotUserData.validatecode,
                    validatenum: this.forgotUserData.phonecodeImg
                }
            }
            this.$restFull(params).then((res) => {

            })
        },
        async resetUserPassword () {
            if (!this.forgotUserData.password1 || !this.forgotUserData.password2 || !this.forgotUserData.phonecode || !this.forgotUserData.usermobile) {
                this.$Notice.warning({
                    title: '请填写相关的项'
                })
                return
            }
            let password1, password2
            if (window.btoa) { // window.btoa
                password1 = window.btoa(this.forgotUserData.password1)
                password2 = window.btoa(this.forgotUserData.password2)
            } else {
                await import('js-base64').then(({ Base64 }) => {
                    password1 = Base64.encode(this.forgotUserData.password1)
                    password2 = Base64.encode(this.forgotUserData.password2)
                })
            }
            var params = {
                method: 'GET',
                url: Api.resetUserPassword,
                params: {
                    password1,
                    password2,
                    phonecode: this.forgotUserData.phonecode,
                    usermobile: this.forgotUserData.usermobile
                }
            }
            this.$restFull(params).then((res) => {
                console.log(res)

                this.$Notice.success({
                    title: '更改成功,亲重新登录'
                })
                this.forgot = false
            })
        },
        getValidateCode () {
            // console.log(1)

            var params = {
                method: 'GET',
                url: Api.getValidateCode
            }
            this.$restFull(params).then((res) => {
                if (!res) return
                this.forgotUserData.phonecodeImg = res
                let code = res.split('_')
                code = code[1].split(',')
                this.createVCode(code.join(''))
            })
        },
        async login () {
            if (!this.userData.userName || !this.userData.pw) {
                this.loading = false
            }
            let pwd
            if (window.btoa) { // window.btoa
                pwd = window.btoa(this.userData.pwd)
            } else {
                await import('js-base64').then(({ Base64 }) => {
                    pwd = Base64.encode(this.userData.pwd)
                })
            }

            var data = {
                'userName': this.userData.userName,
                pwd
            }
            data = this.$qs.stringify(data)
            this.$axios
                .post(Api.login, data)
                .then(res => {
                    if (res) {
                        this.$nextTick(() => {
                            this.setUserInfo(res)
                            this.$router.push({ path: '/map' })
                        })
                    }
                })
        }
    },
    components: {
        ToolBar,
        CopyRight
    }
}
</script>
