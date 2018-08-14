import intercepter from './intercepter'
import Paging from '../components/paging.vue'
import selector from '../components/selector.vue'
import * as m_utils from '@/utils'
export default {
    install(Vue, opts) {
        intercepter(Vue, opts)
        Vue.component('Paging', Paging)
        Vue.component('selector', selector)
        Vue.mixin({
            data() {
                return {
                    m_utils,
                    fromData: {},
                    _fromData: '', //记录初始数据
                    m_list: [],
                    m_page: {
                        page: 1,
                        limit: 20,
                        total: 10
                    },
                    m_isadd: true, //是否处于添加状态
                    m_editId: '', //编辑id
                    m_delId: [], //删除id (勾选id)
                    m_checkData: [], //勾选的数据
                    m_editData: {}, //编辑数据(选中的数据)
                    m_show: false, //编辑 新增谈框(弹出框)
                    m_loading:false

                }
            },
            computed: {
                //是母婴 环境
                ismy(){
                    //console.log(process.env.type)
                    return process.env.type.includes('my')
                }
            },
            mounted() {
                this._fromData = JSON.parse(JSON.stringify(this.fromData))

            },
            methods: {
                //成功提示
                m_success(mes) { this.$message({  message: mes,type: 'success'})},
                //失败提示
                m_error(mes) {this.$message({  message: mes, type: 'error'}) },
                m_warning(mes) {this.$message({  message: mes, type: 'warning'}) },
                  //待确认对提示框
                m_confirm(data) {
                    let msg = data.msg || ''
                    let title = data.title || '提示'
                    let type = data.type || ''
                    return this.$confirm(msg, title, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type,

                    }).then(() => {
                        return true

                    }).catch(() => {
                        return false
                    })
                },

                //搜索按钮
                m_search() {
                    this.m_page.page = 1
                    this.getDatalist()

                },
                //改变显示个数
                m_changesize(v) {

                    this.m_page.limit = v
                    this.m_page.page = 1
                    this.getDatalist()
                },
                //改变页数
                m_changeindex(v) {
                    this.m_page.page = v
                    this.getDatalist()
                },

                  //表格勾选
                  m_handleSelectionChange(val) {
                    // console.log(val)
                    this.m_delId = []
                    let taht = this
                    val.forEach(ele => {
                        taht.m_delId.push(ele.id)
                    })

                },
                //表格高亮
                m_handleCurrentChange(val) {
                    // console.log(val)
                    if (val) {
                        this.m_editId = val.pk_id
                        this.m_editData = JSON.parse(JSON.stringify(val)) 
                    }
                },

                  //删除确认弹框
                  m_del(row) {
                    this.m_delId = [row.pk_id]
                    if (this.m_delId.length) {
                        this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.delData()
                        }).catch(() => {
                            //取消删除
                        })
                    }
                },

                   //编辑新增数据弹窗
                   optionFrom(isadd) {
                    console.log(1)   
                    this.m_isadd = !!isadd
                    this.fromData = JSON.parse(JSON.stringify(this._fromData))

                    if (this.m_isadd) {
                        //添加
                  
                        this.m_show = true
                    } else {
                        //编辑
                        this.m_show = !!this.m_editId
                        this.fromData = this.m_utils.coverObj(this.fromData, this.m_editData)

                       
                    }
                },

                //点击编辑按钮
                editFrom(row){
                    console.log(row)
                    this.m_isadd = false
                    this.m_editId = row.pk_id
                    try {
                        this.selectedOptions.push(row.province)
                        this.selectedOptions.push(row.city)
                        
                    } catch (error) {
                        
                    }
                   
                    this.fromData = this.m_utils.coverObj(this.fromData, row)
                    this.m_show = true
                },

                   //编辑新增数据 点击确定
                   sureOption() {
                    this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                            if (this.m_isadd) {
                                //新增
                                this.addData()
                            } else {
                                //编辑
                                this.editData()
                            }
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    })

                },
                
            },
            filters: {
                sex(i){
                    if(i==1){return '男'}
                    if(i==2){return '女'}
                    return '未知'
                    
                }  ,
                toTow(v){
                    let n = parseFloat(v)
                    if(isNaN(n)){
                       return v
                    }else{
                        return n.toFixed(2)
                    }
                },
            },
           
        })
    }

}
