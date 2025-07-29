// CheckoutForm.jsx
import { 
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement, 
  AddressElement, 
  useStripe, 
  useElements } from '@stripe/react-stripe-js';
import { useState, useEffect, useMemo } from 'react';
import {useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import {Container, Row, Col, Form, Card, Button, DropdownButton, Dropdown  } from 'react-bootstrap';
import useResponsiveFontSize from './UseResponsiveFontSize';  
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "../CartContext";


const CheckoutForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  const { cart, updateCart, resetCart } = useCart();

  const [order, setOrder] = useState(null)

  const [loading, setLoading] = useState(true); // Loading state
   const [error, setError] = useState(null); // Error state

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const fontSize = useResponsiveFontSize();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

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
            }
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

  const handleQtyChange = async (itemId, newQty) => {
    try {
      setLoading(true)
      const token = await getAccessTokenSilently();
      await axios.put(`${backend_url}/cart_items/${itemId}`,
          {quantity: newQty}, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
      );
      updateCart(updatedItems);

    } catch (error) {
      setError(`Failed to fetch cart items: ${error.message}`);
      setLoading(false);
    }      
      
  };

  useEffect(() => {
    
    const { items, tax, shipping, discount_id, discount_amount } = location.state || {};
    const handleOrderDetails = async () =>{
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${backend_url}/orders/`, 
        { cart_item_ids: items, cart_id: cart.id, tax_amount: tax, discount_id: discount_id, discount_amount: discount_amount,shipping_amount: shipping },
        { headers: { 'Authorization': `Bearer ${token}`}}
      );
      console.log(response.data.order)
      setOrder(response.data.order)
      setLoading(false)
    }
    handleOrderDetails()
  },[getAccessTokenSilently, location, backend_url, cart.id])
 
  // useEffect(() => {
  //   // Fetch PaymentIntent
  //   const fetchPaymentIntent = async () => {
  //     const token = await getAccessTokenSilently();
  //     const response = await axios.post(`${backend_url}/customers/create-payment-intent`,{
  //       price: totals.subTotal.toString() + "00",
  //       currency: 'usd'
  //     },{
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })
  //     console.log(response)
  //     setClientSecret(response.data.clientSecret);
  //     setPaymentIntentId(response.data.paymentIntentId);
  //   }
  //   if (isAuthenticated){
  //     fetchPaymentIntent();
  //   }
  // }, [totals]);

  const [billingDetails, setBillingDetails] = useState({});

  // Handler for AddressElement changes
  const handleAddressChange = (event) => {
    if (event.complete) {
      setBillingDetails(event.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!isAuthenticated) {
      alert("Please log in to proceed.");
      return;
    }
   
    const token = await getAccessTokenSilently();
    const {data} = await axios.post(`${backend_url}/carts/create-payment-intent`,{
      price: cart.subTotal.toString() + "00",
      currency: 'usd'
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    setClientSecret(data.clientSecret);
    setPaymentIntentId(data.paymentIntentId);
    
    const {error: pmError, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        address: billingDetails.address,
        name: billingDetails.name,
        email: billingDetails.email,
      }
    });
    if (pmError) {
      alert(pmError.message);
      return;
    }
    console.log(paymentMethod.id)
    // Confirm the payment
    const {error, paymentIntent} = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: paymentMethod.id
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      handleCartPayment(data.paymentIntentId)
    }
  };
  const handleCartPayment = async (paymentIntentId) => {
    try{
      setLoading(true)
      const token = await getAccessTokenSilently();
      await axios.put(`${backend_url}/carts/update_cart/${cart.id}`,
      { 
        payment_status: 'paid',
        stripe_session_id: paymentIntentId, 
        subtotal: cart.subTotal, 
        total: cart.subTotal },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }catch(error) {
      console.log(error)
      setError(`Failed to fetch cart items: ${error.message}`);
        
    }finally{
      setLoading(false);
      resetCart();
      navigate('/marketplace')
    }   
  }
  

    // Helper component for description with show more/less
  const DescriptionWithToggle = ({ description }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 100; // characters before truncation

    if (!description) return null;

    const isLong = description.length > maxLength;
    const displayText = expanded || !isLong
      ? description
      : description.slice(0, maxLength) + '...';

    return (
      <div className="text-muted" style={{ fontSize: "0.95em", maxWidth: "500px" }}>
        {displayText}
        {isLong && (
          <span
            role="button"
            style={{  cursor: "pointer", marginLeft: "6px", }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? <Icon.ChevronUp className="fw-bolder"/> : <Icon.ChevronDown className="fw-bolder"/>}
          </span>
        )}
      </div>
    );
  };


  return (
    <Container>
      <Row className="py-5">
        <Col lg={7} md={7} sm={12} className="mb-5">
            {/* <div >
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex rounded mb-3 p-2"
                  style={{ minHeight: "80px" }}
                >
                  <div className="cart-product-img-container me-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-product-img"
                    />
                  </div>
                  <div className="">
                    <div
                      className="fw-bold"
                      style={{
                        minmaxWidth: "200px",
                        
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div className="d-flex align-items-center bg-light px-2 rounded " style={{'width': '100px'}}> 
                      <span>Qty:</span> 
                        <select className="form-select form-select-sm border-0 bg-light" 
                        
                        
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
                        >
                        {
                          Array.from({ length: item.product.stock}, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))
                        }
                      
                      </select>
                    </div>
                    <DescriptionWithToggle description={item.product.description} />
                  
                  </div>
                  <div className="text-end mx-3" style={{ minWidth: "80px" }}>
                    <div className="fw-bold">${(item.product.price * (item.quantity || 1)).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div> */}
            
            
                {
                  order && order.order_items ?
                  <>
                    {
                      order.order_items.map((item) => (
                        <div key={item.id} className="cart-item d-flex justify-content-between align-items-center flex-wrap">
                          <div  className="d-flex align-items-center gap-3 flex-grow-1">
                            <img src={item.product.image_url} alt={item.product.name}  className="cart-item-img" />
                            <div className="mb-2">
                                <div className="fw-semibold cursor-pointer" >{item.product.name}</div>
                                <div className="text-muted small"><DescriptionWithToggle description={item.product.description} /></div>
                            </div>
                          </div>
                          <div key={item.id} className="d-flex align-items-center gap-3 flex-grow-1">
                            <div className="fw-semibold">${item.unit_price}</div> <div className="fw-semibold">x {item.quantity}</div>
                          </div>
                          <div className="fw-semibold text-end" >${item.subtotal}</div>
                        </div>
                      ))
                    }
                    <div className="ps-5 d-flex justify-content-end flex-column p-3 mt-5">
                      <div className="d-flex justify-content-between mb-3 gap-5">
                          <span className="text-muted">Subtotal:</span>
                          <span className="fw-semibold">${order.subtotal_amount}</span>
                      </div>
                      {
                        order.discount_amount ? 
                            <div className="d-flex justify-content-between mb-3 gap-5">
                              <span className="text-muted">Discount:</span>
                              <span className="fw-semibold">-${order.discount_amount}</span>
                          </div>
                          : ''
                      }
                     
                      <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">Shipping Fee:</span>
                          <span className="fw-semibold ">+${order.shipping_amount}</span>
                        </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Tax:</span>
                        <span className="fw-semibold">+${order.tax_amount}</span>
                      </div> 
                          <hr />

                      <div className="d-flex justify-content-between mb-3 mt-3">
                          <h5 className="fw-bold">Total</h5>
                          <h5 className="fw-bold">${order.total_amount}</h5>
                      </div>
                    </div>
                  </>
                  
                  : ''
                 }
          
        </Col>
        <Col lg={5} md={5} sm={12}>
          <Card>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Label>Card Number</Form.Label>
                <Card className="mb-3 p-3">
                  <CardNumberElement options={options} />  
                </Card>
                <Row>
                  <Col sm={6}>
                    <Form.Label>Expiration Date</Form.Label>
                    <Card className="mb-3 p-3">
                      <CardExpiryElement options={options} />  
                    </Card>
                  </Col>
                  <Col sm={6}>
                  <Form.Label>CVC</Form.Label>
                    <Card className="mb-3 p-3" >
                      <CardCvcElement options={options} />  
                    </Card>
                  </Col>
                </Row>
                <Form.Label>Billing Information</Form.Label>
                <Card className="mb-3 p-3">
                  <AddressElement options={{
                    mode: 'billing',
                    defaultValues: {
                      country: 'US'
                  } }}
                  
                  onChange={handleAddressChange}
                  />
                </Card>
                <Button className="mt-2 w-100" type="submit" disabled={!stripe}>Pay</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutForm;
