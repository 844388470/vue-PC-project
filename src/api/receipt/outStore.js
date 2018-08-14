import axios from 'axios'

export const getAllOutStorelist = (data) => {
    return axios.post('/receipt_library_index' ,data)
}
// 出库登记查询
export const getSerachbylibrary = (data) => {
    return axios.post('/receipt_book_serachbylibrary' ,data)
}
// 出库撤销
export const getReceiptOutRemove = (data) => {
    return axios.post('/receipt_outremove' ,data)
}

// 新增批量出库
export const setReceiptOutStore = (data) => {
    return axios.post('/receipt_library_add' ,data)
}
