import axios from 'axios'

export const getMenuList = () => {
    return axios.get('/auth_modules?client_type=0')
}

export const addMenuModule = (data) => {                //新增菜单模块
    return axios.post('/module/add',{
        'name':data.name,
        'pid':data.pid,
        'is_hidden':data.is_hidden,
        'type':data.type,
        'client_type':data.client_type,
        'permission':data.permission,
        'icon':data.icon,
        'path':data.path,
        'rel':data.rel,
        'sort':data.sort,
        'description':data.desc
    })
}

export const updateMenuModule = (data) => {                //修改菜单模块
    return axios.post('/module/update',{
        'pk_id':data.pk_id,
        'name':data.name,
        'pid':data.pid,
        'is_hidden':data.is_hidden,
        'type':data.type,
        'client_type':data.client_type,
        'permission':data.permission,
        'icon':data.icon,
        'path':data.path,
        'rel':data.rel,
        'sort':data.sort,
        'description':data.desc
    })
}

export const deleteMenuModule = (data) => {                //新增菜单模块
    return axios.post('/module/delete',{'pk_id':data})
}

export const getOrgTree = (data) => {                //获取组织机构树形数据
    return axios.post('/get_org_tree',{'type':data})
}
