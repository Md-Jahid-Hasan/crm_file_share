import React, { useState } from "react";

const Newpassword = ({ newHandleClose }) => {
  // NewPassword Function
  const [newPasswordState, setNewPasswordState] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const newPsswordHandleChange = (e) => {
    setNewPasswordState({
      ...newPasswordState,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div className="forgot-password-section">
        <span
          className="forgot-password-section-cross"
          onClick={newHandleClose}
        >
          <i className="far fa-times-circle"></i>
        </span>
        <h1>File Sharing Platform</h1>
        <h4>We'll send you a link to reset your password</h4>

        <form className="form-forgot submit-btn">
          <div className="input-block">
            <label>New Password</label>
            <div className="input-block-password">
              <input
                id="login-email"
                type="password"
                required
                placeholder="New Password"
                name="newPassword"
                value={newPasswordState.newPassword}
                onChange={newPsswordHandleChange}
              />
            </div>
            <br />

            <label>Confirm Password</label>
            <div className="input-block-password">
              <input
                id="login-email"
                type="password"
                required
                placeholder="Confirm Password"
                name="confirmPassword"
                value={newPasswordState.confirmPassword}
                onChange={newPsswordHandleChange}
              />
            </div>
          </div>
          <br />
          <button type="submit" className="btn-login ">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Newpassword;
