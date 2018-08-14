import axios from 'axios'

export const getCheckList = (data) => {                         //项目级列表
    return axios.post('/finance_check_list' ,data)
}

export const getCheckShouList = (data) => {                         //收款金额订单明细列表
    return axios.post('/finance_check_collection_amount_list' ,data)
}

export const getCheckShangList = (data) => {                         //上期预收转本期收入订单明细列表
    return axios.post('/finance_check_prev_detail' ,data)
}

export const getCheckDubOrGroupList = (data) => {                    //获取科室查看或护理组查看列表
    return axios.post('/finance_check_query_dub' ,data)
}

export const getCheckDayOrMonthList = (data) => {                    //获取月结或日结列表
    return axios.post('/finance_check_detail_dub' ,data)
}

export const setCheckPrecheck = (data) => {                    //核定
    return axios.post('/finance_check_preCheck' ,data)
}

export const getCheckExcel = (data) => {                    //导出excel
    return axios.post('/finance_check_excel' ,data)
}
