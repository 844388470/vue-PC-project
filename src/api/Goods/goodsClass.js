import axios from 'axios'

export const getGoodsClassList = (data) => {
    return axios.post('/goods_category' ,data)
}

export const addGoodsClass = (data) => {
    return axios.post('/goods_category/add' ,data)
}

export const editGoodsClass = (data) => {
    return axios.post('/goods_category/update' ,data)
}

export const deleteGoodsClass = (data) => {
    return axios.post('/goods_category/delete' ,data)
}
