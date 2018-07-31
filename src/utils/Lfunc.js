export function getYearMonth(date) {
  if(date){
    if(typeof date=='string'){
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
    if(typeof date=='string'){
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
    if(typeof date=='string'){
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
    if(typeof date=='string'){
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
    if(typeof date=='string'){
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

export function filtername(id, option, value){
      let name=option.filter( _ => id+'' === _.label)
      return name.length!==0?name[0][value]:''
}

