
<template>
    <div id="homeindex">
        <div style="padding:15px 0">
            <span class="el-dialog__title" style="vertical-align: middle;line-height: 15px;">菜单列表:</span>
            <el-button @click="append()" type="primary" style="padding: 8px 20px;margin-left:10px;vertical-align: middle;">新增</el-button>
        </div>
        <el-tree
            :data="list"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            style="border:1px solid #ddd;padding:10px"
            :render-content="renderContent">
        </el-tree>
        <el-dialog
            :title="isAdd?'新增':'修改'"
            :visible.sync="dialogVisible"
            width="500px"
            height="500px"
            :center="false">
            <div style="max-height:400px;overflow:auto;">
                <el-form :model="formdata"  label-width="100px" :rules="rules" ref="formdata" label-position="left">
                    <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                        <el-col :span="24">
                            <el-form-item label="名称" prop="name">
                                <el-input  v-model="formdata.name" placeholder="名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="路径" prop="path">
                                <el-input  v-model="formdata.path" placeholder="路径"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="图标" prop="icon">
                                <el-select v-model="formdata.icon" placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in iconlist"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                                    <span style="float: left">{{ item }}</span>
                                    <i :class="'icon iconfont '+item" style="float: right; color: #8492a6; font-size: 20px;padding-left:20px;"></i>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="路由文件名称" prop="rel">
                                <el-input  v-model="formdata.rel" placeholder="路由文件名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="排序" prop="sort">
                                <el-input  v-model="formdata.sort" placeholder="排序"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="概述" prop="desc">
                                <el-input  v-model="formdata.desc" placeholder="概述"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="confirm(isAdd)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from '@/api/public'
import {mapGetters} from 'vuex'
export default {
    name:'homeindex',
    data() {
      return {
        list: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        formdata:{pk_id:'',name:'',pid:'',is_hidden:'0',type:'1',path:'',client_type:'0',permission:'',icon:'',rel:'',sort:'0',desc:''},
        rules:{
            name: [{ required: true, message: '请输入名称'}],
            pid: [{ required: true, message: '请输入父级菜单ID'}]
        },
        dialogVisible:false,
        iconlist:['caigou','anquanbaozhang','kucun','qianshoushenpitongguo','jijianfasong','yingyongchengxu','mobankuangjia','hezuoguanxi','kefu','caiwu','sousuo','shezhi','shouye','lingdang','yonghu','renwu','weizhi','tiaoxingtu','zhexiantu','rili-xi','yinhangqia'],
        isAdd:true
      }
    },
    mounted(){
        this.gettree()
    },
    computed: {
        ...mapGetters(['loading'])
    },
    methods: {
        gettree(){
            api.getMenuList().then(res=>{
                this.list=res.data
            })
        },
        confirm(isadd){
            this.$refs['formdata'].validate((valid) => {
                if (valid) {
                    if(isadd){
                        api.addMenuModule(this.formdata).then(res=>{
                            this.dialogVisible=false
                            this.gettree()
                        }).catch(_=>{})
                    }else{
                        api.updateMenuModule(this.formdata).then(res=>{
                            this.dialogVisible=false
                            this.gettree()
                        }).catch(_=>{})
                    }
                } else {
                    return false
                }
            })
        },
        append(store, data) {
            this.isAdd=true
            this.dialogVisible=true
            this.formdata={pk_id:'',name:'',pid:'',is_hidden:'0',type:'1',path:'',client_type:'0',permission:'',icon:'',rel:'',sort:'0',desc:''}
            if(store){
                this.formdata.pid=data.pk_id
            }else{
                this.formdata.pid=0
            }
        },
        change(store, data){
            this.isAdd=false
            this.dialogVisible=true
            this.formdata={pk_id:'',name:'',pid:'',is_hidden:'0',type:'1',path:'',client_type:'0',permission:'',icon:'',rel:'',sort:'0',desc:''}
            this.formdata.pk_id=data.pk_id
            this.formdata.icon=data.icon
            this.formdata.name=data.name
            this.formdata.path=data.path
            this.formdata.pid=data.pid
            this.formdata.rel=data.rel
            this.formdata.sort=data.sort
            this.formdata.desc=data.desc
        },
        remove(store, data) {
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                api.deleteMenuModule(data.pk_id).then(res=>{
                    this.gettree()
                }).catch(()=>{

                })
            }).catch(_ => {})
        },
        renderContent(h, { node, data, store }) {
            return (
                <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span>
                        <el-button style='font-size: 12px;' type='primary' size='mini' on-click={ () => this.append(node, data) }> 新增 </el-button>
                        <el-button style='font-size: 12px;' type='success' size='mini' on-click={ () => this.change(node, data) }> 修改 </el-button>
                        <el-button style='font-size: 12px;' type='danger' size='mini' on-click={ () => this.remove(node, data) }> 删除 </el-button>
                    </span>
                </span>
            )
        }
    }
  }

</script>
<style lang='scss' scoped>
#homeindex{width:100%;}
</style>
<style lang='scss'>
    #homeindex .el-tree-node__content{padding:5px 0;}
    #homeindex .el-tree span{font-size:15px}
    #homeindex .el-tree .el-button span{font-size:14px}
    #homeindex .el-select{width:100%;}
    #homeindex .el-dialog__close{font-size:20px}
    #homeindex .el-dialog__body{padding-top:10px}
</style>