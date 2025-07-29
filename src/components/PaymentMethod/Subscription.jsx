import React, { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';
import SubscriptionForm from "./SubscriptionForm";
import SubscriptionItem from "./SubscriptionItem";

export default function Subscription() {
    const [plans, setPlans] = useState([]);
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const [selectedPlan, setSelectedPlan] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${backend_url}/users/products`,{},{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            setPlans(response.data);
            console.log(response.data);
        }
        if (isAuthenticated){
            fetchProducts();
        }
    },[])

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get("success");
        const sessionId = query.get("session_id");

        if (success && sessionId) {
            console.log("✅ Payment successful! Session ID:", sessionId);
            <SuccessDisplay sessionId={sessionId} />;
            // You can fetch session details from your backend if needed
        } else if (query.get("canceled")) {
            console.log("❌ Payment canceled by user");
        }
    }, []);

    const manageBilling = async (sessionId) => {
        const token = await getAccessTokenSilently();
        const response = await axios.post(`${backend_url}/customers/create-portal-session`, {
            sessionId: sessionId,
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data;
        if (data.url) {
            window.location.href = data.url;  // Redirect to Stripe Customer Portal
        } else {
            alert("Error: Could not create portal session");
            console.error(data.error);
        }
    }

    const SuccessDisplay = ({ sessionId }) => {
        return (
            <section>
                <div className="product Box-root">
                    <div className="description Box-root">
                    <h3>Subscription to starter plan successful!</h3>
                    </div>
                </div>
                
                <Button className="mx-2" variant="primary" onClick={() => manageBilling(sessionId)}> Manage your billing information</Button>
            </section>
        );
    };
    
    const submitSubscribe = async (plan) => {
        const token = await getAccessTokenSilently();
        const response = await axios.post(`${backend_url}/customers/create-checkout-session`, {
            priceId: plan.prices[0].id, // Assuming you want to use the first price
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = response.data;
        if (data.url) {
            window.location.href = data.url;  // Redirect to Stripe Checkout
        } else {
            alert("Error: Could not create checkout session");
            console.error(data.error);
        }
    }

    return(
        <Container >
            
            { 
                // selectedPlan ? <SubscriptionForm plan={selectedPlan} onCancel={() => setSelectedPlan(null)}/> :
                
                <div className="d-flex flex-lg-row flex-column flex-md-column  justify-content-center py-5 gap-3 ">
                    {
                        
                        plans.map((plan, index) => (
                            <div key={plan.id} className="p-4 shadow rounded flex-fill">
                                <div className="d-flex flex-column ">
                                    <SubscriptionItem key={index} plan={plan}/>
                                    <Button className="mx-2" variant="primary" onClick={() => submitSubscribe(plan)}>Subscribe</Button>
                                </div>
                            </div>
                        )) 
                    }
                </div>
            }
        </Container>
    )

}
