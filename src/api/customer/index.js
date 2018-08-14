import axios from 'axios'

//客户列表
export const customs = (data) => {
    return axios.post('/customs' ,data)
}

//客户添加
export const customs_add = (data) => {
    return axios.post('/custom/add' ,data)
}

//客户修改
export const customs_update = (data) => {
    return axios.post('/custom/update' ,data)
}

//客户修改
export const customs_delete = (pk_id) => {
    return axios.post('/custom/delete' ,{pk_id})
}

//家属列表
export const custom_family = (custom_id) => {
    return axios.post('/custom_family' ,{custom_id})
}

//婴儿列表
export const custom_baby = (custom_id) => {
    return axios.post('/custom_baby' ,{custom_id})
}

//评估历史
export const history = (data) => {
    return axios.post('/bathel/history',data)
}

//护理评估添加
export const bathel_add = (data) => {
    return axios.post('/bathel/add',data)
}

//删除评估
export const bathel_del = (pk_id) => {
    return axios.post('/bathel/delete',{pk_id})
}

//护理评估修改
export const bathel_update = (data) => {
    return axios.post('/bathel/update',data)
}

//评估明细
export const bathel_show = (pk_id) => {
    return axios.post('/bathel/show',{pk_id})
}