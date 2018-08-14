import axios from 'axios'

export const getAllMenuList = (data) => {                      //获取所有菜单
    return axios.post('/modules',{'client_type':data})
}

export const getMenuList = () => {                      //获取当前登录账号有权限菜单
    return axios.post('/auth_modules',{'client_type':0})
}

export const addMenuModule = (data) => {                //新增菜单模块---所有菜单
    return axios.post('/module/add',data)
}

export const updateMenuModule = (data) => {                //修改菜单模块---所有菜单
    return axios.post('/module/update',data)
}

export const deleteMenuModule = (data) => {                //删除菜单模块---所有菜单
    return axios.post('/module/delete',{'pk_id':data})
}

export const getRolesList = (data) => {                //获取角色列表(分页)
    return axios.post('/roles',data)
}

export const getAllRolesList = (data) => {                //获取所有角色列表
    return axios.post('/get_all_roles',data)
}

export const getRolesPermission = (data) => {                //获取id岗位菜单权限
    return axios.post('/get_role_permission',data)
}

export const setRolesPermission = (data) => {                //设置id岗位菜单权限
    return axios.post('/set_role_permission',data)
}

export const getRoleCategory = (data) => {                //获取角色分类
    return axios.post('/role_category',data)
}

export const setRoles = (data) => {                //编辑角色
    return axios.post('/roles/edit',data)
}

export const addRoles = (data) => {                //新增角色
    return axios.post('/roles/add',data)
}

export const deleteRoles = (data) => {                //删除角色
    return axios.post('/roles/delete',data)
}

export const getStaffList = (data) => {                //获取人员列表带详情
    return axios.post('/staff_list',data)
}
 
export const getSupWorkerList = (data) => {                //获取护工列表带详情
    return axios.post('un_staff_list',data)
}
 


export const getStaffsList = (data) => {                //获取人员列表JSON
    return axios.post('/staff/get_staffs',data)
}

export const getUserPermission = (data) => {                //获取id人员菜单权限
    return axios.post('/get_user_permission',data)
}

export const setUserPermission = (data) => {                //设置id人员菜单权限
    return axios.post('/set_user_permission',data)
}

export const getUserRoles = (data) => {                //获取当前人员的角色
    return axios.post('/get_roles',data)
}

export const setUserRoles = (data) => {                //获取当前人员的角色
    return axios.post('/staff/edit',data)
}

export const getDataAuth = (data) => {                //获取当前人员数据权限
    return axios.post('/get_data_auth',data)
}

export const setDataAuth = (data) => {                //设置当前人员数据权限
    return axios.post('/set_data_auth',data)
}

export const getAllDataAuth = (data) => {                //获取所有数据权限
    return axios.post('/org_tree',data)
}

export const getOrgList = (data) => {                //获取公司列表
    return axios.post('/get_org_list',data)
}

export const getHplList = (data) => {                //获取项目列表
    return axios.post('/get_hpl_list',data)
}

export const getGroupList = (data) => {                //获取护理组列表
    return axios.post('/get_group_list',data)
}

export const getDubList = (data) => {                //获取科室列表
    return axios.post('/get_dub_list',data)
}

export const getOss = (scene) => {                //获取OSS
    scene = scene || 'other'
    return axios.post('/api/oss',{scene})
}

