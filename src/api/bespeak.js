import axios from 'axios'

export const preOrders = (data) => {                //获取组织机构树形数据
    return axios.post('/pre_orders',data)
}

export const preOrdersupdate = (data) => {                //获取组织机构树形数据
    return axios.post('/pre_order/update',data)
}
