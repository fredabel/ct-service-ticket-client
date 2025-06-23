import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { Container, Carousel, Row, Col, Card, Button, Badge , Modal  } from 'react-bootstrap';

const ErrorMessage = ({ errMsg, modal, redirect }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const [showModal, setShowModal] = useState(modal)
    const handleCloseModal = () => setShowModal(false);

    const handleReload= () => {
        setShowModal(false)
        navigate(redirect);
    }
  
    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Body className="text-center pt-5">
                <h4 className="text-danger"><Icon.ExclamationTriangleFill  size={20} /> Something went wrong!</h4>
                <p className="text-danger">{errMsg ? errMsg : ''}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleReload}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorMessage;