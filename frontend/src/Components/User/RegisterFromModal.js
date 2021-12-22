import React, {useContext, useEffect, useState} from "react";
import "./RegisterFromModal.css";
import {updateUser, createUser} from "../../context/action/auth";
import {GlobalContext} from "../../context/Provider";


const RegisterFromModal = ({ reHandleClose, clickPassword, valueShow, user, userUpdate }) => {
  // Registration Function
  const {notificationDispatch} = useContext(GlobalContext)
  const [regState, setRegState] = useState({
    pk:"",
    name: "",
    email: "",
    password: "",
    password1: "",
  });

  useEffect(() => {
    setRegState({...user})
  },[user])

  const regHandleChange = (e) => {
    setRegState({ ...regState, [e.target.name]: e.target.value });
  };

  const submitUser = (event) => {
    event.preventDefault()
    if(user.email) {
        updateUser(regState)
            .then(res => {
                let data
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    console.log(res.result)
                    //userUpdate(res.result)
                    data = res.message
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    } else {
       createUser(regState)
        .then(res => {
                let data
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    //userUpdate(res.result, true)
                    console.log(res.result)
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }
  }

  return (
    <>
      {regState && <div className="form-register-section">
        <span className="form-register-section-cross" onClick={reHandleClose}>
          <i className="far fa-times-circle"></i>
        </span>
        <h1>File Sharing Platform</h1>

        <form className="form-register" onSubmit={(e) => submitUser(e)}>
          <div className="input-block">
            <label for="login-email">Name</label>
            <div className="input-block-password">
              <input
                  id="login-email"
                  type="text"
                  required
                  placeholder="Name"
                  name="name"
                  value={regState.name}
                  onChange={regHandleChange}
              />
            </div>


            <label for="login-email">Email Address</label>
            <div className="input-block-password">
              <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="Email Address"
                  name="email"
                  value={regState.email}
                  onChange={regHandleChange}
              />
            </div>

            <label for="login-password">Password</label>
            <div className="input-block-password">
              <input
                  id="login-password"
                  type={valueShow ? "text" : "password"}
                  required={!user.email}
                  placeholder="Password"
                  name="password"
                  value={regState.password}
                  onChange={regHandleChange}
              />
              <span onClick={clickPassword}>
                {valueShow ? (
                    <i
                        className="fa fa-eye eye-click"
                        aria-hidden="true"
                        type="button"
                        id="eye"
                    />
                ) : (
                    <i
                        className="fa fa-eye"
                        aria-hidden="true"
                        type="button"
                        id="eye"
                    />
                )}
              </span>
            </div>

            <label for="login-password">Re-enter Password</label>
            <div className="input-block-password">
              <input
                  id="login-password"
                  type={valueShow ? "text" : "password"}
                  required={!user.email}
                  placeholder="Re-enter Password"
                  name="password1"
                  value={regState.password1}
                  onChange={regHandleChange}
              />
              <span onClick={clickPassword}>
                {valueShow ? (
                    <i
                        className="fa fa-eye eye-click"
                        aria-hidden="true"
                        type="button"
                        id="eye"
                    />
                ) : (
                    <i
                        className="fa fa-eye"
                        aria-hidden="true"
                        type="button"
                        id="eye"
                    />
                )}
              </span>
            </div>
          </div>
          <button type="submit" className="btn-login">
              {user.email ? "Update User" : "Register Now"}
          </button>
        </form>
      </div>}
    </>
  );
};

export default RegisterFromModal;
