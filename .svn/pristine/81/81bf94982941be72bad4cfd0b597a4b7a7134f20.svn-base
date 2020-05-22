<template>
    <div :class='{headerWrap:true,green:bol}'>
        <span>{{title}}</span>
        <ul class="symbol">
            <li><slot name="iconLeft"></slot></li>
            <li><slot name="iconRight"></slot></li>
        </ul>
        <div class="search"><slot name="search"></slot></div>
    </div>
</template>

<script>
    export default {
        name: "Myheader",
        props:['title','bol']
    }
</script>

<style>
    .green{
        background: red;
    }
    .headerWrap{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 44px;
        background: white;
      /*  border-bottom: 1px solid #00b51d;*/
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        line-height: 44px;
        color: rgb(51,51,51);
        box-shadow: 0 1px 2px rgba(0,0,0,.2);
    }
    .green{
        background-color:#00b51d ;
    }
    .headerWrap .symbol{
       position: absolute;
        right: 16px;
        top: 0;
        height: 44px;
    }
    .headerWrap .symbol li{
        float: left;
        width: 20px;
        height: 20px;
        margin: 5px 0 0 0;
        padding: 0 10px;
        text-align: center;
    }
    .headerWrap .symbol li img{
        width: 20px;
        height: 20px;
    }
    .headerWrap .search{
        position: relative;
        float: left;
        width: 80%;
    }
    .headerWrap .search input{
        width: 100%;
        height: 30px;
        margin-left: 12px;
        border-radius: 4px;
        text-indent: 26px;
        font-size: 12px;
        outline: none;
    }
    .headerWrap .search .searchIcon{
        position: absolute;
        left: 18px;
        top: 14px;
        width: 16px;
        height: 16px;
    }
    .headerWrap .search .scanIcon{
        position: absolute;
        right: 0;
        top: 14px;
        width: 16px;
        height: 16px;
    }

</style>
