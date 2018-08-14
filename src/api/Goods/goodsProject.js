import axios from 'axios'

export const getProjectGoodsList = (data) => {
    return axios.post('/project_goods' ,data)
}

export const addProjectGoods = (data) => {
    return axios.post('/project_goods/add' ,data)
}

export const editProjectGoods = (data) => {
    return axios.post('/project_goods/update' ,data)
}

export const getGoodsList = (data) => {
    return axios.post('/goods/exist_goods' ,data)
}

export const deleteProjectGoods = (data) => {
    return axios.post('/project_goods/delete' ,data)
}
