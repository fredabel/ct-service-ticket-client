
import { useNavigate } from 'react-router-dom';
import { Container, Carousel, Row, Col, Card, Button, Spinner  } from 'react-bootstrap';

const HomePage = () =>{
    const navigate = useNavigate();

    return(
        <Container >
            <Row className="p-5">
               <Col sm={12} className="text-center mb-5">
                    <h1 className="fw-bold">FT STORE</h1>
               </Col>
               <Col sm={12}>
                    <p>
                        Hey there! 🎉 Welcome to Tone Market, where shopping is easier, faster, and more exciting than ever! Whether you're looking for the latest trends, must-have gadgets, or daily essentials, we've got you covered.
                    </p>
                    
                    <ul className="list-unstyled">
                        <li>🛍️ Shop with Ease – Browse a wide range of high-quality products at unbeatable prices.</li>
                        <li>🚀 Fast & Secure Checkout – Enjoy a seamless shopping experience with secure payment options.</li>
                        <li>📦 Quick Delivery – Get your orders delivered straight to your doorstep in no time.</li>
                        <li>🎁 Exclusive Deals & Discounts – Unlock special offers just for you!</li>
                    </ul>  
                    
                    <h5 className="mt-5">
                        Start exploring now and enjoy a smarter way to shop. Happy shopping! 🛒✨
                    </h5>
                    <Button variant="primary" className="my-5" onClick={() => navigate('/products')}>Click here to start</Button>

                </Col>
            </Row>
        </Container>
    )
}
export default HomePage;