import axios from 'axios'

export const getSysInfo = (data) => {
    return axios.post('/get_set' ,{key:data})
}

export const SetSysInfo = (data) => {
    return axios.post('/sys_set',data )
}
