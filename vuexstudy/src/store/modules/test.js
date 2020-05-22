import type from '../type.js'
var state={
    count:6,
}
const getters={
    count:function(s){
        return s.count
    },
    isEvenorOdd:function(s){
        return s.count%2==0 ? "偶数" : "奇数"
    }
}
const actions={
    increment({commit,state}){
        commit(type.INCREMENT);
    },
    decrement({commit,state}){
        commit(type.DECREMNET);
    }
}
const mutations={
    [type.INCREMENT](state){
        state.count++;
    },
    [type.DECREMNET](state){
        if(state.count>10){
            state.count--;
        }
    }
}
export default{
    namespaced:true,
    state,
    getters,
    actions,
    mutations
   
}