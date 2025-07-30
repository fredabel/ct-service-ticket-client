import {useNavigate} from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Button, Badge , Modal  } from 'react-bootstrap';

const CommingSoon = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
       
        <div className="d-flex justify-content-center align-items-center " style={{ minHeight: '500px' }}>
            <div className="text-center ">
                <h1 className="fw-bold">Coming Soon</h1>
                <p className="fw-bold">I'm working with something exciting!</p>
                <Button className="mt-5" onClick={()=> navigate('/')}>Back to Home</Button>
            </div>
        </div>
       
       
    );
};

export default CommingSoon;