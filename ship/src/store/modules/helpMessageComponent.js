const state = {
    /* 显示受困船舶周围船舶列表 */
    showShipListView: false,
    /* 群发紧急通知 */
    emergencyHelpMeeeee: false,
}

const getters = {
    showShipListView: state => state.showShipListView,
    emergencyHelpMeeeee: state => state.emergencyHelpMeeeee,
}

const actions = {
    showShipListViewChange( {commit} , type ){
        commit( 'showShipListViewChange' , type );
    },
    emergencyHelpMeeeeeChange( {commit} ,type ){
        commit( 'emergencyHelpMeeeeeChange' , type );
    }
}

const mutations = {
    showShipListViewChange( state , type ){
        if( typeof type == 'boolean' ){
            state.showShipListView = type;
        }
    },
    emergencyHelpMeeeeeChange( state , type ){
        if( typeof type == 'boolean' ){
            state.emergencyHelpMeeeee = type
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
