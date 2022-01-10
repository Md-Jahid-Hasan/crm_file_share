import React, {useContext, useState} from "react";
import "./LoginPage.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {GlobalContext} from "../../context/Provider";
import {useNavigate, useLocation} from "react-router-dom";
import RegisterFromModal from "../User/RegisterFromModal";

import {login} from "../../context/action/auth";

const LoginPage = () => {
  // Login Function
  const {notificationDispatch,authState, authDispatch} = useContext(GlobalContext)
  const history = useNavigate()
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next');

  const [reShow, setReShow] = useState(false)
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const loginHandleChange = (e) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
  };

  // Forgot Modal Function
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const reHandleClose = () => setReShow(false);

  //   Password Eye Function
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const makeLogin = (event) => {
    event.preventDefault()
    login(loginState.email, loginState.password)
        .then(res => {
          let data
          if(res.status === 400) {
            data = res.message
          } else if(res.status === 200){
              authDispatch({
                type: "LOGIN_SUCCESS",
                payload:res.result
              })
              data = res.message
              console.log(res.result)
              if (next) history(next)
              else history("/file")
            }
          notificationDispatch({
              type: "ADD_ALERT",
              payload: data
            })
        })
  }

  return (
    <>
      <div className="login-section">
        <h1>File Sharing Platform</h1>
        <h4>Login with your email & password</h4>

        <form className="form-login" onSubmit={(e) => makeLogin(e)}>
          <div className="input-block">
            <label for="login-email">Email Address</label>
            <div className="input-block-password">
              <input
                id="login-email"
                type="email"
                required
                placeholder="Email Address"
                name="email"
                value={loginState.email}
                onChange={loginHandleChange}
              />
            </div>
          </div>

          <div className="input-block">
            <div className="input-block-password">
              <label for="login-password">Password</label>
              {/*<span for="forgot-password" onClick={handleShow}>*/}
              {/*  Forgot password?*/}
              {/*</span>*/}
            </div>

            <div className="input-block-password">
              <input
                id="login-password"
                type={values.showPassword ? "text" : "password"}
                required
                placeholder="Enter your Password"
                name="password"
                value={loginState.password}
                onChange={loginHandleChange}
              />
              <span onClick={handleClickShowPassword}>
                {values.showPassword ? (
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
            Login
          </button>
          <button className="btn-login" onClick={() => setReShow(true)}>
            Register
          </button>
        </form>
      </div>

      <div>
        <Modal show={show} onHide={handleClose}>
          <ForgotPasswordModal handleClose={handleClose} />
        </Modal>
      </div>

      <div>
        <Modal show={reShow} onHide={reHandleClose}>
            <RegisterFromModal
                reHandleClose={reHandleClose}
                clickPassword={handleClickShowPassword}
                valueShow={values.showPassword}
                user={false}
                //userUpdate={userUpdate}
            />
        </Modal>
      </div>
    </>
  );
};

export default LoginPage;
