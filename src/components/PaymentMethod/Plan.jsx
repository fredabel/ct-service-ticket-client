import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionForm from "./SubscriptionForm";
import Subscription from "./Subscription";

const stripePromise = loadStripe("pk_test_51RdYbFBTcDdxZuShFWt5nttbiYRBJBS7iKmUYtIUkl4gcK1QIa0PAKho5n4ODYskrWCx3cTEaO6zyKEQ0vUNHVcn00nCaze1O0"); // Replace with your Stripe Public Key

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Subscription />
    </Elements>
  );
}

export default App;
