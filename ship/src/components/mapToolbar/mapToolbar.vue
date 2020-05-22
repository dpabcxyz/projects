<template lang='pug'>
    .ls-map-toolbar
        .bar
            .bar-item(
                @click="openReminder"
                toolItem="reminder"
            )
                svgIcon(name="warning",title="")
                | 预警
            //-.bar-item
                svgIcon(name="met",title="")
                | 气象
            .bar-item(
                toolItem="typhoon"
                @click="toggleTyphoon"
            )
                svgIcon(name="typhoon",title="")
                | 台风
        .content
            Reminder
            Typhoon(:displayTyphoon="displayTyphoon")
</template>

<script>
import Reminder from './reminder.vue'
import Typhoon from './typhoon.vue'
import Bus from 'plugins/eventBus'
let toolbarItem = [{
    name: '预警',
    codeKey: 'reminder',
    icon: 'warning'
}, {
    name: '气象',
    codeKey: 'weahter',
    icon: 'met'
}, {
    name: '台风',
    codeKey: 'typhoon',
    icon: 'typhoon'
}]

let openItem = ['reminder', 'typhoon']
function getItemConfig () {
    return toolbarItem.filter((item) => openItem.includes(item.codeKey))
}

var option = getItemConfig()
export default {
    name: 'MapToolbar',
    data () {
        return {
            toolbarItem: option,
            displayTyphoon: false
        }
    },

    methods: {
        openReminder () {
            Bus.$emit('toggelReminder')
        },
        toggleTyphoon () {
            this.displayTyphoon = !this.displayTyphoon
        }

    },
    components: { Reminder, Typhoon }

}
</script>

<style lang='stylus'>
    @import '../../stylus/components/maptoolbar.styl';
</style>
