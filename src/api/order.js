import axios from 'axios'

export const getOrderList = (data) => {                      //获取订单列表
    return axios.post('/orders/order_list',data)
}

export const getStaffsList = (data) => {                      //获取员工列表
    return axios.post('/staff/get_staffs',data)
}

export const getGoodsList = (data) => {                      //获取项目产品列表
    return axios.get('/setup/get_goods',{params:data})
}

export const getOss = (scene) => {                //获取OSS
    scene = scene || 'other'  
  return axios.post('/api/oss',{scene})
}

export const getOrderInfo = (data) => {                //获取订单明细
    return axios.post('/orders/order_info',data)
}

export const updateOrder = (data) => {                //修改订单
    return axios.post('/orders/update',data)
}

export const addOrder = (data) => {                //新增订单
    return axios.post('/orders/create',data)
}

export const getCheckFeeList = (data) => {                //收费上缴列表
    return axios.post('/check_fee_index',data)
}

export const getCheckNotFeeList = (data) => {                //查询未上缴列表
    return axios.post('/check_serach_not_fee',data)
}

export const getCheckFeeDetail = (data) => {                //获取收费上缴列表项的详情
    return axios.post('/check_up_add_index',data)
}

export const addCheckInfo = (data) => {                //添加修改上缴单
    return axios.post('/check_up_charge_info_fee',data)
}

export const getLuruId = (data) => {                //获取录入Id
    return axios.post('/orders/get_null_input',data)
}
export const getProjectCheck = (data) => {                //获取结算确认列表
    return axios.post('/project_check_index',data)
}
export const getProjectCheckDetail = (data) => {                //查看结算详情
    return axios.post('/project_check_detail',data)
}
export const ProjectCheckConfirmAndcancel = (data) => {                //结算确认与取消
    return axios.post('/project_check_order',data)
}
export const getDubList = (data) => {                //获取科室列表
    return axios.post('/get_dub_list',data)
}
export const getLog =(data)=>{                 //获取订单日志
    return axios.post('/orders/log',data)
}

export const getLogDetail = (data) =>{                //订单日志详情
    return axios.post('/orders/log_detail',data)
}
