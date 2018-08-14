import axios from 'axios'
// 获取入库列表
export const getInStorelist = (data) => {
    return axios.post('/receipt_storage_index' ,data)
}
// 入库登记查询
export const getSerachbyStorage = (data) => {
    return axios.post('/receipt_book_serachbystorage' ,data)
}
// 编码入库
export const codeInStore = (data) => {
    return axios.post('/receipt_code_add' ,data)
}
// 入库撤销
export const getReceiptRemove = (data) => {
    return axios.post('/receipt_remove' ,data)
}
// 票据接收  新增
export const getNewAddReceipt = (data) => {
    return axios.post('/receipt_storage_add' ,data)
}
