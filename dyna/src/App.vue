<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted:function(){
    this.$axios({
      url:'/content/list.php?key=478503db587d59d275971755259b4899&page=20&pagesize=10&sort=asc&time=1418745237',
      method:'get'
    })
    .then((res)=>{
      console.log(res.data.result.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },
  methods:{

  }
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
