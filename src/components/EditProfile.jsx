import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Modal, Container, Carousel, Row, Col, Card, Button, Badge, Form, Spinner} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// import {useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
function EditProfile(){
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [toastBg, setToastBg] = useState('success'); // default is green
    const [responseMsg, setResponseMsg] = useState(false);

    // const {user} = useSelector((state) => state.auth);
    const {getAccessTokenSilently} = useAuth0();
    const [userDetails, setUserDetails] = useState(null)
    const fetchCustomers = async () => {
        try{
            setLoading(true);
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${backend_url}/users/me`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUserDetails(response.data.user)
        }catch (err) {
            setError('Failed to fetch user details.', err);
        } finally {
            setLoading(false);
        } 
    }

    useEffect(()  => {
        fetchCustomers()
    },[])
   

    // Initialize formData with default values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        
    });

    useEffect(() => {
        if (userDetails) {
            setFormData({
                name: userDetails.name || '',
                email: userDetails.email || '',
                phone: userDetails.phone || '',
                address: userDetails.address || ''
            });
        }
    }, [userDetails]);

    const handleProfile = () =>{
        navigate('/profile')
    }

    //  // Handle input changes
     const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isFormValid = formData.name && formData.email && formData.phone;

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setValidated(true);
        if (!isFormValid) return;
        try{
            setLoading(true)
            const token = await getAccessTokenSilently();
            const response = await axios.put(`http://127.0.0.1:5000/users/`,formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (response.data.status == "success") {
                setResponseMsg(response.data.message)
                setToastBg('success');
                setShow(true)
                setTimeout(() => navigate('/profile'), 1500);
            }else {
                setError(response.data.message || 'Please try again.');
                setToastBg('danger');
            }
            
        }catch(err){
            console.log(err)
            setError(`${err.response.data.message}`);
            setResponseMsg(err.response?.data?.message || 'Something went wrong.');
            setToastBg('danger');
            setShow(true);
        }finally {
            setLoading(false);
        }
         
    }

    return(
        <Container className="" >
            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setShow(false)} show={show} bg={toastBg} delay={3000} autohide>
                    <Toast.Body className="text-white">{responseMsg}</Toast.Body>
                </Toast>
            </ToastContainer>
            {
                userDetails ?
                    <Row className="p-5 justify-content-center align-items-center">
                        <Col sm={12} md={12} lg={6}>
                            
                        <div className="text-center">
                            <h5 className="mb-5">Edit your information</h5>
                        </div>
                       
                        <Form onSubmit={handleSubmit} noValidate validated={validated} >
                            <Form.Group className="mb-3" >
                                <Form.Label className="fw-bold">Name:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your name here"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    
                                />
                                <Form.Control.Feedback type="invalid">
                                    This is required
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label className="fw-bold">Email:</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter your email here"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    isInvalid={formData.email && !isEmailValid}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Invalid email address
                                </Form.Control.Feedback>
                            </Form.Group>
                          
                            <Form.Group className="mb-3" >
                                <Form.Label className="fw-bold">Phone:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your phone here"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    This is required
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label className="fw-bold">Address:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your address here"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                    This is required
                                </Form.Control.Feedback> */}
                            </Form.Group>
                            
                            <Button type="button" variant="light" className="my-3" onClick={handleProfile}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="success" className="my-3 ms-3" disabled={!isFormValid}>
                                Save
                            </Button>
                          
                        </Form>
                   
                        </Col>
                    </Row>

                : ''
            }   
        </Container>
       
    )
}
export default EditProfile;