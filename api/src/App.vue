<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import {mapGetters,mapState,mapActions, mapMutations} from 'vuex'
export default {
  name: 'App',
  computed:{
  ...mapGetters(['ok'])
  },
  // watch:{
  //   ok:function(val){
  //     console.log(this.ok)
  //   }
  // },
  // mounted:function(){
  //   var d = new Date();
  //   this.$axios({
  //     url:'toutiao/index?type=top&key=710195eeedeeb40b377f235423f58209',
  //     method:'get'
  //   })
  //   .then((res)=>{
  //     console.log(d.getTime()+"-APP")
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
