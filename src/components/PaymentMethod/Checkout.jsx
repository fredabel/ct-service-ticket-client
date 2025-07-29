// App.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation } from "react-router-dom";
const appearance = {
  theme: 'stripe',
};
const stripePromise = loadStripe('pk_test_51RdYbFBTcDdxZuShFWt5nttbiYRBJBS7iKmUYtIUkl4gcK1QIa0PAKho5n4ODYskrWCx3cTEaO6zyKEQ0vUNHVcn00nCaze1O0'); // Replace with your Stripe Public Key

const Checkout = () => {
  const { state } = useLocation();
  const carts = state?.carts;
  return (
    <Elements stripe={stripePromise}  options={{ appearance }}>
      <CheckoutForm carts={carts}/>
    </Elements>
  );
}

export default Checkout;
