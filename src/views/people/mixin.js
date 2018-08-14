
import * as api from '@/api/public'
export default {
    data(){
        return {
            dub_list:[],
            group_list:[],

        }
    },
    methods: {
        orgChange() {
            this.form.fk_hpl_id=''
            this.form.fk_group_id=''
            this.group_list=[]
           // this.hplChange()
        },
        hplChange() {
          
            this.form.fk_group_id=''
            
            this.group_list=[]
           
                // api.getDubList({fk_hpl_id:[this.form.hplid]}).then(res=>{
                //     this.dub_list=res.data
                // }).catch(()=>{})
            
            
                api.getGroupList({fk_hpl_id:[this.form.fk_org_id]}).then(res=>{
                    this.group_list=res.data

                }).catch(()=>{})
            
        },    
    },
    computed: {
        hpl_list(){
            return this.$store.getters.hpl_list.filter(_=>_.pid===this.form.fk_org_id)
           
        },
        all_hpl_list(){
            return this.$store.getters.all_hpl_list.filter(_=>_.pid===this.form.fk_org_id)
        }
    }
}