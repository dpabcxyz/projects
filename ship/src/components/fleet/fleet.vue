<template lang="pug">
    .ship-fleet
        .topbar
            span 共{{fleetLength}}艘
            span 全选
                Checkbox(v-model='selectAll' @click.native="selectGroupAll")
        .ship-fleet_list()
            ScrollBar(ref="fleetScroll")
                .fleetScroll
                    ul(v-for="(item,index) in fleet" :key="index" :class="[{drawer: index === 0}]" )
                        .groupName
                            span(@click.capture="slider($event)")
                                svgIcon(name="unfold")
                                | {{item.groupName}}
                            span
                                i(@click.stop="changeGroupName(index)" v-if="!/(默认分组|Default Group)/.test(item.groupName) && false")
                                    svgIcon(name="edit")
                                i
                                    Checkbox(v-model='item.checked' @click.native="toggleFleetGroup(item.groupName)")
                        ul()
                            li(v-for="(ship,shipindex) in item.children" :key="'ship'+ shipindex" )
                                span(@click="openShipInfoView(ship.mmsi)") {{`${ship.shipName} (${ship.mmsi})` }}
                                span
                                    Checkbox(v-model='ship.checked' @click.native="changeFleetItemAction(ship)")

</template>

<script>
// import Api from 'api/api'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Fleet',
    props: {

    },
    data () {
        return {
            selectAll: true,
            tmpGroupName: ''
        }
    },
    mounted () {
        this.toggleSelectAll()
    },
    watch: {
        selectAll: 'selectGroupAll'
    },
    computed: {
        ...mapGetters(['language']),
        ...mapGetters('user', ['userId']),
        ...mapGetters('shipView', ['showShipInfoView']),
        ...mapGetters('fleet', ['fleet', 'fleetLength'])
    },
    methods: {
        ...mapActions('shipView', ['openShipInfoView']),
        ...mapActions('map', ['addAllShipLayers', 'addShipLayer', 'removeShipLayer', 'clearShipLayers']),
        ...mapActions('fleet', ['changeFleetItem', 'toggleFleetGroup', 'renameGroup', 'toggleFleetShip']),
        changeFleetItemAction (ship) {
            ship.checked = !ship.checked
            this.changeFleetItem(ship)
        },
        selectItem (mmsi, value) {
            if (value) {
                this.addShipLayer(mmsi)
            } else {
                this.removeShipLayer(mmsi)
            }
        },
        toggleSelectGroup (item) {
            let { checked, children } = item

            children.forEach((child) => {
                child.checked = checked
                checked ? this.addShipLayer(child.mmsi) : this.removeShipLayer(child.mmsi)
            })
        },
        selectGroupAll () {
            var checked = this.selectAll

            this.fleet.forEach((item) => {
                item.checked = checked
                if (item.children) {
                    item.children.forEach((child) => {
                        child.checked = checked
                    })
                }
            })
            this.toggleSelectAll()
        },
        toggleSelectAll () {
            if (this.selectAll) {
                this.addAllShipLayers()
            } else {
                this.clearShipLayers()
            }
        },
        changeGroupName (index) {
            // 修改组名
            var self = this
            this.tmpGroupName = this.fleet[index].groupName
            this.$Modal.confirm({
                title: '修改组名称',
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: this.tmpGroupName,
                            autofocus: true,
                            placeholder: '请输入组名称'
                        },
                        on: {
                            input: (val) => {
                                this.tmpGroupName = val
                            }
                        }
                    })
                },
                onOk () {
                    var payload = {
                        name: self.tmpGroupName,
                        index: index
                    }
                    self.renameGroup(payload)
                    self.tmpGroupName = ''
                }
            })
        },
        slider (e) {
            // debugger
            let current = e.currentTarget
            current.parentNode.parentNode.classList.toggle('drawer')
            this.$refs.fleetScroll.update()
        }
    }

}
</script>

<style lang='stylus'>
    @import '../../stylus/components/fleet.styl';
</style>
