import { 
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement, 
  AddressElement, 
  useStripe, 
  useElements } from '@stripe/react-stripe-js';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import useResponsiveFontSize from './UseResponsiveFontSize';  
import { useAuth0 } from "@auth0/auth0-react";
import SubscriptionItem from "./SubscriptionItem";

function SubscriptionForm({ plan , onCancel}) {
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [email, setEmail] = useState(user.email);

    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
  
    const useOptions = () => {
      const fontSize = useResponsiveFontSize();
      const options = useMemo(
        () => ({
          style: {
            base: {
              fontSize,
              color: "#424770",
              letterSpacing: "0.025em",
              fontFamily: "Source Code Pro, monospace",
              "::placeholder": {
                color: "#aab7c4"
              },
            },
            invalid: {
              color: "#9e2146"
            }
          }
        }),
        [fontSize]
      );
  
      return options;
    };

    const options = useOptions();

    // Track completeness of each element
    const [cardComplete, setCardComplete] = useState(false);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [cvcComplete, setCvcComplete] = useState(false);
    const [addressComplete, setAddressComplete] = useState(false);
    const [billingDetails, setBillingDetails] = useState({});

    // Handlers for Stripe Elements
    const handleCardChange = (event) => setCardComplete(event.complete);
    const handleExpiryChange = (event) => setExpiryComplete(event.complete);
    const handleCvcChange = (event) => setCvcComplete(event.complete);
    const handleAddressChange = (event) => {
        setAddressComplete(event.complete);
        if (event.complete) setBillingDetails(event.value);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        // const {error, paymentMethod} = await stripe.createPaymentMethod({
        //     type: "card",
        //     card: elements.getElement(CardNumberElement),
        //     billing_details: {
        //         address: billingDetails.address,
        //         name: billingDetails.name,
        //         email: email,
        //     }
        // });

        // const paymentMethodId = paymentMethod.id;

        const token = await getAccessTokenSilently();
        const res = await axios.post(`${backend_url}/customers/create-checkout-session`, {
            email: email,
            name: billingDetails.name,
            priceId: plan.prices[0].id, // Assuming you want to use the first price
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const { clientSecret } = res.data;
    // Confirm the payment immediately
    const result = await stripe.confirmCardPayment(clientSecret);

    // const result = await stripe.confirmCardPayment(clientSecret, {
    //     payment_method: {
    //         card: elements.getElement(CardNumberElement),
    //         billing_details: {
    //             address: billingDetails.address,
    //             name: billingDetails.name,
    //             email: email,
    //         }
    //     },
    // });

    if (result.error) {
        console.error("Payment failed:", result.error.message);
        alert("Payment failed: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
        console.log("✅ Subscription active!");
        alert("Payment successful. You're now subscribed!");
    }
  };

  return (
    <Container>
        <div className="d-flex flex-lg-row flex-column flex-md-column  py-5 gap-5">
            <div className="flex-fill ">
                <div className="p-4 ">
                    <h3>Fred's Platform</h3>
                    <small className="text-muted">Input the test card details.</small>
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Label>Card Number</Form.Label>
                        <div className="mb-3 px-3 py-2 border border-1 rounded">
                            <CardNumberElement options={options} onChange={handleCardChange}/>  
                        </div>
                       
                        <Row>
                            <Col sm={6}>
                                <Form.Label>Expiration Date</Form.Label>
                                <div className="mb-3 px-3 py-2 border border-1 rounded">
                                    <CardExpiryElement options={options} onChange={handleExpiryChange}/>  
                                </div>
                            </Col>
                            <Col sm={6}>
                                <Form.Label>CVC</Form.Label>
                                <div className="mb-3 px-3 py-2 border border-1 rounded">
                                    <CardCvcElement options={options} onChange={handleCvcChange}/>  
                                </div>
                            </Col>
                        </Row>
                        <Form.Label>Billing Information</Form.Label>
                            <div className="mb-3 p-4 border border-1 rounded">
                                <AddressElement options={{ mode: 'billing', defaultValues: { country: 'US', name: user?.name} }} onChange={handleAddressChange} />
                            </div>
                            <div className="d-flex flex-row justify-content-center gap-1">
                                <Button className="w-25" variant="light" onClick={onCancel}>Cancel </Button>
                                <Button 
                                className="flex-grow-1" 
                                    type="submit"  
                                    disabled={
                                        !stripe ||
                                        !cardComplete ||
                                        !expiryComplete ||
                                        !cvcComplete ||
                                        !addressComplete
                                    }>
                                    Subscribe
                                </Button>
                            </div>
                    </Form>
                </div>
            </div>
      
            <div className="flex-fill mb-5 p-4">
                <div className="p-4 bg-light rounded mb-4">
                    <h5>Test Card</h5>
                    <p>
                        <strong>Card Number:</strong> 4242 4242 4242 4242 <br />
                        <strong>Expiration Date:</strong> Any future date <br />
                        <strong>CVC:</strong> Any 3 digits <br />
                        <strong>Billing Address:</strong> Any valid address
                    </p>
                   
                </div>
              
                {
                    plan ?
                        <div className="p-4 shadow rounded ">
                            <div className="d-flex flex-column ">
                                <SubscriptionItem  plan={plan}/>
                            </div>
                        </div>

                    : ''
                }
            </div>
        </div>
    </Container>
  );
}

export default SubscriptionForm;

