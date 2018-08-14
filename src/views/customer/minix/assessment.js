import * as api from '@/api/customer'
import moment from 'moment'
export default{
    data(){
        return {
            bathelTableShow:false, //评估列表弹出框
            bathelShow:false, //评估弹出框
            bathelList:[] , //评估列表
            batheLoading:false ,
            batheFromLoading:false,
            isbatheEdit:0,
            bathelSearch:{
                custom_id:'',
                page:1,
                limit:10,
                total:10,          
            },
            _bathelSearch:{},
            bathelId:'',
            bathelFormData: {
                custom_id: '', //客户ID
                assess_day: new Date(), //评估日期
                total_score: 0, //总评分
                eat: 'a', //进食
                bath: 'a', //洗澡
                dress: 'a', //穿衣
                embellish: 'a', //修饰
                control_shit: 'a', //控制大便
                control_piss: 'a', //控制小便
                toilet: 'a', //如厕
                move_stuff: 'a', //床椅转移
                move_on_ground: 'a', //平地行走
                up_down_stair: 'a', //上下楼梯
              },
              _bathelFormData:{},

            batheDataValue:[
                {key:'eat',name:'进食',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
                {key:'bath',name:'洗澡',value:[{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-2'},{dis:true,v:'-1'}]},
                {key:'embellish',name:'修饰',value:[{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-2'},{dis:true,v:'-1'}]},
      
                {key:'dress',name:'穿衣',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]}, 
      
                {key:'control_shit',name:'控制大便',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
                {key:'control_piss',name:'控制小便',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
                {key:'toilet',name:'如厕',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
      
                {key:'move_stuff',name:'床椅转移',value:[{dis:false,v:15},{dis:false,v:10},{dis:false,v:5},{dis:false,v:0}]},
                {key:'move_on_ground',name:'平地行走',value:[{dis:false,v:15},{dis:false,v:10},{dis:false,v:5},{dis:false,v:0}]},
                {key:'up_down_stair',name:'上下楼梯',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]}
                ]
          
        }
    },

    computed: {
        bathelTotal(){
            let arr = ['eat' , 'bath' , 'dress' ,'embellish' ,'control_shit' , 'control_piss' ,'toilet' ,'move_stuff' ,'move_on_ground' ,'up_down_stair']
             let t = 0
             arr.forEach(item=>{
                 let num = Number(this.bathelFormData[item])
                 if(isNaN(num)){
                     num = 0
                 }else{
                     t+=num
                 }
             })
             return t
        }
    },

    mounted () {
        this._bathelSearch = JSON.parse(JSON.stringify(this.bathelSearch))
        this._bathelFormData = JSON.parse(JSON.stringify(this.bathelFormData))
    },
    methods:{
        //点击历史评估
        bathelHandel(){
            this.bathelSearch.custom_id = this.m_editData.pk_id
            if(!this.bathelSearch.custom_id){
                this.m_warning('请选择客户')
                return false
            }
            this.bathelTableShow = true
            this.history()

        },

        //获取历史评估列表
        history(){
            
          this.batheLoading = true
          api.history(this.bathelSearch).then(res=>{
              this.bathelList = res.data.data
              this.bathelSearch.total = res.data.total
              console.log(this.bathelSearch)
              this.batheLoading = false
          })
        },

        //改变页数
        bathelPageChange(page){
       // console.log(page)
        this.bathelSearch.page= page
        this.history()
        },
        
       //评估明细
        bathel_show(){
          api.bathel_show(this.bathelId).then(res=>{
              console.log(res)
              this.bathelFormData = res.data
          })
        },


        //编辑
        editBathel(row){
            console.log(row)
            this.bathelId =row.evaluation_id || row.pk_id
            
            this.bathel_show()
            this.isbatheEdit = true
            this.bathelShow = true
        },
    
        editBathelApi(){
          Object.assign(this.bathelFormData,{pk_id:this.bathelId})
          api.bathel_update(this.bathelFormData).then(res=>{
              this.m_success('修改成功')
              this.history()
              this.getDatalist()
              this.bathelShow = false
              this.batheFromLoading = false
          }).catch(res=>{this.batheFromLoading = false})
        },

        addBathelApi(){      

            api.bathel_add(this.bathelFormData).then(res=>{
                this.m_success('新增成功')
                this.history()
                this.getDatalist()
                this.bathelShow = false
                this.batheFromLoading = false
            }).catch(res=>{this.batheFromLoading = false})
          },

        //删除
        delBathel(row){
            this.bathelId = row.pk_id
            if(this.bathelId){
                this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   api.bathel_del([this.bathelId]).then(res=>{
                       this.m_success('删除成功')
                       this.history()
                       this.getDatalist()
                       
                   })
                }).catch(() => { })
                     
            }
        },
        
        //添加
        addBathel(){
            this.bathelFormData.custom_id = this.m_editData.pk_id
            if(!this.bathelFormData.custom_id){
                this.m_warning('请选择客户')
                return false
            }
            this.isbatheEdit = false
            this.bathelShow = true

        },
        

        //确定编辑 添加按钮
        batheSureOption(){
           this.batheFromLoading = true
           if(this.isbatheEdit){
               this.editBathelApi()
           }else{
               this.addBathelApi()
           }
        }


    },
    watch:{
        bathelTableShow(v){
            if(!v){
                this.bathelList = []
                this.bathelSearch = JSON.parse(JSON.stringify(this._bathelSearch))
            }
        },

        bathelShow(v){
            if(!v){
               
                this.bathelFormData = JSON.parse(JSON.stringify(this._bathelFormData))
            }
        }
    }
}