<template>
  <div class="itemWrap" @click="fn()">
    <li class="symbol">
      <span v-show='bol'><slot name="imgNormal"></slot></span>
      <span v-show='!bol'><slot name="imgSelected"></slot></span>
    </li>
    <li class="name"><span :class='{current:!bol}'>{{name}}</span></li>
  </div>
</template>

<script>
    export default {
        name: "tabbarItem",
        props:['name','mark','sel'],
        computed:{
          bol:function(){
            if(this.mark==this.sel){
              return false;
            }
            return true;
          }
        },
        methods:{
            fn:function () {
            this.$emit('change',this.mark);
            this.$router.push('/'+this.mark);
            }
        }
    }
</script>

<style>
  li{list-style: none}
  .itemWrap{
    float: left;
    width: 20%;
    text-align: center;
  }
  .itemWrap .symbol{
    margin-top: 5px;
  }
  .itemWrap .symbol img{
    width: 20px;
    height: 20px;

  }
  .itemWrap .name{
    font-size: 12px;
    color: rgb(105,105,105);
  }
  .itemWrap .name .current{
    color:#00b51d;
  }
</style>
