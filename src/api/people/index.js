import axios from 'axios'

export const getAllStaffSelect = (data) => {                         //下拉选项
    return axios.post('/get_all_staff_select' ,data)
}

export const getStaffInfo = (data) => {                         //获取人员列表分页
    return axios.post('/staff_info' ,data)
}

export const setStaffEdit = (data) => {                         //修改人员
    return axios.post('/staff_edit' ,data)
}

export const setStaffAdd = (data) => {                         //新增人员
    return axios.post('/staff_add' ,data)
}

export const unSetStaffAdd = (data) => {                         //新增护工
    return axios.post('/un_staff_add' ,data)
}

export const deleteStaff = (data) => {                       //删除人员
    return axios.post('/staff_delete' ,data)
}

export const getAllList = (data) => {                         //获取全部人员
    return axios.post('/staff_all_list' ,data)
}

export const setTurnAll = (data) => {                         //人员批量调动
    return axios.post('/staff_turn_all' ,data)
}

export const getLuruId = (data) => {                //获取录入Id
    return axios.post('/staff_get_not_input_time',data)
}
