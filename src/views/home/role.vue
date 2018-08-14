<!-- by your name -->
<template>
    <div id="roles"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10">
            <el-col :span="4">
                <el-input v-model="search.search" placeholder="角色"></el-input>
            </el-col>
            <el-col :span="20" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" @click="opendetail" type="primary">新增角色</el-button>
                <el-button size="small" @click="openeditor(role_id,0)" type="primary">设置PC权限</el-button>
                <el-button size="small" @click="openeditor(role_id,1)" type="primary">设置APP权限</el-button>
                <el-button size="small" @click="deleterole(deletelist)" type="danger">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @current-change="setedit"
            @selection-change="setdelete">
            <el-table-column
                type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="name" align="center" label="角色" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                align="center" label="角色分类" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{pub.filterName(scope.row.pid,RoleCategory)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="opendetail(scope.row)">编辑</span><span class="spanr" @click="deleterole([scope.row.pk_id])">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            width="600px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <div v-loading="lodingrole" element-loading-text="拼命加载中">
                            <el-tree
                            :data="treedata"
                            default-expand-all
                            show-checkbox
                            check-strictly
                            node-key="pk_id"
                            ref="rolestree"
                            highlight-current
                            :props="{label: 'name'}"
                            :expand-on-click-node="false"
                            @current-change="menuAllCheck"
                            @check-change="checkmenu">
                            </el-tree>
                        </div>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="upeditor" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="centerDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="detail"
            :visible.sync="detailDialogVisible"
            width="400px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <div v-loading="lodingrole" element-loading-text="拼命加载中">
                            <el-form :model="formdata"  label-width="100px" :rules="rules" ref="formdata" label-position="left">
                                <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                                    <el-col :span="24">
                                        <el-form-item label="角色名称" prop="name">
                                            <el-input  v-model="formdata.name" placeholder="名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="角色分类" prop="pid">
                                            <el-select v-model="formdata.pid" placeholder="请选择">
                                                <el-option
                                                    v-for="item in RoleCategory"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="updetail" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="detailDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import {mapGetters} from 'vuex'
import * as api from '@/api/public'
import * as pub from '@/utils/Lfunc'
export default {
    name:'roles',
    mixins:[Pagemixin],
    data () {
        return {
            pub,
            name:'',
            lodingtable:false,
            lodingrole:false,
            centerDialogVisible:false,
            detailDialogVisible:false,
            search:{
                search:''
            },
            formdata:{
                pk_id:'',
                name:'',
                pid:''
            },
            rules:{
                name:[{ required: true, message: '请输入角色名称'}],
                pid:[{ required: true, message: '请选择角色分类'}]
            },
            role_id:'',
            client_type:'',
            list:[],
            treedata:[],
            deletelist:[],
            RoleCategory:[],
            rolemenupc_list:[],
            rolemenuapp_list:[]
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
        api.getRoleCategory().then(_=>{
            this.RoleCategory=_.data
        }).catch(_=>{})
        api.getAllMenuList(0).then(res=>{
            this.rolemenupc_list=res.data
        }).catch(_=>{})
        api.getAllMenuList(1).then(res=>{
            this.rolemenuapp_list=res.data
        }).catch(_=>{})
    },
    methods:{
        getList(){
            let data={
                'search':this.search.search,
                'limit':this.page.size,
                'page':this.page.index
            }
            this.role_id=''
            this.lodingtable=true
            api.getRolesList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        opendetail(row){                            //编辑角色详情
            this.detailDialogVisible=true
            this.verifica('formdata')
            this.formdata={pk_id:'',name:'',pid:''}
            if(row){
                this.formdata.pk_id=row.pk_id
                this.formdata.name=row.name
                this.formdata.pid=row.pid
            }
        },
        updetail(){                                 //确认编辑角色详情
            this.$refs['formdata'].validate((valid) => {
                if (valid) {
                    if(this.formdata.pk_id){
                        api.setRoles(this.formdata).then(res=>{
                            this.detailDialogVisible=false
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            this.getList()
                        }).catch(_=>{})
                    }else{
                        api.addRoles({name:this.formdata.name,pid:this.formdata.pid}).then(res=>{
                            this.detailDialogVisible=false
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.getList()
                        }).catch(_=>{})
                    }
                } else {
                    return false
                }
            })
        },
        openeditor(val,isPc){                       //打开权限详情
            if(!this.role_id){
                this.$message({
                    message: '请选择角色',
                    type: 'warning'
                })
                return
            }
            this.centerDialogVisible=true
            this.client_type=isPc
            this.role_id=val
            if(isPc){
                this.treedata=this.rolemenuapp_list
            }else{
                this.treedata=this.rolemenupc_list
            }
            this.lodingrole=true
            setTimeout(_=>{
                this.$refs.rolestree.setCheckedKeys([])
                this.$refs.scrollbar.wrap.scrollTop=0
                api.getRolesPermission({role_id:val,client_type:isPc}).then(_=>{
                    this.$refs.rolestree.setCheckedKeys(_.data)
                    this.lodingrole=false
                }).catch(_=>{
                    this.lodingrole=false
                })
            },100)
        },
        upeditor(){                                 //确认权限详情
            api.setRolesPermission({role_id:this.role_id,client_type:this.client_type,permission:this.$refs.rolestree.getCheckedKeys()}).then(_=>{
                this.$message({
                    message: '设置成功',
                    type: 'success'
                })
                this.centerDialogVisible=false
                this.getList()
            }).catch(_=>{
                this.centerDialogVisible=false
            })
        },
        menuAllCheck(val,n){                                   //设置菜单列表全选
            n.checked=!n.checked
            if(n.checked){
                pub.filterTree(val,this,'rolestree','pk_id')
            }
        },
        checkmenu(val,n,m){                                    //设置上级被连选
            if(n&&val.pid!==0){
                this.$refs.rolestree.setChecked(val.pid,true)
            }else if(!n){
                for(var i in val.children){
                    this.$refs.rolestree.setChecked(val.children[i].pk_id,false,false)
                }
            }
        },
        setedit(val){
            if(val){
                this.role_id=val.pk_id
            }else this.role_id=''
        },
        setdelete(val){
            this.deletelist=[]
            for(let i in val){
                this.deletelist.push(val[i].pk_id)
            }
        },
        deleterole(id){
            if(!id || id.length===0){
                this.$message({
                    message: '请勾选删除项',
                    type: 'warning'
                })
                return 
            }
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                api.deleteRoles({pk_id:id}).then(res=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.getList()
                }).catch(()=>{

                })
            }).catch(_ => {})
        }
    },
    computed:{
        ...mapGetters(['loading'])
    }
}

</script>
<style lang='scss' scoped>
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #f56c6c;margin-right:5px;cursor: pointer;}
</style>
<style lang='scss'>
    #roles{
        .el-tree-node__content{padding:5px 0;}
        .el-tree span{font-size:15px}
        .el-tree .el-button span{font-size:14px}
        .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .detail .el-dialog{
            margin-top:0;
            top:30%;
            height:40%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 0;
            padding-bottom: 10px;
            top: 50px;
            bottom: 76px;
            left:0;right:0;
        }
        .el-dialog__footer{
            position: absolute;
            bottom: 0;
            left:0;right:0;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
    }
</style>