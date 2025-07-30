import { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { Container, Carousel, Row, Col, Card, Button, Badge ,Spinner, Placeholder  } from 'react-bootstrap';
import { useCart } from "./Cart/CartContext";
const ProductDetails = () =>{
    const { loadCart } = useCart();
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const { productId } = useParams();  
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);

    const [showModal, setShowModal] = useState(false)
    const handleCloseModal = () => setShowModal(false);
    
    useEffect(() =>{
        const fetchProductDetails = async () =>{
            try{
                const productResponse = await axios.get(`${backend_url}/products/${productId}`)
                setProductDetails(productResponse.data)
                setTimeout(() => {
                    setLoading(false); // Stop loading after a delay    
                },2000)
            }catch(error){
                setError(`Failed to fetch: ${error.message}`);
            }
        }
        if(productId){
            fetchProductDetails()
        }
    },[productId])

    const convertPrice = (price) => {
        return parseFloat(price).toFixed(2)
    }

    const addToCart = async () => {
        const token = await getAccessTokenSilently();
        const res = await axios.post(`${backend_url}/cart_items/`,{
            product_id: productId,
            quantity: 1
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(res.status === 201)
            await loadCart();
            console.log("Product added to cart successfully")
    }

    return(
        
        <Container className="">
            <div className="p-5 m-5 shadow rounded">
                {
                    productDetails ? 
                        <Row className="">
                            <Col lg="6" md="12" className="d-flex justify-content-center" >
                            <div className="p-4 border-0 product-detail-image-container">
                                    {
                                        !loading ? <img src={productDetails.image_url} className="img-fluid" /> 
                                        : <Placeholder animation="glow" ><Placeholder className="mb-5 product-detail-image"/></Placeholder>
                                    }
                            </div>
                            </Col>
                            <Col lg="6" md="12" className="d-flex flex-column justify-content-between ">
                                <div className="border border-0">
                                    {
                                        !loading ?  <h3 className="mt-2 mb-4 fw-bold">{productDetails.name}</h3>
                                        : <Placeholder animation="glow" ><Placeholder xs={6} className="mb-5"/></Placeholder>

                                    }
                                
                                    <p className="mb-4">
                                        {
                                            !loading ? <Badge bg="danger" className="text-uppercase">{productDetails.category.name}</Badge>
                                            : <Placeholder animation="glow"><Placeholder xs={4} className="mb-5"/></Placeholder>
                                        }
                                    </p>
                                    {
                                        !loading ?  
                                            <div className="d-flex">
                                                <h5>$</h5><h3 className="mb-4 fw-bold">{convertPrice(productDetails.price)}</h3>
                                            </div>
                                        :
                                        <Placeholder animation="glow"><Placeholder xs={6} className="mb-5"/></Placeholder>
                                    }
                                
                                    <p className="mb-4 ">
                                        {   !loading ? productDetails.description
                                            : 
                                            <Placeholder animation="glow">
                                                <Placeholder xs={6}/>
                                                <Placeholder xs={12}/>
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                        }
                                    </p> 
                                    <p className="mb-4">
                                        {
                                            !loading ? <b>Stocks: {productDetails.stock}</b>
                                            : <Placeholder animation="glow"><Placeholder xs={4} className="mb-5"/></Placeholder>
                                        }
                                    </p>
                                </div>
                                {
                                    !loading  ?
                                        <div className="d-flex  justify-content-between gap-3 flex-column">
                                            <div className="d-flex justify-content-between gap-3">
                                                {/* <UpdateItem item={productDetails} modal={showModal} closeModal={handleCloseModal} />
                                                <DeleteItem  item={productDetails}  modal={showModal} closeModal={handleCloseModal} />
                                                 */}
                                            </div>
                                            <Button variant="primary" className=" w-100" onClick={addToCart} >Add to Cart</Button>
                                            {/* <Button variant="warning" className=" w-100" onClick={buyNow}>Buy now</Button> */}
                                        </div> 
                                    :
                                    <Placeholder animation="glow">
                                        <Placeholder xs={4}/>  <Placeholder xs={4}/>
                                        <Placeholder xs={12}/>
                                    </Placeholder>
                                }
                            </Col>
                        </Row>
                    : ''
                }
            </div>
        </Container>
    )
}
export default ProductDetails;