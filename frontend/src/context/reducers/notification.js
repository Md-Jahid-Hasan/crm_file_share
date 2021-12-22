const notification = (state, action) => {
    switch(action.type){
        case "CLEAR_ALERT":
            return {...state, message:"", code:""}
        case "ADD_ALERT":
            return {...state, message:action.payload.message, code:action.payload.code}
        default:
            return state
    }
}

export default notification