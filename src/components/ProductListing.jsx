import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "./Cart/CartContext";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
function ProductListing(){
    const { loadCart } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]) //State store Products
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);    // Error state

    const [show, setShow] = useState(false);
    const [toastBg, setToastBg] = useState('success'); // default is gree
    const [responseMsg, setResponseMsg] = useState(false);

    const {user, isAuthenticated, getAccessTokenSilently, loginWithRedirect} = useAuth0();
    
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() =>{
        setLoading(true); // Start loading
        axios.get(`${backend_url}/products`)
        .then(response => {
            console.log(response.data)
            setProducts(response.data.items);
            setTimeout(() => {
                setLoading(false);
            }, 1000); 
        }).catch(error =>{
            setError(`Failed to fetch products: ${error.message}`);
            setLoading(false);
        })
    },[])

    const handleProductDetails = (productId) => {
        navigate(`/products/${productId}`);
    }
    const addToCart = async (product) => {
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.post(`${backend_url}/cart_items/`,{
                product_id: product.id,
                quantity: 1
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if(res.status === 201){
                setResponseMsg(res.data.message)
                setToastBg('success');
                await loadCart();
            }else{
                setError(res.data.message || 'Please try again.');
                setToastBg('danger');
            }

        }catch(err){

            setError(`${err.response.data.message}`);
            setResponseMsg(err.response?.data?.message || 'Something went wrong.');
            setToastBg('danger');
            setShow(true);
        }finally {
            setLoading(false);
        }     
    }

    const convertPrice = (price) => {
        return parseFloat(price).toFixed(2)
    }
    
    if(error){
        return(
           <ErrorMessage errMsg={error} modal={true} redirect={'/'} />
        )
    }

    const handleLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: "/products",
            },
            authorizationParams: {
                prompt: "login",
            },
        });
    };

    return(
        <Container fluid >
            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setShow(false)} show={show} bg={toastBg} delay={3000} autohide>
                    <Toast.Body className="text-white">{responseMsg}</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="d-flex flex-row flex-wrap justify-content-center py-5">
                {
                    products.map((product,index) => (
                        <div key={index}  className="product-container position-relative m-3 p-4 shadow rounded" >
                            <div className="">
                                {
                                    !loading ?
                                    <img src={product.image_url}   alt={product.name} className="product-img" onClick={() => handleProductDetails(product.id)} />
                                    : <Placeholder animation="glow" ><Placeholder className="mb-5 product-img"/></Placeholder>
                                    
                                }
                            </div>
                            <div className="px-3 w-100 position-absolute z-1  bottom-0 end-0">
                                <div className="px-3 py-2 bg-body-tertiary shadow rounded-4 mb-3" >
                                    {
                                        !loading ? 
                                            <div className="d-flex flex-row justify-content-between align-items-center">
                                                <div className="fw-bold"><small className="">$</small>{convertPrice(product.price)}</div>
                                                <div className="d-flex align-items-center gap-1">  
                                                    <Icon.StarFill className="text-warning" />
                                                    {/* <small className="text-secondary fw-bold">{product.rating.rate}</small> */}
                                
                                                </div>
                                            </div>
                                        :
                                        <Placeholder animation="glow">
                                            <Placeholder xs={6} />
                                        </Placeholder>     
                                    }
                                    <div className="text-secondary text-truncate">
                                        {
                                            !loading ? product.name  :  <Placeholder animation="glow"><Placeholder xs={12}/></Placeholder>
                                        }
                                    </div>
                                    { !loading ? 
                                        !isAuthenticated ?
                                            <Button variant="primary" onClick={loginWithRedirect} className="mt-2 btn-sm d-block w-100">Add to cart</Button>
                                        : 
                                            <Button variant="primary" onClick={() => addToCart(product)} className="mt-2 btn-sm d-block w-100">Add to cart</Button>
                                        : 
                                        ''
                                    }
                                </div>
                            </div>    
                        </div>
                    ))
                }
            </div>
        </Container>
    )
}
export default ProductListing;