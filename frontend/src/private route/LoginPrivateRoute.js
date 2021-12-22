import React, {useContext, useEffect} from "react";
import {Route, Navigate} from "react-router-dom";
import {GlobalContext} from "../context/Provider";


const LoginPrivateRoute = ({children, auth}) => {
    const {authState} = useContext(GlobalContext)
    console.log(authState)
    return authState.is_authenticated ? children : <Navigate to="/login"/>
}

export default LoginPrivateRoute