<template>
    <div class="tabbar">
      <Item name="首页" mark="home" :sel="selected"  @change="getVal">
        <img src="../assets/tabbar/normal/google.png" slot="imgNormal" >
        <img src="../assets/tabbar/selected/google.png" slot="imgSelected" >
      </Item>
      <Item  name="小组" mark="group" :sel="selected"  @change="getVal">
        <img src="../assets/tabbar/normal/sougou.png" slot="imgNormal">
        <img src="../assets/tabbar/selected/sougou.png" slot="imgSelected">
      </Item>
      <Item   name="书影音" mark="audio" :sel="selected"  @change="getVal">
        <img src="../assets/tabbar/normal/bing.png" slot="imgNormal">
        <img src="../assets/tabbar/selected/bing.png" slot="imgSelected">
      </Item>
      <Item  name="广播"  mark="broadcast" :sel="selected"  @change="getVal">
        <img src="../assets/tabbar/normal/baidu.png" slot="imgNormal">
        <img src="../assets/tabbar/selected/baidu.png" slot="imgSelected">
      </Item>
      <Item   name="我的" mark="mine" :sel="selected" @change="getVal">
        <img src="../assets/tabbar/normal/qq.png" slot="imgNormal">
        <img src="../assets/tabbar/selected/qq.png" slot="imgSelected">
      </Item>
    </div>
</template>

<script>
  import Item from  './tabbarItem'
  export  default {
    components:{
      Item
    },
    data:function(){
      return {
        selected:'home'      }
    },
    methods:{
      getVal:function (val) {
        this.selected=val
      }
    }
  }
</script>
<style>
  .tabbar{

    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 49px;
    border-top: 1px solid rgb(220,220,220);
    background: white;
  }
</style>
