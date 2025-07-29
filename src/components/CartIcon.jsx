import {useState, useEffect, use} from 'react';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { useCart } from "./CartContext";

function CartIcon(){
    const { cart } = useCart();
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true) // Loading state
    // const [error, setError] = useState(null) // Error state
    // const [cartItems, setCartItems] = useState([]) // Cart items state from parent component
    // const [cartCount, setCartCount] = useState(0); // Cart count state from parent component   

    // const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    // const backend_url = import.meta.env.VITE_BACKEND_URL;

    // useEffect(() => {
    //     setLoading(true); // Start loading
    //     const fetchCartItems = async () => {
    //         try {
    //             const token = await getAccessTokenSilently();
    //             const response = await axios.get(`${backend_url}/cart_items`,{}, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });

    //             const cart_items = response.data
              
    //             setCartItems(cart_items);
    //             setCartCount(cart_items.length)
    //             setLoading(false);
    //         } catch (error) {
    //             setError(`Failed to fetch cart items: ${error.message}`);
    //             setLoading(false);
    //         }
    //     };
    //     fetchCartItems();
    // },[])


    return (
        <div className="position-relative ">
            <Icon.Cart2 className="fw-bold" size={25} id="cart" role="button" onClick={() => navigate('/cart')} /> 
            <span className="position-absolute top-0 end-80 translate-middle badge rounded-pill bg-danger">{cart.totalQty}</span>
        </div>
    )
}
export default CartIcon;