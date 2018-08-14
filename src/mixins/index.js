module.exports={
    data(){
        return{
            page:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            radioId:'',                                 //table单选中的id
            sort:'',                                    //升序降序
            sort_type:''                                //升序降序的类型
        }
    },
    methods:{
        changesize(val){                                 //改变分页数量
            this.page.size=val
            this.page.index=1
            try{
                this.getList()
            }catch(res){
                
            }
        },
        changeindex(val){                                //改变当前页
            this.page.index=val
            try{
                this.getList()
            }catch(res){
                
            }
        },
        tableSortEvent(val){                                   //table  排序事件
            if(val){
                this.sort=val.prop
                if(val.order==='ascending'){
                    this.sort_type='asc'
                }else{
                    this.sort_type='desc'
                }
            }else{
                this.sort=''
                this.sort_type=''
            }
            this.page.index=1
            try{
                this.getList()
            }catch(res){}
        },
        tableRadioEvent(val){                                   //table  单选事件
            if(val){
                this.radioId=val.pk_id
            }else this.radioId=''
        },
        rollBack(ref){                                          //滚动条归零
            setTimeout(_=>{
                this.$refs[ref].wrap.scrollTop=0
            },100)
        },
        verifica(ref){                                          //取消验证表单
            setTimeout(_=>{
                this.$refs[ref].clearValidate()
            },100)
        }
    }
}
