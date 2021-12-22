import React, {useState, useEffect, useContext, useRef} from 'react';
import {GlobalContext} from "../context/Provider";
import Alert from 'react-bootstrap/Alert'

const Notification = () => {
    const loaded = useRef(false)
    const [msgStatus, setMsgStatus] = useState(false)
    const [msg, setMsg] = useState("")
    const [status, setStatus] = useState("info")
    const {alert, clearAlertData} = useContext(GlobalContext)


    useEffect(() => {
        if (loaded.current) {
            if (alert.message) {
                setMsg(alert.message)
                setStatus(alert.code)
                setMsgStatus(true)
                const timer = setInterval(() => {setMsgStatus(false)
                    clearAlertData()}, 5000)
                return () => clearInterval(timer)
            } else{
                setMsgStatus(false)
            }
        } else{
            loaded.current = true
        }
    }, [alert.message])


    return(
        <div>
            <Alert variant={status} show={msgStatus}>
                    {msg}
              </Alert>

        </div>
    )
}

export default Notification