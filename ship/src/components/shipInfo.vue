<template lang='pug'>
    .ship
        .ship-area
            .ship-area_shipname
                span {{shipMessage.name}}（ ID：{{shipMessage.mmsi}}）
                svgIcon(name="edit" v-if="editing")
            .ship-area_shipinfo
                .shipinfo
                    .shipimgs
                    .shiplist
                        .title
                            span 航行信息
                        ul
                            li 状态：{{shipMessage.ship_status | shipStatus}}
                            li 经度：{{shipMessage.lon | formatLng}}
                            li.wrap
                            li 航速(kn)：{{shipMessage.speed}}
                            li 纬度：{{shipMessage.lat | formatLat}}
                            li.wrap
                            //- li 航艏向：{{shipMessage.heading}}
                            li 航迹向：{{shipMessage.course}}
                            li 更新时间：
                                template(v-if="shipMessage.pos_time")
                                    | {{shipMessage.pos_time | formatTime }}（
                                    Time(:time="shipMessage.pos_time*1000")
                                    | ）
                .shipinfo
                    .shipimgs
                        .shipimg(v-if="shipArchives.shipPictures" @click="openCarousel(shipArchives.shipPictures)")
                            img(:src="filterPic(shipArchives.shipPictures)", alt="alt")
                    .shiplist
                        .title
                            span 船舶档案
                            svgIcon(name="edit" v-if="editing")
                        ul
                            li 船舶材质：{{shipArchives.shipMaterialQuality}}
                            li 总吨位(t)：{{shipArchives.tonnage}}
                            li.wrap
                            li 船长(m)：{{shipArchives.shipLength}}
                            li 船舶建造日期：{{shipArchives.buildTime}}
                            li.wrap
                            li 船宽(m)：{{shipArchives.shipWide}}
                            li 造船地点：{{shipArchives.buildAddress}}
                            li.wrap
                            li 功率(kw)：{{shipArchives.shipPower}}
                            li 造船厂名：{{shipArchives.buildFactoryName}}

                .shipinfo
                    .shipimgs
                    .shiplist
                        .title
                            span 设备信息
                        ul
                            li 设备型号：{{deviceInfo.deviceSn}}
                            li 设备编号：{{deviceInfo.deviceId}}

                .shipinfo
                    .shipimgs
                        .shipimg(v-if="shipOwnerInfo.ownerPictures" @click="openCarousel(shipOwnerInfo.ownerPictures)")
                            img(:src="filterPic(shipOwnerInfo.ownerPictures)", alt="alt")
                    .shiplist
                        .title
                            span 船舶所有人
                            svgIcon(name="edit" v-if="editing")
                        ul
                            li 经理：{{shipArchives.shipOwner}}
                            li 经理手机号：{{shipArchives.shipOwnerPhone}}
                            li.wrap
                            li 紧急联系人：{{shipOwnerInfo.ownerName}}
                            li 紧急联系人手机号：{{shipOwnerInfo.ownerMobile}}
                            li.wrap
                            li 卫星电话：{{shipArchives.satellitePhone}}
                            li 无线电呼号：{{shipArchives.callSign}}

                .shipinfo
                    .shipimgs
                    .shiplist
                        .title
                            span 其他
                            svgIcon(name="edit" v-if="editing")
                        ul
                            li 所在分组：{{shipsGroupDTO.groupName}}
        Carousel(
            v-model="picsIndex"
            v-if="showPics"
            class="carousel"
        )
            CarouselItem(v-for="index in pics")
                .carousel-item
                    img(:src="index", alt="alt")
        Icon(
            class="car-close"
            type="md-close"
            @click="showPics = false"
            size="30"
            v-if="showPics"
        )
        copyRight(class="shipinfo_copy")
</template>

<script>
import copyRight from 'components/copyRight'
import Api from 'api/api'
import { mapGetters } from 'vuex'

export default {
    name: 'shipInfo',
    components: {
        copyRight
    },
    computed: {
        ...mapGetters('user', ['userId'])
    },
    data () {
        return {
            deviceInfo: {},
            shipArchives: {},
            shipMessage: {},
            shipOwnerInfo: {},
            shipsGroupDTO: {},
            editing: false,
            pics: [],
            picsIndex: 0,
            showPics: false
        }
    },
    mounted () {
        this.getShipDetails()
    },
    watch: {
        '$route': 'getShipDetails'
    },
    methods: {
        getShipDetails () {
            var params = {}
            this.$restFull({
                method: 'GET',
                url: Api.queryShipDetails,
                params: {
                    userId: this.userId,
                    mmsi: this.$route.params.shipId
                }
            }).then((res) => {
                this.deviceInfo = res.deviceInfo || {}
                this.shipArchives = res.shipArchives || {}
                this.shipMessage = res.shipMessage || {}
                this.shipOwnerInfo = res.shipOwnerInfo || {}
                this.shipsGroupDTO = res.shipsGroupDTO || {}
            })
        },
        openCarousel (data) {
            if (!data.length) return
            let tmp = []
            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                tmp.push(element.originalUrl)
            }
            this.pics = tmp
            if (tmp.length) {
                this.showPics = true
            }
        },

        filterPic (data) {
            if (!data.length) return
            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                if (element.headShow === '1') {
                    return element.thumbUrl
                }
            }

            return data[0].thumbUrl ? data[0].thumbUrl : ''
        }
    }
}
</script>

<style lang='stylus'>
    @import '../stylus/components/ship.styl';
</style>
