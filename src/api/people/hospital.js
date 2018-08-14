import axios from 'axios'

export const getHospitalList = (data) => {
    return axios.post('/hospital_list' ,data)
}

export const addHospital = (data) => {
    return axios.post('/hospital_add' ,data)
}

export const editHospital = (data) => {
    return axios.post('/hospital_edit' ,data)
}

export const deleteHospital = (data) => {
    return axios.post('/hospital_delete' ,data)
}

export const getHospitalInfo = (data) => {
    return axios.post('/hospital_info' ,data)
}
