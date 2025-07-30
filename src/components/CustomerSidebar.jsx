import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Modal, Container, Carousel, Row, Col, Card, Button, Badge, Form, Spinner} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';

function CustomerSidebar(){

    const navigate = useNavigate();

    const handleProfile = () =>{
        navigate('/profile')
    }
    // const handleMyTicket = () =>{
    //     navigate('/my-ticket')
    // }
   
    
    return(
        <Card className="border-0  p-2 mb-2 mt-5">
            <ul className="nav flex-row flex-md-column">
                {/* <li className="nav-item">
                    <a className="nav-link active" aria-current="page" onClick={handleProfile} role="button">Profile</a>
                </li> */}
                {/* <li className="nav-item">
                    <a className="nav-link" onClick={handleMyTicket} role="button">My Tickets</a>
                </li> */}
            </ul>
        </Card>
    )
}
export default CustomerSidebar;