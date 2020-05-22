<template>
  <div id="app" class="app">
      <Slidebar></Slidebar>
      <Topnav></Topnav>
      <User></User>
      <div class="mainContent">
        <div class="inner"> <router-view/></div>
      </div>
  </div>
</template>

<script>
  import Slidebar from './components/slidebar'
  import Topnav from './components/topnav'
  import User from './components/user'
  export default {
    name: 'App',
    components:{
      Slidebar,
      Topnav,
      User
    }
  }
</script>

<style>
  *{padding: 0;
    margin: 0;
    list-style: none;
  }
.app {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100vh;
  padding-top: 46px;
  background-color: #f0f0f0;
}
  .app .mainContent{
    box-sizing: border-box;
    margin-left: 180px;
    height: 100%;
    padding: 12px 12px 0 12px;
  }
  .app .mainContent .inner{
    width: 100%;
    height: 100%;
    background-color: white;
  }
</style>
