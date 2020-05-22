<template>
  <div class="cell-wrap"  :class='{hot:hot}'>
    <div>
      <li class="icon-left"><slot name="icon-left"></slot></li>
      <li class="name">{{title}}</li>
      <li class="icon-right"><slot name="cell-right"></slot></li>
    </div>

  </div>

</template>

<script>
    export default {
        name: "cell",
        props:{
            title:{
              type:String,
              default:''
            },
            hot:{
              type:String,
              default:'false'

            }

        }
    }
</script>

<style>
  .cell-wrap{
    position: relative;
    height: 40px;
    border-bottom: 1px solid lightgrey;
    line-height: 40px;
  }
  .hot{
    padding-left: 10px;
    border-bottom: none;
  }
  .hot:after{
    position: absolute;
    left: 0;
    top: 8px;
    content: '';
    width: 3px;
    height: 22px;
    background-color: #00b51d;
}
  .cell-wrap .icon-left{
    float: left;
    margin-left: 10px;
  }
  .cell-wrap .icon-left img{
    width: 18px;
    margin-top: 10px;
  }
  .cell-wrap .name{
    float: left;
    margin-left: 4px;
  }
  .cell-wrap .icon-right{
    float: right;
    margin-right: 10px;
  }
  .cell-wrap .icon-right img{
    margin-top: 10px;
  }
</style>
