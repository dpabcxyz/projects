<template>
	<div>
    <Myheader title="书影音">
      <img src="../../assets/header/header_icon_search.png" alt="" slot="iconLeft">
      <img src="../../assets/header/header_icon_chat.png" alt="" slot="iconRight">
    </Myheader>
    
    <div class="nav">
      <span :class='{active:nowIndex==0}' @click="nowIndex=0"><router-link to="/audio/film">电影</router-link></span>
      <span :class='{active:nowIndex==1}' @click="nowIndex=1"><router-link to="/audio/tv">电视</router-link></span>
      <span :class='{active:nowIndex==2}' @click="nowIndex=2"><router-link to="/audio/city">同城</router-link></span>
      <span :class='{active:nowIndex==3}'  @click="nowIndex=3"><router-link to="/audio/music">音乐</router-link></span>
      <span :class='{active:nowIndex==4}'  @click="nowIndex=4"><router-link to="/audio/read">读书</router-link></span>
    </div>
    <div>
      <router-view></router-view>
    </div>
	</div>

</template>
<script>
  import Myheader from '../../components/header'
  export default {
    components:{
      Myheader
    },
    data:function () {
      return{
        nowIndex:0
      }
    }
  }
</script>
<style>
.nav{
  width:100%;
  height:36px;
  background-color:white;
  line-height:36px;
}

.nav a{
  box-sizing: border-box;
  display:block;
  float:left;
  height: 36px;
  width:20%;
  text-align:center;
  font-size:13px;
   color:rgb(102,102,102);
  text-decoration:none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
    -moz-user-select: none;
}
.nav .active a{
  color: red;
  border-bottom: 2px solid red;

}
</style>
