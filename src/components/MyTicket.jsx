import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Modal, Container, Carousel, Row, Col, Card, Table, Button, Badge, Form, Spinner} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import CustomerLayout from './CustomerLayout';
import CreateTicket from './CreateTicket';
import moment from 'moment';
// import { useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";

function MyTicket(){

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [tickets, setTickets] = useState([])
    const [hoveredRow, setHoveredRow] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(()  =>{
        setLoading(true); // Start loading
        const fetchMyTickets = async () => {
            const token = await getAccessTokenSilently();
            axios.get(`${backend_url}/customers/my-tickets`,
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            .then(response => {
                console.log(response.data.service_tickets)
                setTickets(response.data.service_tickets);
                setTimeout(() => {
                    setLoading(false);
                }, 2000); 
            }).catch(error =>{
                setError(`Failed to fetch products: ${error.message}`);
                setLoading(false);
            })
        }
        fetchMyTickets()
    },[])

   
    return(
        <Container>
            {
                isAuthenticated ?
                    <CustomerLayout>
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 ticket-cards mb-5">
                            <Card className="border-0 shadow rounded p-3 flex-fill">
                                <p className="text-muted fw-bold">All tickets</p>
                                <div className="d-flex flex-row justify-content-between mt-3">
                                    <h3>{tickets.length}</h3>

                                </div>
                            </Card>
                                <Card className="border-0 shadow rounded p-3 flex-fill">
                                <p className="text-muted fw-bold">Pending tickets</p>
                                <div className="d-flex flex-row justify-content-between mt-3">
                                    <h3>{tickets.filter(t => t.status_id === 1).length}</h3>

                                </div>
                            </Card>
                                <Card className="border-0 shadow rounded p-3 flex-fill">
                                <p className="text-muted fw-bold">Closed tickets</p>
                                <div className="d-flex flex-row justify-content-between mt-3">
                                    <h3>{tickets.filter(t => t.status_id === 2).length}</h3>

                                </div>
                            </Card>
                                <Card className="border-0 shadow rounded p-3 flex-fill">
                                <p className="text-muted fw-bold">Cancelled tickets</p>
                                <div className="d-flex flex-row justify-content-between mt-3">
                                    <h3>{tickets.filter(t => t.status_id === 3).length}</h3>

                                </div>
                            </Card>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end"><CreateTicket onTicketCreated={(newTicket) => setTickets(prev => [newTicket, ...prev])}/></div>
                        </div>
                        <div className="d-flex justify-content-between flex-row align-items-center mb-5 mt-3 ">
                            <Card className="border-0 shadow rounded w-100">
                                <Card.Body>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>VIN</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Date request</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tickets.length > 0  ?
                                                    tickets.map((v, i) => (
                                                        <tr key={i} 
                                                            onClick={() => navigate(`/my-ticket/${v.id}`)} 
                                                            onMouseEnter={() => setHoveredRow(i)}
                                                            onMouseLeave={() => setHoveredRow(null)}
                                                            role="button"
                                                        >
                                                            <td>{v.id}</td>
                                                            <td>{v.vin}</td>
                                                            <td>{v.priority.name}</td>
                                                            <td>{v.status.name}</td>
                                                            <td>{moment(v.created_at).format('YYYY-MM-DD')} </td>
                                                        </tr>
                                                    ))
                                                
                                                : null
                                            }
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </div>
                     
                   </CustomerLayout>

                : ''
            }   
        </Container>
    )
}
export default MyTicket;