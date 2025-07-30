import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./Cart/CartContext";
import axios from "axios";
import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import { useAuth0 } from "@auth0/auth0-react";
import moment from 'moment';
const CartHistory = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartHistory, setCartHistory] = useState([])
    
    const {getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchCartItems();
    },[])

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${backend_url}/carts/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartHistory(response.data)
            setLoading(false);
        } catch (error) {
            setError(`Failed to fetch cart items: ${error.message}`);
            setLoading(false);
        }
    };

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

        <div>
            <h1 className="mb-4">Shopping History</h1>
            {
                cartHistory.length > 0 ?
                    cartHistory.map((cart) => (
                        <Card  key={cart.id} className="p-3 mb-4 shadow">
                            <Card.Header className="d-flex flex-row justify-content-between align-items-center">
                                <div className="fw-bold">Cart ID: {cart.id}</div>
                                <div className="d-flex align-items-center gap-1">  
                                    <small className="text-secondary fw-bold">Date: {moment(cart.created_at).format('LL')}</small>
                                </div>
                                {/* <p><strong>Order ID:</strong> {cart.id}</p>
                                <p><strong>Date:</strong> {moment(cart.created_at).format('YYYY-MM-DD')}</p> */}
                                
                            </Card.Header>
                            <Card.Body>

                                {
                                    cart.items.map((item) => (
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
                                    
                                        <DescriptionWithToggle description={item.product.description} />
                                    
                                    </div>
                                        <div className="text-end mx-3" style={{ minWidth: "80px" }}>
                                            <div className="fw-bold">${(item.product.price * (item.quantity || 1)).toFixed(2)}</div>
                                        </div>
                                        <div>
                                            
                                        </div>
                                    </div>
                                ))
                                }

                                
                            </Card.Body>
                        </Card>
                    ))
                : ''
            }
        </div>
    )
}
export default CartHistory;