import React, { useState,useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { stripePaymentMethodHandler } from "./script";
import axios from "axios";
import {share_file} from "../../context/action/file";
import {GlobalContext} from "../../context/Provider";
import {useNavigate} from 'react-router-dom';


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      lineHeight: "27px",
      color: "#212529",
      fontSize: "1.1rem",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {notificationDispatch} = useContext(GlobalContext)
  const history = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const paymentMethodObj = {
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
        email,
      },
    };

    const {error, paymentMethod} = await stripe.createPaymentMethod(
      paymentMethodObj
    );
    if(!error) {
        try {
            const {id} = paymentMethod
            await share_file(id, props.fileID)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.result)
                    history(`/show/${props.fileID}`)
                } else if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                }
            })
        } catch (error) {
            console.log("Error", error)
        }
    } else {
        console.log(error.message)
    }
    // stripePaymentMethodHandler(
    //   {
    //     result: paymentMethodResult,
    //     amount: props.amount,
    //   },
    //   handleResponse
    // );
  };

  // callback method to handle the response
  const handleResponse = (response) => {
    console.log(response)
    setLoading(false);
    if (response.error) {
      setErrorMsg(
        typeof response.error === "string"
          ? response.error
          : response.error.message
      );
      return;
    }
    props.setPaymentCompleted(response.success ? true : false);
  };

  return (
    <React.Fragment>
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">Pay with card</span>
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-name">Name on card</label>
            <input
              id="cc-name"
              type="text"
              className="form-control"
              placeholder="Name on card"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-email">Email</label>
            <input
              id="cc-email"
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="cc-number">Card Number</label>
            <CardNumberElement
              id="cc-number"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
              //onChange={e => setCardDetails(e.target.valus)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="expiry">Expiration Date</label>
            <CardExpiryElement
              id="expiry"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="cvc">CVC</label>
            <CardCvcElement
              id="cvc"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>

        <hr className="mb-4" />
        <button className="btn btn-dark w-100" type="submit">
          {`PAY ₹${props.amount}`}
        </button>
        {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
      </form>
    </React.Fragment>
  );
};

export default CheckoutForm;
