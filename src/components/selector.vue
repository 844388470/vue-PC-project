<!-- by your name -->
<template>
    <div id="selector">
        <el-form :model="form" :rules="propRules" ref="selectform" :label-position="labelPosition">
            <el-row :gutter="gutter">
                <el-col :span="colspan[0]" :style="'margin-bottom:'+colspan[4]+'px'">
                    <el-form-item :label="RulesName.org?RulesName.org.name:''" prop="orgid" :label-width="RulesName.org?RulesName.org.width:'0'">
                        <el-select v-model="form.orgid" filterable clearable :placeholder="plac.org || '请选择公司'" v-if="typename.indexOf('org')!==-1" @change="orgChange" :disabled="disable[0]">
                            <el-option
                            v-for="item in $store.getters.org_list"
                            :key="item.pk_id"
                            :label="item.name"
                            :value="item.pk_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="colspan[1]" :style="'margin-bottom:'+colspan[4]+'px'">
                    <el-form-item :label="RulesName.hpl?RulesName.hpl.name:''" prop="hplid" :label-width="RulesName.hpl?RulesName.hpl.width:'0'">
                        <el-select v-model="form.hplid" filterable clearable :placeholder="plac.hpl || '请选择项目'" v-if="typename.indexOf('hpl')!==-1" @change="hplChange" :disabled="disable[1]">
                            <el-option
                            v-for="item in hpl_list"
                            :key="item.pk_id"
                            :label="item.name"
                            :value="item.pk_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="colspan[2]" :style="'margin-bottom:'+colspan[4]+'px'">
                    <el-form-item :label="RulesName.dub?RulesName.dub.name:''" prop="dubid" :label-width="RulesName.dub?RulesName.dub.width:'0'">
                        <el-select v-model="form.dubid" filterable clearable :placeholder="plac.dub || '请选择科室'" v-if="typename.indexOf('dub')!==-1"  :disabled="disable[2]">
                            <el-option
                            v-for="item in dub_list"
                            :key="item.pk_id"
                            :label="item.name"
                            :value="item.pk_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="colspan[3]" :style="'margin-bottom:'+colspan[4]+'px'">
                    <el-form-item :label="RulesName.group?RulesName.group.name:''" prop="groupid" :label-width="RulesName.group?RulesName.group.width:'0'">
                        <el-select v-model="form.groupid" filterable clearable :placeholder="plac.group || '请选择护理组'" v-if="typename.indexOf('group')!==-1"  :disabled="disable[3]">
                            <el-option
                            v-for="item in group_list"
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
</template>

<script>
import * as api from '@/api/public'
export default {
    name:'selector',
    props: {
        gutter:{                            //左右边距
            type:Number,
            default:20
        },
        colspan:{                           //前四个选项分别为org hpl dub group所占一行的宽度 总数为24  最后一项为margin-bottom 
            type:Array,
            default(){
                return [6,6,6,6,0]
            }
        },
        typename:{                          //getSelect返回项的顺序['org'] 则getSelect()返回数组第一项为orgid
            type:Array,
            default(){
                return []
            }
        },
        labelPosition:{                     //表单验证的label-position
            type:String,
            default:'left'
        },  
        propRules:{                         //表单验证规则
            type:Object,
            default(){
                return {}
            }
        },
        plac:{                              //placeholder的提示
            type:Object,
            default(){
                return {}
            }
        },
        all:{                               //fasle只显示type为123的项目 true显示全部
            type:Boolean,
            default:false
        },
        RulesName:{                         //表单验证的名字和宽度
            type:Object,
            default(){
                return {
                    org:{
                        name:'',
                        width:'0'
                    },
                    hpl:{
                        name:'',
                        width:'0'
                    },
                    dub:{
                        name:'',
                        width:'0'
                    },
                    group:{
                        name:'',
                        width:'0'
                    }
                }
            }
        }
    },
    data () {
        return {
            options:[],
            form:{
                orgid:'',
                hplid:'',
                dubid:'',
                groupid:''
            },
            // rules:{
                
            // },
            dub_list:[],
            group_list:[],
            disable:[false,false,false,false]
        }
    },
    methods:{
        verifica(){
            let val=false
            this.$refs['selectform'].validate((valid) => {
                val=valid
                return 
            })
            return val
        },
        clearVerifica(){
            this.$refs['selectform'].clearValidate()
        },
        setSelect(arr){
            if(arr){
                let i=0
                this.form.orgid=arr.org || ''
                this.form.hplid=arr.hpl || ''
                return new Promise((resolve,reject)=>{
                    if(arr.hpl && this.typename.indexOf('dub')!==-1){
                        this.dub_list=[]
                        i++
                        api.getDubList({fk_hpl_id:[this.form.hplid]}).then(res=>{
                            i--
                            this.dub_list=res.data
                            this.form.dubid=arr.dub || ''
                            if(!i)resolve(true)
                        }).catch(()=>{resolve(false)})
                    }
                    if(arr.hpl && this.typename.indexOf('group')!==-1){
                        this.group_list=[]
                        i++
                        api.getGroupList({fk_hpl_id:[this.form.hplid]}).then(res=>{
                            i--
                            this.group_list=res.data
                            this.form.groupid=arr.group || ''
                            if(!i)resolve(true)
                        }).catch(()=>{resolve(false)})
                    }
                    if(!i)resolve(true)
                })
            }else{
                this.form.orgid=''
                this.form.hplid=''
                this.form.dubid=''
                this.form.groupid=''
                this.dub_list=[]
                this.group_list=[]
            }
        },
        getSelect(){
            let Arr=[]
            this.typename.forEach((res,index)=>{
                Arr.push(this.form[res+'id'])
            })
            return Arr
        },
        getSelectName(){
            let Arr={dub:'',group:''}
            this.dub_list.forEach(res=>{
                if(res.pk_id==this.form.dubid)Arr.dub=res.name
            })
            this.group_list.forEach(res=>{
                if(res.pk_id==this.form.groupid)Arr.group=res.name
            })
            return Arr
        },
        orgChange() {
            this.form.hplid=''
            this.hplChange()
        },
        hplChange() {
            this.form.dubid=''
            this.form.groupid=''
            this.dub_list=[]
            this.group_list=[]
            if(this.typename.indexOf('dub')!==-1&&this.form.hplid){
                api.getDubList({fk_hpl_id:[this.form.hplid]}).then(res=>{
                    this.dub_list=res.data
                }).catch(()=>{})
            }
            if(this.typename.indexOf('group')!==-1&&this.form.hplid){
                api.getGroupList({fk_hpl_id:[this.form.hplid]}).then(res=>{
                    this.group_list=res.data
                }).catch(()=>{})
            }
        },
        setdisabled(list){
            this.disable=list
        }
    },
    watch:{
        // propRules(){
        //     // console.log('111')
        //     // this.rules=this.propRules
        // }
    },
    mounted(){
        // this.rules=this.propRules
        // console.log(this.verifica())
    },
    computed: {
        hpl_list(){
            if(this.typename.indexOf('org')!==-1){
                if(this.all){
                    return this.$store.getters.all_hpl_list.filter(_=>_.pid===this.form.orgid)
                }else{
                    return this.$store.getters.hpl_list.filter(_=>_.pid===this.form.orgid)
                }
            }else if(this.typename.indexOf('hpl')!==-1){
                if(this.all){
                    return this.$store.getters.all_hpl_list
                }else{
                    return this.$store.getters.hpl_list
                }
            }
        }
    }
}
</script>
<style lang='scss' scoped>
    
</style>
<style lang='scss'>
    #selector{
        .el-form .el-form-item{
            margin-bottom:0
        }
    }
</style>