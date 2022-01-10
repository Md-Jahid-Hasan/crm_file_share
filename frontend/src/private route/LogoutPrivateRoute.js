import React, {useContext, useEffect} from "react";
import {Route, Navigate} from "react-router-dom";
import {GlobalContext} from "../context/Provider";


const LogOutPrivateRoute = ({children}) => {
    const {authState} = useContext(GlobalContext)

    return !authState.is_authenticated ? children : <Navigate to="/"/>
}

export default LogOutPrivateRoute
