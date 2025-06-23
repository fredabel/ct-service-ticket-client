import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
function ProductListing(){

    const [products, setProducts] = useState([]) //State store Products
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);    // Error state

    useEffect(() =>{
        setLoading(true); // Start loading
        axios.get('https://fakestoreapi.com/products')
        .then(response => {
            setProducts(response.data);
            setTimeout(() => {
                setLoading(false);
            }, 2000); 
        }).catch(error =>{
            setError(`Failed to fetch products: ${error.message}`);
            setLoading(false);
        })
    },[])

    const convertPrice = (price) => {
        return parseFloat(price).toFixed(2)
    }
    
    if(error){
        return(
           <ErrorMessage errMsg={error} modal={true} redirect={'/'} />
        )
    }

    return(
        <Container fluid >
            {/* <div className="d-flex justify-content-end"><AddProduct /></div> */}
            <div className="d-flex flex-row flex-wrap justify-content-center py-5">
                {
                    products.map((product,index) => (
                        <div key={index}  className="product-container position-relative m-3 p-4 shadow rounded">
                            <div className="">
                                {
                                    !loading ?
                                    <img src={product.image}   alt={product.title} className="product-img"  />
                                    : <Placeholder animation="glow" ><Placeholder className="mb-5 product-img"/></Placeholder>
                                    
                                }
                            </div>
                            <div className="px-3 w-100 position-absolute z-1  bottom-0 end-0">
                                <div className="px-3 py-2 bg-body-tertiary shadow rounded-4 mb-3">
                                    {
                                        !loading ? 
                                            <div className="d-flex flex-row justify-content-between align-items-center">
                                                <div className="fw-bold"><small className="">$</small>{convertPrice(product.price)}</div>
                                                <div className="d-flex align-items-center gap-1">  
                                                    <Icon.StarFill className="text-warning" />
                                                    <small className="text-secondary fw-bold">{product.rating.rate}</small>
                                
                                                </div>
                                              
                                            </div>
                                        :
                                        <Placeholder animation="glow">
                                            <Placeholder xs={6} />
                                        </Placeholder>     
                                    }
                                    <div className="text-secondary text-truncate">
                                        {
                                            !loading ? product.title  :  <Placeholder animation="glow"><Placeholder xs={12}/></Placeholder>
                                        }
                                    </div>
                                    { !loading ? 
                                        <Button href={`/products/${product.id}`} variant="primary" className="mt-2 btn-sm d-block w-100">View Details</Button>
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