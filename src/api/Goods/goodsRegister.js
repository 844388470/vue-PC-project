import axios from 'axios'

export const getGoodsList = (data) => {
    return axios.post('/goods' ,data)
}

export const getLVClass = (data) => {
    return axios.post('/goods_category/json' ,data)
}

export const addGoods = (data) => {
    return axios.post('/goods/add' ,data)
}

export const editGoods = (data) => {
    return axios.post('/goods/update' ,data)
}

export const deleteGoods = (data) => {
    return axios.post('/goods/delete' ,data)
}

export const getCcateGoods = (data) => {                    //二级分类下的产品列表
    return axios.post('/goods/exist_goods' ,data)
}
