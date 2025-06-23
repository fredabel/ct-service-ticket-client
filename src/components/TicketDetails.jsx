import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Button, Row, Col, Card, Badge, Table} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import moment from 'moment';
// import { useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
function TicketDetails() {
     const backend_url = import.meta.env.VITE_BACKEND_URL;
    const {getAccessTokenSilently} = useAuth0();
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            const token = await getAccessTokenSilently();
            axios.get(`${backend_url}/customers/my-tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setTicket(response.data.ticket); // Adjust according to your backend response
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch ticket details.');
                setLoading(false);
            });
        }
        fetchTicketDetails()
    }, [id]);

    if (loading) return <Container className="text-center p-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="text-center p-5 text-danger">{error}</Container>;
    if (!ticket) return null;
    const groupedItems = ticket.ticket_items.reduce((acc, item) => {
    const id = item.desc_id;
    if (!acc[id]) {
        acc[id] = { ...item, count: 1 };
    } else {
        acc[id].count += 1;
    }
    return acc;
    }, {});

    const total = Object.values(groupedItems).reduce((sum, item) => {
    return sum + parseFloat(item.description.price) * item.count;
    }, 0);

    return (
        <Container className="p-5">
            <div className="mb-5" >
                <a onClick={() => navigate(-1)} role="button">
                    <Icon.ChevronLeft className="fw-bold me-2" size={20} > </Icon.ChevronLeft>   
                    Go Back
                </a>
            </div>
            
            <Row className="ms-3">
                <Col sm={12} md={6} lg={6}>
                    <div className="mb-5 pe-4">
                        <h4 >Ticket #{ticket.id}</h4>
                        <small className="text-muted">{ticket.service_desc}</small>
                    </div>
                  

                    <div className="d-flex flex-column">
                        <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0">VIN: </h6> 
                            <span className="fw-light ms-4 text-muted">{ticket.vin}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Status: </h6> 
                            <span className="fw-light ms-4 text-muted">{ticket.status.name}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Priority: </h6> 
                            <span className="fw-light ms-4 text-muted">{ticket.priority.name}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Date: </h6> 
                            <span className="fw-light ms-4 text-muted">{moment(ticket.created_at).format('LL')}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Service Date: </h6> 
                            <span className="fw-light ms-4 text-muted">{moment(ticket.service_date).isValid() ? moment(ticket.service_date).format('LL') : 'TBD'}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Completion Date: </h6> 
                            <span className="fw-light ms-4 text-muted">{moment(ticket.completion_date).isValid() ? moment(ticket.completion_date).format('LL') : 'TBD'}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Estimated Cost: </h6> 
                            <span className="fw-light ms-4 text-muted">${ticket.estimated_cost || '0.00'}</span>
                        </div>
                        <div className="d-flex align-items-center  mb-1">
                            <h6 className="mb-0">Actual Cost: </h6> 
                            <span className="fw-light ms-4 text-muted">$0.00</span>
                        </div>
                        

                        <h6 className="mb-3 mt-5">Assigned Mechanics </h6> 
                        <Row className="ms-3">
                            
                            {
                                ticket.mechanics.length > 0 ?
                                    ticket.mechanics.map((mechanic, i) => (
                                        <Col key={i}  className="mb-3">
                                            <div className="d-flex flex-row border-0 shadow rounded p-2">
                                                <div >
                                                    <img src="https://placehold.co/100x100" alt="Profile" className="rounded-circle me-3" style={{ width: '40px', height: '40px' }} />
                                                </div>
                                                <div>
                                                    <h6>{mechanic.name}</h6>
                                                    <div className="d-flex align-items-center  mb-1">
                                                        <Icon.TelephoneFill  size={10} role="button"className="me-2 " />
                                                        <small className="fw-light ms-2 text-muted">{mechanic.phone}</small>
                                                    </div>
                                                    <div className="d-flex align-items-center  mb-1">
                                                        <Icon.EnvelopeFill  size={10} role="button"className="me-2 " />
                                                        <small className="fw-light ms-2 text-muted">{mechanic.email}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col> 
                                    ))
                                :
                                <p className="fw-light">No assigned mechanics yet.</p>

                            }
                        </Row>

                        <h6 className="mb-3 mt-5">Part Items </h6> 
                        <Row className="ms-3 mb-5">
                            {
                                ticket.ticket_items.length > 0 ?
                           
                                    <Col>
                                        <Table  size="sm">
                                            <thead >
                                                <tr className="fw-light text-muted">
                                                    <th>NAME</th>
                                                    <th>BRAND</th>
                                                    <th>PRICE</th>
                                                    <th>QTY</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="align-middle fs-6 fw-light" >
                                                {Object.values(groupedItems).map((item, index) => (
                                                    <tr key={item.desc_id}>
                                                        
                                                        <td>
                                                            <img src="https://placehold.co/100x100" alt="Profile" className=" me-3" style={{ width: '40px', height: '40px' }} />
                                                            {item.description.name}
                                                        </td>
                                                        <td>{item.description.brand}</td>
                                                        <td>{item.count}</td>
                                                        <td>${parseFloat(item.description.price).toFixed(2)}</td>
                                                        <td>${(parseFloat(item.description.price) * item.count).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>      
                                    </Col>
                                : 
                                <p className="fw-light">No parts added.</p>
                            }
                        </Row>
                    
                    </div>
                </Col>
                <Col sm={12} md={6} lg={6}>
                    <div className="border-0 shadow rounded p-3">
                        <h4 className="mb-4">Summary</h4> 
                        <div className="d-flex align-items-center justify-content-between  mb-2">
                            <h6 className="mb-0">Items Subtotal: </h6> 
                            <span className="fw-light ms-4 text-muted">${total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between  mb-2">
                            <h6 className="mb-0">Discount: </h6> 
                            <span className="fw-light ms-4 text-muted">$0.00</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between  mb-2">
                            <h6 className="mb-0">Tax: </h6> 
                            <span className="fw-light ms-4 text-muted">$0.00</span>
                        </div> 
                        <div className="d-flex align-items-center justify-content-between  mb-2">
                            <h6 className="mb-0">Subtotal: </h6> 
                            <span className="fw-light ms-4 text-muted">${total.toFixed(2)}</span>
                        </div>
                        <div class="clearfix "></div>
                        <div className="d-flex align-items-center justify-content-between border-top border-bottom mt-5 mb-3 p-2">
                            
                            <h5 className="mb-0">Total: </h5> 
                            <span className="fw-bold ms-4 text-muted">${total.toFixed(2)}</span>
                        </div>
                        <div>
                            <Button className="w-100">Proceed to checkout</Button>
                        </div>
                    </div>
                </Col>
               
            </Row>   
        </Container>
    );
}

export default TicketDetails;