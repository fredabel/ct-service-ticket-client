import React, { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';

const SuccessPage = () => {
   
    const {getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get("success");
        const sessionId = query.get("session_id");

        if (success && sessionId) {
            setSessionId(sessionId);
            console.log("✅ Payment successful! Session ID:", sessionId);
            // You can fetch session details from your backend if needed
        } else if (query.get("canceled")) {
            console.log("❌ Payment canceled by user");
        }
    }, []);

    const manageBilling = async () => {
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
       
}
export default SuccessPage;
