import axios from 'axios'
//单据作废列表
export const getReceiptVoidList = (data) => {
    return axios.post('/receipt_void_index' ,data)
}

// 作废登记查询
export const getSearchByCancal = (data) => {
    return axios.post('/receipt_searchbycancal' ,data)
}
// 批量作废登记确认
export const setCancelingReceipt = (data) => {
    return axios.post('/receipt_cancel_add' ,data)
}
