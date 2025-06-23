import {useState, useEffect} from 'react'
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { Modal, Container, Carousel, Row, Col, Card, Button, Badge, Form, Spinner} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
// import { useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";

function CreateTicket({ onTicketCreated }){
    // const {user} = useSelector((state) => state.auth);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null)

    const [showCreateTicket, setShowCreateTicket] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleCloseCreateTicket = () => setShowCreateTicket(false)
    const handleCloseSuccessModal = () => setShowSuccessModal(false)
       
    const handleCreateTicket = () =>{
        setValidated(false) //Always reset validation 
        setShowCreateTicket(true)
    }

    const {getAccessTokenSilently} = useAuth0();
    const [userDetails, setUserDetails] = useState(null)
    const fetchCustomers = async () => {
        try{
            setLoading(true);
            const token = await getAccessTokenSilently();
            const response = await axios.get(`http://127.0.0.1:5000/customers/me`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUserDetails(response.data)
        }catch (err) {
            setError('Failed to fetch user details.', err);
        } finally {
            setLoading(false);
        } 
    }

    useEffect(()  => {
        fetchCustomers()
    },[])
   

    const [formData, setFormData] = useState({
        vin: '',
        service_desc: '',
        customer_id: 0
    })
    // Update customer_id in formData when userDetails is fetched
    useEffect(() => {
        if (userDetails && userDetails.id) {
            setFormData(prev => ({
                ...prev,
                customer_id: userDetails.id
            }));
        }
    }, [userDetails]);
    const [validated, setValidated] = useState(false);

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }else{

            try{
                setLoading(true)
                const response = await axios.post(`http://127.0.0.1:5000/service-tickets/`,formData)
                setTicket(response.data)
                if (onTicketCreated) {
                    onTicketCreated(response.data);
                }
                setFormData({ // Reset the form data
                    vin: '',
                    service_desc: '',
                });
               
                setShowCreateTicket(false); // Close the add product modal
                setShowSuccessModal(true); // Show success modal

                setTimeout(() => {
                    setLoading(false); // Stop loading
                }, 2000);
                
            }catch(err){
                setError(`Error submitting the form. Please try again: ${err.message}`);
                setShowCreateTicket(false); // Close the add product modal
                setShowSuccessModal(false); // Close success modal
            }
        }
        setValidated(true);
    }

    return(
        <>
            <Button variant="outline-success" size="sm" className="mr-4 max-w-10" onClick={handleCreateTicket}><Icon.Plus size={20} />Create a ticket</Button>
            { error ? <ErrorMessage errMsg={error} modal={true} redirect={'/'} />: ''}
            <Modal show={showCreateTicket} onHide={handleCloseCreateTicket} >
                <Modal.Header closeButton>
                    <Modal.Title>Create a ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate validated={validated}>
                        <Form.Group className="mb-3" >
                            <Form.Label className="fw-bold">VIN:</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Type your VIN here"
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a vin
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label className="fw-bold">Description:</Form.Label>
                            <Form.Control as="textarea" 
                                rows={5} 
                                placeholder="Input description here" 
                                name="service_desc"
                                value={formData.service_desc} 
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a description
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateTicket}>
                                Cancel
                            </Button>
                            <Button variant="success" type="submit" >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>    
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">{!loading ? 'Successfully saved!' : 'Saving product..'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        !loading ?
                            ticket ? 
                                <Row className="align-items-center">
                                  
                                </Row>
                                : ''
                            :  
                            <div className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading... </span>
                                </Spinner>
                                <p>Please wait while saving your product.</p>
                            </div>
                        }
                </Modal.Body>
                <Modal.Footer>
                    { !loading ? <Button variant="primary" onClick={handleCloseSuccessModal}>Close</Button> : '' }
                </Modal.Footer>
            </Modal>
        </>
    )

}
export default CreateTicket