export const addItem =(services) =>{
    return{
        type : "ADDITEM",
        payload : services
    }
}

export const delItem =(services) =>{
    return{
        type : "DELITEM",
        payload : services
    }
}


