import axios from 'axios'

export const getcomplist = (data) => {                //获取投诉列表
    return axios.post('/suggestion/index',data)
}
