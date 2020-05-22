import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

//定义数据(属性)
var state={
    count:100,
    count1:6,
    list:[]
}
//定义getters
var getters={
    count1:function(s){
        return s.count1
    },
    isEvenorOdd:function(s){
        return s.count1%2==0 ? "偶数" : "奇数"
    }

}
//定义方法
const actions={
    increment({commit,state}){
        commit('increment');
    },
    decrement({commit,state}){
        commit('decrement');
    }
}
//定义mutations
const mutations={
    increment(state){
        state.count1++;
    },
    decrement(state){
        if(state.count1>10){
            state.count1--;
        }
    }
}
//创建store对象
const store=new Vuex.Store({
    state:state,
    getters:getters,
    actions:actions,
    mutations:mutations
})
//导出
export default store;

