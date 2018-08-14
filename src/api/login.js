import axios from 'axios'

export const login = (staff_no,password) => {
    return axios.post('/login',{staff_no,password})
}

export const logout = () => {
    return axios.post('/logout',{})
}

export const editpassword = (data) => {
    return axios.post('/change_password',data)
}
