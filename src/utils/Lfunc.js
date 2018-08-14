export function getYearMonth(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return date.getFullYear()+'-'+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))
    }
  }else{
    return ''
  }
}

export function getYearMonthDay(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return date.getFullYear()+'-'+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))+'-'+(date.getDate()<10?'0'+date.getDate():date.getDate())
    }
  }else{
    return ''
  }
}

export function getYearMonthDayTime(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return date.getFullYear()+'-'+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))+'-'+(date.getDate()<10?'0'+date.getDate():date.getDate())+' '+(date.getHours() < 10 ? '0' + date.getHours() : date.getHours())+':'+(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+':'+(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    }
  }else{
    return ''
  }
}

export function getHourMinuteSecond(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())+':'+(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+':'+(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    }
  }else{
    return ''
  }
}

export function getHourMinute(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())+':'+(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
  }else{
    return ''
  }
}

export function timerules(rule, value, callback){
      if (!value) {
          callback(new Error('请选择'))
      } else {
          callback()
      }
}

export function filterTree(val, that,rolestree,pk_id){
      if(!val.children || val.children.length!==0){
          for(let i in val.children){
              that.$refs[rolestree].setChecked(val.children[i][pk_id],true)
              filterTree(val.children[i],that,rolestree,pk_id)
          }
      }
}

export function filterName(pk_id, list){
    let n=list.filter(_=>pk_id===_.pk_id)
    return n.length!==0?n[0].name:''
}

export function filterNamePei(pk_id, list,id,name){
    let n=list.filter(_=>pk_id===_[id])
    return n.length!==0?n[0][name]:''
}

export function indexOfId(pk_id, list ,name){
    let n=list.filter(_=>pk_id===_[name])
    return n.length!==0
}
