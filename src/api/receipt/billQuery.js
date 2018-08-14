import axios from 'axios'
//获取票据查询列表
export const getAllReceiptList = (data) => {
    return axios.post('/receipt_book_index' ,data)
}
//发放轨迹
export const getReceiptDetail = (data) => {
    return axios.post('/receipt_book_detail' ,data)
}
