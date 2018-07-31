// 将对象置为空(form 表单重置)
export const emptyObject =(obj) =>{
    let o = JSON.parse(JSON.stringify(obj))
    for(let i in o){
        o[i] = ( o[i] instanceof Array) ? [] :''
    }
    return o  
}

// obj1 的值覆盖到obj上 , （编辑表单时候用）
export const coverObj = (obj,obj1) =>{
    let o = JSON.parse(JSON.stringify(obj))
    let o1 = JSON.parse(JSON.stringify(obj1))
     for(let i in o ){
         if(o1[i] !='undefined'){
             o[i] = o1[i]
         }else{
            o[i] = ( o[i] instanceof Array) ? [] :''
         }
     }
   return o
}
