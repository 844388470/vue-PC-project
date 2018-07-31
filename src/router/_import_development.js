module.exports = file => {
  try{
      return require('@/views/' + file + '.vue').default
  } catch(err){
      return  require('@/views/errorPage/404.vue').default
  }
} // vue-loader at least v13.0.0+
