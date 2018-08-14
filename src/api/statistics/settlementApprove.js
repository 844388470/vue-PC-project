import axios from 'axios'

export const getCheckList = (data) => {                         //结算核定—列表
    return axios.post('/finance_check_slist' ,data)
}

export const getCheckCollList = (data) => {                    //获取预收明细列表
    return axios.post('/finance_check_pre_detail' ,data)
}

export const getCheckSettList = (data) => {                    //获取结算明细列表
    return axios.post('/finance_check_end_detail' ,data)
}

export const getCheckReceList = (data) => {                    //获取收款明细列表
    return axios.post('/finance_check_scharge_detail' ,data)
}

export const setCheckSprecheck = (data) => {                    //核定
    return axios.post('/finance_check_spreCheck' ,data)
}

export const setCheckLock = (data) => {                    //锁定/解锁
    return axios.post('/set_finance_check_slock' ,data)
}

export const getCheckExcel = (data) => {                    //导出excel
    return axios.post('/finance_check_excel' ,data)
}
