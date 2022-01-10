import React, {createContext, useEffect, useReducer} from 'react'
import {authInitialState, taskInitialState, notificationState} from './initialState'
import {auth, file, notification} from './reducers'
import axios from "axios";
import {getHeader} from "./action/auth";

export const GlobalContext = createContext({})

const GlobalProvider = ({children}) => {
    const [authState, authDispatch] = useReducer(auth, authInitialState)
    const [fileState, fileDispatch] = useReducer(file, taskInitialState)
    const [alert, notificationDispatch] = useReducer(notification, notificationState)

    const clearAlertData = () => {
        return notificationDispatch({
            type: 'CLEAR_ALERT',
        })
    }

    useEffect(() => {
        console.log(window.location.host)
        authDispatch({
            type: "LOADING_ON",
        })
        axios
            .get(`https://${window.location.host}/api/auth/me/`, getHeader())
            .then(res => {
                console.log(res)
                authDispatch({
                    type: "USER_LOADED",
                    payload: res.data
                })
                authDispatch({
                    type: "LOADING_OFF",
                })
            }).catch(error => {
            authDispatch({
                type: "LOG_OUT",
            })
            authDispatch({
                type: "LOADING_OFF",
            })
        })
    }, [])
    //console.log(authState)

    return (<>
            <GlobalContext.Provider value={{
                authState, authDispatch, fileState, fileDispatch, alert, clearAlertData,
                notificationDispatch
            }}>
                {children}
            </GlobalContext.Provider></>
    )
}

export default GlobalProvider
