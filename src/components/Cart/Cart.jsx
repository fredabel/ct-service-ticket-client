import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Form, Button, Placeholder, Spinner } from "react-bootstrap";

import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "./CartContext";
import CartProductItem from "./CartProductItem";
import ErrorMessage from "../ErrorMessage";

function Cart(){

    const { cart, updateCart } = useCart();
    const navigate = useNavigate();
    const {getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const [selectedItems, setSelectedItems] = useState([]);

    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    //Apply Coupon Code
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [discountValue, setDiscountValue] = useState('')
    const [couponError, setCouponError] = useState('');

    const tax =  0;
    const shippingFee = 0;

    if(error){
        return(
           <ErrorMessage errMsg={error} modal={true} redirect={'/'} />
        )
    }

    const handleApplyCouponCode = async () => {
        try {
            setCouponError('');
            setDiscount('');
            const token = await getAccessTokenSilently();
            const response = await axios.get(
                `${backend_url}/discounts/get_code?code=${encodeURIComponent(couponCode)}`,{},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Assume backend returns { valid: true, discount: 0.1 } for 10% off
            if (response.data) {
                const res = response.data
                setDiscount(res);
                const value = res.discount_type == 'percentage' ? '%'+parseFloat(res.discount_value.toFixed(2)) : '$'+res.discount_value
                setDiscountValue(value)
                setCouponError('');
            } else {
                setDiscount('');
                setCouponError('Invalid coupon code');
            }
        } catch (err) {
            setDiscount(0);
            setCouponError('Failed to validate coupon');
        }
    };
    const handleRemoveCouponCode = () =>{
        setCouponCode('')
        setDiscount('')
        
    }
    

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

    const handleRemove = async (itemId) => {
        try{
            setLoading(true);

            const token = await getAccessTokenSilently();
            await axios.delete(`${backend_url}/cart_items/${itemId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedItems = cart.items.filter((item) => item.id !== itemId);
            updateCart(updatedItems);
    
        }catch(error) {
            console.log(error)
            setError(`Failed to fetch cart items: ${error.message}`);
            
        }finally{
            setLoading(false);
        }   
    };

   
    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cart.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map(item => item.id));
        }
    };

    const totalSelectedQty = cart.items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.quantity || 1), 0);

    const totalSelectedPrice = cart.items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0);

    const handleCheckout = async () => {
        const selectedCartItems = cart.items.filter(item => selectedItems.includes(item.id)) .map(item => item.id);
        navigate('/checkout', { state: { items: selectedCartItems, tax: tax, shipping: shippingFee, discount_id: discount.id, discount_amount: Number(discountAmount) } });
    }

    let discountAmount = 0;
    if (discount && discount.discount_type && discount.discount_value) {
        if (discount.discount_type === 'percentage') {
            discountAmount = totalSelectedPrice * parseFloat(discount.discount_value.toFixed(2));
        } else if (discount.discount_type === 'fixed') {
            discountAmount = discount.discount_value;
        }
    }
    const totalAfterDiscount = Math.max(totalSelectedPrice - discountAmount + tax + shippingFee, 0);

    return(
        <Container>
            
            {
                cart.items.length > 0 ?
                    <Row>
                        <Col sm={12} lg={12}>
                            <h3 className="mb-5 fw-bold">Shopping Cart</h3>
                        </Col>
                        <Col className="" lg={8}>
                            {
                                cart ?  <>
                                <div className="d-flex align-items-center mb-2">
                                    <Form.Check // prettier-ignore
                                        type="checkbox"
                                        id="select-all-item"
                                        checked={selectedItems.length === cart.items.length && cart.items.length > 0}
                                        onChange={handleSelectAll} 
                                    />
                                    <label htmlFor="check-all" className="ms-2 fw-semibold">Choose All</label>
                                </div>
                                <div className="shadow rounded-4 p-4 mb-3" key={cart.id}>
                                
                                    {
                                        cart.items.map((product) => (
                                            <CartProductItem 
                                                key={product.id} 
                                                item={product} 
                                                maxQty={product.product.stock}
                                                qty={product.quantity}
                                                onQtyChange={handleQtyChange}
                                                onRemove={handleRemove} 
                                                checked={selectedItems.includes(product.id)}
                                                onCheck={() => handleSelectItem(product.id)}
                                            /> 
                                        ))
                                    }

                                </div> 
                                </>
                                : ''
                            }
                        
                            
                            
                        </Col>
                        <Col lg={4}>
                        {
                            !discount ? 
                                <div className="bg-white p-4 rounded-4 shadow mb-4">
                                    <h6 className="fw-bold mb-3">Coupon Code</h6>
                                    <hr />
                                
                                    <div className="d-flex flex-column align-items-center mt-3">
                                        <input 
                                            type="text" 
                                            className="form-control mb-3 border-0 bg-light py-2" 
                                            placeholder="Enter coupon code" 
                                            value={couponCode || ''}
                                            onChange={e => setCouponCode(e.target.value)}
                                        />
                                        <Button variant="outline-primary" className="w-100 " size="sm" onClick={()=> handleApplyCouponCode()}>Apply</Button>
                                    </div>
                                </div>
                            : ''
                        }
                            
                            <div className="bg-white p-4 rounded-4 shadow mb-5">
                                <div>
                                {
                                        discount ?
                                            <div className="p-2 mb-4 bg-light position-relative">
                                                <Icon.XCircle role="button" size={15} className="text-danger position-absolute end-0 top-0 m-2" aria-label="Close" onClick={() => handleRemoveCouponCode()} />
                                                <div className="bg-light text-center ">
                                                    <div className="text-primary fw-semibold ">{discount.code}</div>
                                                    <div className="text-muted small">{discountValue} Discount </div>
                                                </div>
                                                
                                            </div>
                                        : ''
                                    }
                                

                                    <h6 className="fw-bold mb-3">Order Details</h6>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Total Item:</span>
                                        <span className="fw-semibold">{totalSelectedQty}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Subtotal:</span>
                                        <span className="fw-semibold">${totalSelectedPrice.toFixed(2)}</span>
                                    </div>

                                
                                    {
                                        discount ? 
                                        <div className="d-flex justify-content-between mb-3 mt-3">
                                            <span className="text-muted">Discount:</span>
                                            <span className="fw-semibold ">- ${discountAmount}</span>
                                        </div>
                                        : ''

                                    }
                                    
                                    {
                                        
                                    }
                                    
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Shipping Fee:</span>
                                        {
                                            shippingFee ? 
                                            <span className="fw-semibold">${shippingFee.toFixed(2)}</span>
                                            : <span className="fw-semibold text-success">FREE</span>
                                        }
                                        
                                        
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Tax:</span>
                                        <span className="fw-semibold">${tax.toFixed(2)}</span>
                                    </div>
                                    <hr />

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold">Total</span>
                                        <span className="fw-bold">${totalAfterDiscount.toFixed(2)}</span>
                                    </div>
                                
                                    
                                    <Button variant="success" className="w-100 mt-2 mb-5" onClick={() =>  handleCheckout()} disabled={!selectedItems.length}>Checkout</Button>
                                    
                                    <p className="text-muted small mb-0">
                                        By continuing, I agree with Credit Card, Paylater, Friends, and other payment 
                                        <a href="#" className="text-decoration-underline text-warning"> terms & conditions</a> and 
                                        <a href="#" className="text-decoration-underline text-warning"> privacy policies</a>.
                                    </p>

                                </div>   
                            </div>
                        </Col>
                    </Row>
            :
             <Row>
                <Col sm={12}> 
                    <div className="border p-5">
                        <h5 className="fw-bold">Your cart is empty</h5>
                        <p className="text-muted">You haven't added anything yet.</p>
                        <Button variant="primary" size="sm" className="" onClick={()=> navigate('/products')}>Start shopping</Button>
                    </div>
                </Col>
             </Row>
            }
           
        </Container> 

    )            

}
export default Cart;