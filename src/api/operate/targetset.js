import axios from 'axios'

//客户列表
export const getList = (data) => {
    return axios.post('/target/index' ,data)
}

export const addTarget = (data) => {
    return axios.post('/target/add' ,data)
}

export const editTarget = (data) => {
    return axios.post('/target/update' ,data)
}

export const delTarget = (data) => {
    return axios.post('/target/del' ,data)
}

export const delTargeInfo = (data) => {
    return axios.post('/target/get_date_by_id' ,data)
}
