import React, { useState } from "react";
import "./ForgotPasswordModal.css";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Newpassword from "./Newpassword";

const ForgotPasswordModal = ({ handleClose }) => {
  // Forgat Email function
  // Login Function
  const [forgotState, setForgotState] = useState({
    email: "",
  });

  const forgotHandleChange = (e) => {
    setForgotState({ ...forgotState, [e.target.name]: e.target.value });
  };

  // Modal Function
  const [newShow, setNewShow] = useState(false);

  const newHandleClose = () => setNewShow(false);
  const newHandleShow = () => setNewShow(true);

  return (
    <>
      <div className="forgot-password-section">
        <span className="forgot-password-section-cross" onClick={handleClose}>
          <i className="far fa-times-circle"></i>
        </span>
        <h1>File Sharing Platform</h1>
        <h4>We'll send you a link to reset your password</h4>

        <form className="form-forgot">
          <div className="input-block">
            <label>Email Address</label>
            <div className="input-block-password">
              <input
                id="login-email"
                type="email"
                required
                placeholder="Email Address"
                name="email"
                value={forgotState.email}
                onChange={forgotHandleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn-login" onClick={newHandleShow}>
            Submit Email
          </button>
        </form>

        <p className="or">
          <span>or</span>
        </p>

        <div className="form-forgot-footer">
          <p>Back to</p>
          <p onClick={handleClose}>Login</p>
        </div>
      </div>

      <div>
        <Modal show={newShow} onHide={newHandleClose}>
          <Newpassword newHandleClose={newHandleClose} />
        </Modal>
      </div>
    </>
  );
};

export default ForgotPasswordModal;
