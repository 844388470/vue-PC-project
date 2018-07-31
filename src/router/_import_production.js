module.exports = file => () => {
    try{
        return import('@/views/' + file + '.vue')
    } catch(err){
        return import('@/views/errorPage/404.vue')
    }
}
