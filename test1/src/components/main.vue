<template>
    <div class="login">
        <ul class="loginLog">
            <li class="symbol"></li>
            <li class="name">VUE And ElementUI</li>
        </ul>
        <div class="inner">
             <div class="loginPic"></div>
             <div class="loginContent">
                 <li class="welcome">欢迎登录</li>
                 <el-form ref="form" :model="form">
                    <el-form-item>
                        <el-input v-model="form.name" type="text"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.pswd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                       <el-checkbox v-model="form.checked">记住用户名和密码</el-checkbox>
                    </el-form-item>
                 </el-form>
             </div> 
        </div>
         <li class="copyRight">Copyright © 2020 北京文思海辉金信软件有限公司</li>
    </div>
</template>
<script>
export default {
    nane:"Login",
    data:function(){
        return {
            form:{
                name:'admin',
                pswd:'666666',
                checked: true,
            }
        }
    },
    methods:{
        submit:function(){
            this.$router.push('/page1');
            localStorage.setItem('userName898','chenxuan');
        }
    }
}
</script>
<style>
    .login{
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: black;
    }
    .login .loginLog{
        position: absolute;
        top: 0;
        left: 100px;
        height: 68px;
        line-height: 68px;
    }
    .login .loginLog .symbol{
        float: left;
        width: 40px;
        height: 40px;
        margin: 14px 8px 0 0;
        background-color: black;
    }
    .login .loginLog .name{
        float: left;
        font-size: 2rem;
        font-weight: bold;
        color: #fff;
    }
    .login .inner{
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }
    .login .inner .loginPic{
        float: left;
        background-color: black;
    }
    .login .inner .loginContent{
        float: right;
        background-color: #fff;
        border-radius: 6px;
    }
    .login .inner .loginContent .welcome{
        box-sizing: border-box;
        margin: 24px 0 30px;
        padding-left: 40px;
        font-weight: bold;
        color: #409eff;
        font-size: 1.6rem;
    }
    .login .inner .loginContent .el-form-item .el-form-item__content{
        margin-left: 0;
    }
    .login .inner .loginContent .el-form-item .el-button{
        width: 100%;
    }
    .login .copyRight{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 36px;
        text-align: center;
        line-height: 36px;
        color: #fff;
        font-size: 1.5rem;
    }
    @media screen and (max-height: 600px){
        .login .inner{
            width: 1240px;
        }
        .login .inner .loginPic{
            width: 640px;
            height: 436px;
        }
        .login .inner .loginContent{
            width: 380px;
            margin-top: 75px;
        }
        .login .inner .loginContent .el-form-item{
        width: 300px;
        margin: 0 auto 24px;
        }
    }
    @media screen and (max-height: 912px) and (min-height: 600px){
        .login .inner{
            width: 1080px;
        }
        .login .inner .loginPic{
            width: 580px;
            height: 436px;
        }
        .login .inner .loginContent{
            width: 380px;
            margin-top: 53px;
        }
        .login .inner .loginContent .el-form-item{
        width: 300px;
        margin: 0 auto 24px;
        }
    }
    @media screen and (min-height: 912px){
        .login .inner{
            width: 1300px;
        }
        .login .inner .loginPic{
            width: 700px;
            height: 528px;
        }
        .login .inner .loginContent{
            width: 400px;
            margin-top: 86px;
        }
        .login .inner .loginContent .el-form-item{
        width: 310px;
        margin: 0 auto 30px;
        }
    }
</style>