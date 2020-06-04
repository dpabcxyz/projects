
const state = {
    count:100
}
const getters={
    // dialogFormVisible:(state)=>{
    //     return state.dialogFormVisible
    // },
    count:function(state){
      return state.count
    }

}

const mutations={
    //
    // [types.turnDialogStatus](state,data){
    //     state.dialogStatus=data
    // }
    setCount(state){
      state.count++
    }

}
const actions={
    // turnDialogFormVisible({commit, state}){
    //     commit(types.turnDialogFormVisible)
    // }
    setCount({commit,state}){
      commit('setCount')
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
