
<template>
    <div id="goodsClass" v-loading="lodingtable">
        <div style="padding:15px 0">
            <span class="el-dialog__title vam" style="line-height: 15px;">产品分类:</span>
            <el-button @click="append()" type="primary" style="padding: 8px 20px;margin-left:10px;vertical-align: middle;">新增</el-button>
        </div>
        <el-tree
            :data="list"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            style="border:1px solid #ddd;padding:10px;border-radius: 7px;"
            :render-content="renderContent">
        </el-tree>
        <el-dialog
            :title="formdata.pk_id?'修改':'新增'"
            :visible.sync="dialogVisible"
            width="500px"
            :center="false">
                <div style="height:150px">
                    <el-scrollbar style="height:150px" ref="scrollbar">
                        <el-form :model="formdata"  label-width="100px" :rules="rules" ref="formdata" label-position="left">
                            <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                                <el-col :span="24">
                                    <el-form-item label="分类名称" prop="name">
                                        <el-input  v-model="formdata.name"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="分类编号" prop="class_no">
                                        <el-input  v-model="formdata.class_no"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import * as api from '@/api/Goods/goodsClass'
import {mapGetters} from 'vuex'
import * as vali from '@/utils/validate'
export default {
    name:'goodsClass',
    mixins:[Pagemixin],
    data() {
      return {
        list: [],
        lodingtable:false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        formdata:{pk_id:'',name:'',class_no:'',pid:''},
        rules:{
            name: [{ required: true, message: '请输入名称'}],
            class_no: [{ validator: vali.isNumber,required: true,positive:true}]
        },
        dialogVisible:false
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
            this.lodingtable=true
            api.getGoodsClassList().then(res=>{
                this.list=res.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        confirm(){
            this.$refs['formdata'].validate((valid) => {
                if (valid) {
                    if(this.formdata.pk_id){
                        api.editGoodsClass(this.formdata).then(res=>{
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.dialogVisible=false
                            this.gettree()
                        }).catch(_=>{})
                    }else{
                        api.addGoodsClass(this.formdata).then(res=>{
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
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
            this.dialogVisible=true
            this.verifica('formdata')
            this.formdata={name:'',class_no:'',pid:''}
            if(store){
                this.formdata.pid=data.pk_id
            }else{
                this.formdata.pid=0
            }
        },
        change(store, data){
            this.dialogVisible=true
            this.verifica('formdata')
            this.formdata={pk_id:'',name:'',class_no:'',pid:''}
            this.formdata.pk_id=data.pk_id
            this.formdata.pid=data.pid
            this.formdata.name=data.name
            this.formdata.class_no=data.class_no
        },
        remove(store, data) {
             this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                api.deleteGoodsClass({pk_id:data.pk_id}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.gettree()
                }).catch(()=>{

                })
            }).catch(_ => {})
        },
        renderContent(h, { node, data, store }) {
            console.log(node)
            console.log(data)
            console.log(store)
            return (
                <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span>
                        <el-button style='font-size: 12px;' type='primary' size='mini' v-show={data.level===1} on-click={ () => this.append(node, data) }> 新增 </el-button>
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
#goodsClass{width:100%;}
</style>
<style lang='scss'>
    #goodsClass {
        .el-tree-node__content{padding:5px 0;}
        .el-tree span{font-size:15px}
        .el-tree .el-button span{font-size:14px}
        .el-select{width:100%;}
        .el-dialog__close{font-size:20px}
        .el-dialog__body{padding:10px 20px;}
        .el-scrollbar__wrap{padding-bottom: 17px;}
    }
</style>