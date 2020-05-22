// const prefix = process.env.VUE_APP_API_PREFIX
const STATISTICS = process.env.VUE_APP_API_STATISTICS_PREFIX
const COMPANY = process.env.VUE_APP_API_COMPANY_PREFIX
const SANWU = process.env.VUE_APP_API_SANWU_PREFIX
const reminder = process.env.VUE_APP_API_REMINDER_PREFIX
const AREA = process.env.VUE_APP_API_AREA_PREFIX
const api = {
    countAllImeisPage: `${STATISTICS}countAllImeisPage`,
    oneImeiDaysDetail: `${STATISTICS}oneImeiDaysDetail`,
    reportExcelList: `${STATISTICS}reportExcelList`,
    reportExcelDetails: `${STATISTICS}reportExcelDetails`,
    getHistoryBingByImei: `${STATISTICS}getHistoryBingByImei`,
    companyList: `${COMPANY}list/{pageNumber}/{pageSize}`,
    companyAdd: `${COMPANY}incr/{companyName}/{serviceMobile}/{userName}/{email}/{usernumber}/{shipcount}`,
    companyDetails: `${COMPANY}details/{companyId}`,
    // 下面是三无接口
    login: `${SANWU}login`,
    areas: `${SANWU}areas`,
    groups: `${SANWU}user/groups/{userId}`,
    addGroup: `${SANWU}user/addGroup`,
    shipList: `${SANWU}user/shipsPage`,
    searchShip: `${SANWU}ship/shipSearchFunc`,
    queryShipInfo: `${SANWU}ship/queryShipInfo`,
    selectManagerShip: `${SANWU}ship/selectManagerShip`,
    queryShipDetails: `${SANWU}ship/queryShipDetails`,
    selectSingleVoyage: `${SANWU}ship/selectSingleVoyage`,
    getShipLocation: `http://api.shipdt.com/DataApiServer/apicall/GetManyShip`, // 暂时不用
    getAis: `${SANWU}ship/queryShipAis`,
    saveGroups: `${SANWU}user/mmsiUserGroup`,
    uploadImg: `${SANWU}uploadImageFromShip`,
    getValidateCode: `${SANWU}getValidateCode`,
    getPasswordCodeValue: `${SANWU}getPasswordCodeValue`,
    saveArea: `${SANWU}areas/{mmsi}/{areaId}/{userId}`,
    shipsExport: `${SANWU}user/shipsExport`,
    resetUserPassword: `${SANWU}resetUserPassword`,
    queryRescueShip: `${SANWU}queryRescueShip`,
    queryRescueTask: `${SANWU}queryRescueTask`,
    updateRescueTask: `${SANWU}updateRescueTask`,
    queryShipMeteorology: `${SANWU}queryShipMeteorology`,
    sendRescueInfo: `${SANWU}sendRescueInfo`,
    rescueShipExport: `${SANWU}rescueShipExport`,
    reminderHistory: `${reminder}queryAreaHistoryNews`,
    getUserArea: AREA,
    currentTy: 'http://www.shipdt.com/lvservice/storm/selectStromData',
    getTyphoonDetail: 'http://www.shipdt.com/lvservice/storm/selectStormPresentNew',
    typhoonShipInfo: `${SANWU}typhoon/typhoonShipInfo`,
    typhoonShipExport: `${SANWU}typhoon/typhoonShipExport`,
    sendTyphoonInfo: `${SANWU}typhoon/sendTyphoonInfo`
}

export default api
