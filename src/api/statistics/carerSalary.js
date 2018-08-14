import axios from 'axios'

export const getCarerList = (data) => {                         //列表
    return axios.post('/carer_salary_list' ,data)
}

export const setIsLock = (data) => {                         //锁定/解锁
    return axios.post('/carer_salary_lock' ,data)
}

export const getSalaryDetail = (data) => {                    //查看明细
    return axios.post('/carer_salary_detail' ,data)
}
