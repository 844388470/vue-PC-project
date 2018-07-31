import intercepter from './intercepter'
import Paging from '../components/paging.vue'
export default {
    install(Vue, opts) {
        intercepter(Vue, opts)
        Vue.component('Paging',Paging)

        Vue.mixin({
            created() {
                // console.log(this.$options.name + 'created')
            },
            mounted() {
                //console.log(this.$options.name + 'mounted')
            }
        })
    }

}
