import * as api from '@/api/customer'
export default{
    data () {
        return {
            familyTableShow:false, //家属表格弹框
            familyList:[] , //家属列表
            infoLoading:false , //
            babyTableShow:false, //婴儿表格弹框
            babyList:[] , //婴儿列表
            custom_id:'' , //客户ID
            isFamily:true,
        }
    },
    methods:{
         //点击信息
         // i = 0 , 家属  i=1 婴儿
         clickInfo(row,i){
          this.custom_id = row.pk_id
         // console.log(row)
          this.isFamily = !i
          this.infoLoading = true
          if(this.isFamily){
              this.familyTableShow = true
              this.custom_family()
          }else{
              this.babyTableShow = true
              this.custom_baby()
          }
         },

         //获取家属列表
         custom_family(){
             api.custom_family(this.custom_id).then(res=>{
                 this.familyList = res.data
                 this.infoLoading = false
             }).catch(res=>{ this.infoLoading = false})
         },

         //获取婴儿列表
         custom_baby(){
             api.custom_baby(this.custom_id).then(res=>{
                this.babyList = res.data
                this.infoLoading = false
             }).catch(res=>{ this.infoLoading = false})
         }

    }
}