import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'
// import ElementUI from 'element-ui'
export default {
    hehe:function(){
      alert("heheh")
    },
    hehe1:function(a){
      alert(a)
    },
    // getKey:function(){
    //     axios({
    //         url:process.env.API_HOST+'/login/getKey',
    //         method:'post',
    //     })
    //     .then((res)=>{
    //         if(res.data.code==11){
    //           this.key = (this.cryptoJS.enc.Base64.parse(res.data.data)).toString(this.cryptoJS.enc.Utf8);
    //           localStorage.setItem('key',this.key);
    //           this.sessionid();
    //         }
    //         else if(res.data.code==10){
    //            this.msg.error('抱歉,资源初始化失败,请刷新重试! key=10');
    //         }
    //         else if(res.data.code==0){
    //           this.msg.error(res.data.message);
    //         }
    //     })
    //     .catch((err)=>{
    //        this.msg.error('抱歉,资源初始化失败,请刷新重试!key错误');
    //     })
    // },
}

// sessionid:function(){
//     this.$axios({
//           url:process.env.API_HOST+'/userInfo/sessionID',
//           method:'get',
//     })
//     .then((res)=>{
//       document.cookie =`SESSION=${res.data}`;
//       this.preResources();
//     })
//   },
// preResources:function(){
//     this.$axios.all([
//       this.$axios({
//          url:process.env.API_HOST+'/login/getUserResource',
//          method:'post'
//       }),
//       this.$axios({
//         url:process.env.API_HOST+`/login/getMenuResource`,
//         //  url:process.env.API_HOST+`/login/getMenuResource?moduleCode=${localStorage.getItem('moduleCode')}`,
//          method:'post'
//       }),
//       this.$axios({
//          url:process.env.API_HOST+`/login/getFunctionResource`,
//         //  url:process.env.API_HOST+`/login/getFunctionResource?moduleCode=${localStorage.getItem('moduleCode')}`,
//          method:'post'
//       })
//     ])
//     .then(
//       this.$axios.spread((res1,res2,res3)=>{
//           if(res1.data.code==11){
//               let userInfo={},jobInfo={},resdata=res1.data.data;
//               userInfo.userName=resdata.userInfo[0].userName;
//               userInfo.userCode=resdata.userInfo[0].userCode;
//               jobInfo.jobOptions=resdata.jobRoleInfo;
//               resdata.jobRoleInfo.find((val)=>{
//                 if(val.jobCode==resdata.userInfo[0].currentJob){
//                   jobInfo.jobActive=val.jobName;
//                 }
//               });
             
//               localStorage.setItem('userInfo',JSON.stringify(userInfo));
//               localStorage.setItem('theme',resdata.userInfo[0].theme);
//               localStorage.setItem('jobInfo',JSON.stringify(jobInfo));
//               this.$store.commit('loadUserInfo',userInfo);
//               this.$store.commit('tabtheme',resdata.userInfo[0].theme);
//               this.$store.commit('loadJobInfo',jobInfo);
//           }
//           if(res2.data.code==11){
//             let resdata=res2.data.data.menu[0].children;
//             localStorage.setItem('menus',JSON.stringify(resdata));
//             this.$store.commit('loadMenus',resdata);

//             let newArr = [],routers = [];
//             resdata.find((val) => {
//                 if (val.children) {
//                     val.children.find((value) => {
//                         let obj_1 = {};
//                         obj_1.menuCode = value.menuCode;
//                         obj_1.menuName = value.menuName;
//                         obj_1.menuUrl = value.menuUrl;
//                         obj_1.menuLocation = value.menuLocation;
//                         newArr.push(obj_1);
//                         if(value.children){
//                           value.children.find((v)=>{
//                             let obj_2={};
//                             obj_2.menuName = v.menuName;
//                             obj_2.menuName = v.menuName;
//                             obj_2.menuUrl = v.menuUrl;
//                             obj_2.menuLocation = v.menuLocation;
//                             newArr.push(obj_2);
//                           })
//                         }
//                     });
//                 }
//             });
//             localStorage.setItem('routers',JSON.stringify(newArr));
//             JSON.parse(localStorage.getItem('routers')).find((val) => {
//                 let obj = {};
//                 obj.meta = { isLogin: true};
//                 obj.path = `/${val.menuUrl}`;
//                 obj.component = (resolve) => require([`@/views/${val.menuLocation}`], resolve);
//                 routers.push(obj);
//             });
//             //首页路由
//             routers.push({
//               meta:{ isLogin: true },
//               path:'/',
//               component: (resolve) => require([`@/views/${JSON.parse(localStorage.getItem('routers'))[0].menuLocation}`], resolve),
//             })

//             //404路由
//              routers.push({
//               path:'*',
//               component: NotFound
//             })
//             this.$router.addRoutes(routers);
//             // this.$router.push(`${routers[0].path}`);
//             console.log('动态路由完成')
//           }
//           if(res3.data.code==11){
//             let resdata=res3.data.data,element=[];
//             resdata.find((val)=>{
//               let obj={};
//               obj.functionCode= val.functionCode;
//               obj.functionName=val.functionName;
//               element.push(obj);
//             });
//             localStorage.setItem('element',JSON.stringify(element));
//           }
//           if(res1.data.code==11 && res2.data.code==11 && res3.data.code==11){
//             this.loading=false;
//           }
//           if(res1.data.code==10 || res2.data.code==10 || res3.data.code==10 || res1.data.code==0 || res2.data.code==0 || res3.data.code==0 ){
//             this.msg.error('抱歉,资源初始化失败,请刷新重试!')
//           }

//       })
//     )
//     .catch((err)=>{
//       this.msg.error('抱歉,资源初始化失败,请刷新重试! 请求错误');
//     })
//   }