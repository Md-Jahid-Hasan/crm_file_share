import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./Payment.css";
import {useLocation, useParams} from "react-router-dom";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51K84syADY9vArxrB6do2UmooAB8FSBQWcINerfoBts3lC2jbwLsn96nmIXIReA0tU3r9FrzVFpFM1dOrBCeq3s0P00kb4ojXdX");

const successMessage = () => {
  return (
    <div className="success-msg">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        className="bi bi-check2"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <div className="title">Payment Successful</div>
    </div>
  );
};

const cart = () => {
  return (
    <React.Fragment>
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">Your cart</span>
        <span className="badge bg-secondary badge-pill">3</span>
      </h4>
      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 className="my-0">Product name</h6>
            <small className="text-muted">Brief description</small>
          </div>
          <span className="text-muted">₹1200</span>
        </li>
        <li className="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 className="my-0">Second product</h6>
            <small className="text-muted">Brief description</small>
          </div>
          <span className="text-muted">₹800</span>
        </li>
        <li className="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 className="my-0">Third item</h6>
            <small className="text-muted">Brief description</small>
          </div>
          <span className="text-muted">₹500</span>
        </li>
        <li className="list-group-item d-flex justify-content-between bg-light">
          <div className="text-success">
            <h6 className="my-0">Promo code</h6>
            <small>EXAMPLECODE</small>
          </div>
          <span className="text-success">-₹500</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Total (INR)</span>
          <strong>₹2000</strong>
        </li>
      </ul>
    </React.Fragment>
  );
};

const Payment = () => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const {fileId} = useParams();

  return (
    <>
      <div className="container">
        <div className="py-5 text-center"></div>

        <div className="row s-box">
          {paymentCompleted ? (
            successMessage()
          ) : (
            <React.Fragment>
              <div className="col-md-5 order-md-2 mb-4">{cart()}</div>
              <div className="col-md-7 order-md-1">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={2000}
                    setPaymentCompleted={setPaymentCompleted}
                    fileID={fileId}
                  />
                </Elements>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
