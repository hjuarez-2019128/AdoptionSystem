
export const checkUpdate = (data, animalId)=>{
    if(animalId){
        if(Object.entries(data).length === 0){
            return false
        }
        return true
    }else{
        return false
    }
}