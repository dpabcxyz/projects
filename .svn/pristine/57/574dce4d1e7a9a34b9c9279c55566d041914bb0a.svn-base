<template lang="pug">
    #loading
        Icon(
            type="ios-loading" size=30 class="demo-spin-icon-load"
        )
        div Loading

</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Loading',
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='stylus'>
#loading{
    position fixed
    width: 100px;
    height: 100px;
    left: 50%;
    top:50%
    z-index 2000
    color: #002E67
    display: flex
    justify-content center
    align-items center
    flex-direction: column
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;

}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>
