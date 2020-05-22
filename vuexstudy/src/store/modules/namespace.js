import type from '../type.js'
var state={
    name:'123'
}
const getters={
    name:function(state){
        return state.name
    }
}
const actions={
   
}
const mutations={
    
}
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}