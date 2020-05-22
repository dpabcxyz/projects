<template lang='pug'>
    .ship-group-select
        Select(
            v-model='shipGroupSelect'
            :loading='loading'
            placeholder='编辑分组'
            filterable
            @on-change="saveShipGroup"
        )
            Option(
                v-for='item in shipGroup'
                :value='item.id'
                :key='item.id'
            ) {{ item.groupName ?  item.groupName : item.id }}
            Button(class="createButton" icon="md-add" @click='showModal = true') 新建分组

        Modal(
            v-model="showModal"
            class="greateGroupModal"
            title="新建分组"
            width='300'
            footer-hide
            @on-visible-change="inputOnFouce"
        )
            .createGroup
                label
                    span 分组名称:
                        Input(
                            ref="inputOnFocus"
                            v-model="createGroup.groupName"
                            placeholder= '请输入分组名称'
                            style="width: 160px;margin-left: 10px"
                        )
                label
                    span 分组颜色:
                        ColorPicker(
                            v-model='createGroup.colorValue'
                            style="margin-left: 10px;"
                        )
            .btns
                Button(@click='cancelSaveGroup') 取消
                Button(type='primary' @click="saveGroup") 确定
</template>

<script>
import Api from 'api/api'
import { mapGetters } from 'vuex'

export default {
    name: 'Group',
    computed: {
        ...mapGetters('user', ['userId']),
        ...mapGetters(['language'])
    },
    data () {
        return {
            shipGroupSelect: '',
            createGroup: {
                groupName: '',
                colorValue: ''
            },
            shipGroup: [],
            loading: false,
            width: 180,
            showModal: false
        }
    },

    mounted () {
        this.getShipGroup()
    },
    methods: {
        inputOnFouce () {
            setTimeout(() => {
                this.$refs.inputOnFocus.focus()
            }, 0)
        },
        saveGroup () {
            if (!this.createGroup.groupName) {
                this.$Notice.warning({
                    title: '分组名称不能为空'
                })
                return false
            }
            this.creatgroup()
        },
        cancelSaveGroup () {
            this.createGroup.groupName = ''
            this.createGroup.colorValue = ''
            this.showModal = false
        },
        creatgroup (query) {
            // 创建组

            var data = {
                method: 'post',
                url: Api.addGroup,
                data: {
                    userId: this.userId,
                    colorValue: this.createGroup.colorValue,
                    name: this.createGroup.groupName
                }
            }
            this.$restFull(data).then((res) => {
                var transform = {
                    id: res.id,
                    groupName: res.name
                }
                this.shipGroup.unshift(transform)
                this.createGroupName = ''
                this.shipGroupSelect = transform.groupName
                this.showModal = false
            })
        },
        getShipGroup () {
            var data = {
                method: 'get',
                url: Api.groups,
                jointData: {
                    userId: this.userId
                }
            }
            this.$restFull(data).then((res) => {
                this.shipGroup = res
            })
        },
        _filterShipGroup (id) {
            for (let i = 0; i < this.shipGroup.length; i++) {
                const element = this.shipGroup[i]
                if (element.id === id) {
                    return element
                }
            }
        },
        saveShipGroup (select) {
            var group = this._filterShipGroup(select)
            this.$emit('saveShipGroup', group)
        }
    }
}
</script>
<style lang="stylus">
.ship-group-select
    .ivu-select
        position relative
.greateGroupModal
    .btns
        text-align right
        padding-top:10px;
        button
            margin-left: 10px;
</style>
