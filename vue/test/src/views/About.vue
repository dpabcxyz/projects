<template>
  <div class="about">
    <h1>{{count}}</h1>
  </div>
</template>

<script>
import {mapGetters,mapState,mapActions} from 'vuex'
export default {
  name:'',
  computed:{
    ...mapGetters("layout",['count'])
  },
  methods:{

  }
}
</script>

<style>

</style>
