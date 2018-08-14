import axios from 'axios'

export const getCompanyList = (data) => {
    return axios.post('/company_list' ,data)
}

export const addCompany = (data) => {
    return axios.post('/company_add' ,data)
}

export const editCompany = (data) => {
    return axios.post('/company_edit' ,data)
}

export const deleteCompany = (data) => {
    return axios.post('/company_delete' ,data)
}

export const getCompanyInfo = (data) => {
    return axios.post('/company_info' ,data)
}
