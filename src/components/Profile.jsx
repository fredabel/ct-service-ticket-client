import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Modal, Container, Carousel, Row, Col, Card, Button, Badge, Form, Spinner} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import CustomerLayout from './CustomerLayout';
// import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
function Profile(){

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const {getAccessTokenSilently} = useAuth0();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null)
    // const [error, setError] = useState(null)
    // const [loading, setLoading] = useState(false);
    // const [validated, setValidated] = useState(false);

    const fetchCustomers = async () => {
        const token = await getAccessTokenSilently();
        const response = axios.get(`${backend_url}/customers/me`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response
        setUserDetails(data.data)
    }

    useEffect(()  => {
        fetchCustomers()
    },[])


    const handleEditProfile =() =>{
        navigate('/edit-profile')
    }
    return(
        <Container className="fluid" >
            {
                userDetails ?
                    <CustomerLayout>
                        <div className="px-5">
                            <div className="d-flex justify-content-between flex-row align-items-center mb-5 pe-5 pt-5">
                                <h1>{userDetails.name}</h1>
                                {
                                    userDetails.image ?
                                    <img src={userDetails.image} alt="Profile" className="rounded-circle" style={{ width: '100px', height: '100px' }} />
                                    : <img src="https://placehold.co/100x100" alt="Profile" className="rounded-circle" style={{ width: '80px', height: '80px' }} />
                                }
                                
                            </div>
                            <div className="mb-5 position-relative ">
                                <div className="position-absolute end-0 bottom-50 pe-5">
                                    <Icon.ChevronRight className="fw-bold" size={20} role="button" onClick={handleEditProfile}></Icon.ChevronRight>   
                                </div>
                                <p className="text-muted fw-bold "> <Icon.EnvelopeFill size={20} role="button" className="me-2 "/>{userDetails.email} </p>
                                <p className="text-muted fw-bold "> <Icon.TelephoneFill  size={20} role="button"className="me-2 " /> 123-456-5678 </p>
                                <p className="text-muted fw-bold "> <Icon.GeoAltFill  size={20} role="button" className="me-2 "/> {userDetails.address}</p>
                                
                            </div>
                        </div>
                    </CustomerLayout>

                : ''
            }   
        </Container>
    )
}
export default Profile;