<template lang='pug'>
    div(
        class="scrollbar__holder ps-container"
        :class="['ps-theme-'+theme]"
        ref="content"
    )
        slot
</template>

<script type="text/javascript">
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export default {
    name: 'Scrollbar',

    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        wheelSpeed: {
            type: Number,
            default: 1
        },
        wheelPropagation: {
            type: Boolean,
            default: false
        },
        swipePropagation: {
            type: Boolean,
            default: true
        },
        minScrollbarLength: {
            type: Number,
            default: 20
        },
        maxScrollbarLength: Number,
        useBothWheelAxes: {
            type: Boolean,
            default: false
        },
        suppressScrollX: {
            type: Boolean,
            default: true
        },
        suppressScrollY: {
            type: Boolean,
            default: false
        },
        scrollXMarginOffset: {
            type: Number,
            default: 0
        },
        scrollYMarginOffset: {
            type: Number,
            default: 0
        },
        theme: {
            type: String,
            default: 'light'
        },
        scrollTo: {
            validator: function (value) {
                return !(isNaN(value) && ['top', 'middle', 'bottom'].indexOf(value) === -1)
            }
        },
        autoUpdate: {
            type: Boolean,
            default: true
        }
    },

    data () {
        return {
            Ps: null, // 滚动条实例
            options: [
                'wheelSpeed',
                'wheelPropagation',
                'swipePropagation',
                'minScrollbarLength',
                'maxScrollbarLength',
                'useBothWheelAxes',
                'suppressScrollX',
                'suppressScrollY',
                'scrollXMarginOffset',
                'scrollYMarginOffset',
                'theme'
            ],
            events: [
                {
                    eventName: 'ps-scroll-y',
                    eventFunc: 'onScrollY'
                },
                {
                    eventName: 'ps-scroll-x',
                    eventFunc: 'onScrollX'
                },
                {
                    eventName: 'ps-scroll-up',
                    eventFunc: 'onScrollUp'
                },
                {
                    eventName: 'ps-scroll-down',
                    eventFunc: 'onScrollDown'
                },
                {
                    eventName: 'ps-scroll-left',
                    eventFunc: 'onScrollLeft'
                },
                {
                    eventName: 'ps-scroll-right',
                    eventFunc: 'onScrollRight'
                },
                {
                    eventName: 'ps-y-reach-start',
                    eventFunc: 'onReachStartY'
                },
                {
                    eventName: 'ps-y-reach-end',
                    eventFunc: 'onReachEndY'
                },
                {
                    eventName: 'ps-x-reach-start',
                    eventFunc: 'onReachStartX'
                },
                {
                    eventName: 'ps-x-reach-end',
                    eventFunc: 'onReachEndX'
                }
            ],
            autoUpdateTimeoutRange: 60,
            size: null,
            autoUpdateTimeout: null,
            currentScrollTop: 0
        }
    },

    mounted () {
        this.init()
    },

    beforeDestroy () {
        this.destroy()
    },

    methods: {
        init () {
            this.setHeight()
            this.scrollToPos()
            this.initialize()
            this.setAutoUpdate()
            this.addEvent()
        },

        setHeight () {
            return
            let parentNode = this.$el.parentNode
            let offsetHeight = parentNode.offsetHeight
            let scrollHeight = parentNode.scrollHeight

            if (offsetHeight < scrollHeight) this.$el.style.height = offsetHeight + 'px'
        },

        reset () {
            this.destroy()
            this.initialize()
        },

        initialize () {
            this.Ps = new PerfectScrollbar(this.$el, this.getOptions())
        },

        destroy () {
            this.clearAutoUpdate()
            this.Ps.destroy(this.$el)
        },

        update () {
            this.Ps.update(this.$el)
            this.setAutoUpdate()
        },

        scrollToPos (scrollTop) {
            if (isNaN(scrollTop)) {
                let scrollHeight = this.$el.scrollHeight
                let clientHeight = this.$el.clientHeight

                switch (scrollTop) {
                case 'top':
                    scrollTop = 0
                    break
                case 'middle':
                    scrollTop = scrollHeight > clientHeight ? (scrollHeight - clientHeight) / 2 : 0
                    break
                case 'bottom':
                    scrollTop = scrollHeight
                    break
                }
            }
            this.$el.scrollTop = scrollTop
        },

        getOptions () {
            let currentOptions = {}
            this.options.forEach(option => {
                currentOptions[option] = this[option]
            })
            return currentOptions
        },

        setAutoUpdate () {
            if (this.autoUpdate) {
                this.autoUpdateTimeout = setTimeout(() => {
                    let currentSize = this.getDomSize()

                    if (currentSize !== this.size) {
                        this.size = currentSize
                        this.clearAutoUpdate()
                        this.setHeight()
                        this.update()
                        return
                    }

                    this.setAutoUpdate()
                }, this.autoUpdateTimeoutRange)
            }
        },

        clearAutoUpdate () {
            clearTimeout(this.autoUpdateTimeout)
        },

        getDomSize () {
            return this.$el.scrollHeight + this.$el.scrollWidth + this.$el.offsetHeight + this.$el.offsetWidth
        },

        addEvent () {
            this.events.forEach(event => {
                this.$el.addEventListener(event.eventName, this[event.eventFunc])
            })
        },

        // 获取当前滚动条位置
        getScrollTop () {
            return typeof (this.$el.scrollTop) !== 'undefined' ? this.$el.scrollTop : 0
        },

        // 获取当前滚动条位置
        getScrollLeft () {
            return typeof (this.$el.scrollLeft) !== 'undefined' ? this.$el.scrollLeft : 0
        },

        onScrollY () {
            // console.log('scroll y');
            let scrollTop = this.$el.scrollTop
            if (scrollTop != this.currentScrollTop) {
                this.currentScrollTop = scrollTop
                this.$emit('onScrollY')
            }
        },

        onScrollX () {
            // console.log('scroll x');
            this.$emit('onScrollX')
        },

        onScrollUp () {
            // console.log('scroll Up');
            this.$emit('onScrollUp')
        },

        onScrollDown () {
            // console.log('scroll Down');
            this.$emit('onScrollDown')
        },

        onScrollLeft () {
            // console.log('scroll Left');
            this.$emit('onScrollLeft')
        },

        onScrollRight () {
            // console.log('scroll Right');
            this.$emit('onScrollRight')
        },

        onReachStartY () {
            // console.log('y Reach Start');
            this.$emit('onReachStartY')
        },

        onReachEndY () {
            // console.log('Y Reach End');
            this.$emit('onReachEndY')
        },

        onReachStartX () {
            // console.log('X Reach Start');
            this.$emit('onReachStartX')
        },

        onReachEndX () {
            // console.log('X Reach End');
            this.$emit('onReachEndX')
        }
    },

    watch: {
        disabled () {
            this.reset()
        },

        suppressScrollX () {
            this.reset()
        },

        suppressScrollY () {
            this.reset()
        },

        scrollTo (newVal) {
            this.scrollToPos(newVal)
            this.update()
        }
    }
}
</script>
<style lang="stylus">
.ps-container
    position relative
</style>
