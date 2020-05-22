<template lang='pug'>
    .toolbar
        .left(@click="$router.push('/map')")
            .logo
                svgIcon(name="logo",title="")
            .text(v-if='isLogin' ) 渔船救援管理监控
        .center(v-if='isLogin')
            ul
                router-link(
                    :to="{ name: 'map'}"
                    tag="li"
                    active-class="active"
                ) 实时监控

                router-link(
                    :to="{ name: 'ship'}"
                    tag="li"
                    active-class="active"
                ) 船舶管理
        .right(v-if='isLogin && getUserInfo')
            .userArea
                Dropdown
                    .userArea-box
                        span {{getUserInfo.userName || getUserInfo.userDefinedName}}
                        template(v-if="getUserInfo.headimgurl")
                            img(:src="getUserInfo.headimgurl", :alt="getUserInfo.userName")
                        template(v-else)
                            img(:src="userImg")
                    DropdownMenu(slot="list")
                        DropdownItem
                            div(@click="logout" class='item')
                                svgIcon(name="quit",title="退出")
                                span 退出登录

</template>

<script>
import { mapGetters } from 'vuex'
import userImg from 'img/defaultimg.jpg'
export default {
    name: 'ToolBar',
    data () {
        return {
            userImg: userImg
        }
    },
    computed: {
        ...mapGetters('user', ['getUserInfo']),
        isLogin () {
            return this.type === 'in'
        }

    },
    props: {
        type: {
            type: String,
            default: 'out'
        }
    },
    methods: {
        logout () {
            this.$storage.clear()
            this.$router.push({ name: 'login' })
        }
    }

}
</script>

<style lang='stylus'>
    @import '../stylus/components/toolbar.styl';
</style>
