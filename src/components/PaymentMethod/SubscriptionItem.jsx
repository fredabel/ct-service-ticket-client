import React from 'react';
import * as Icon from 'react-bootstrap-icons';

import { Container, Carousel, Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';

const SubscriptionItem = ({ plan}) => {
    
    return (
        
        <div className="d-flex flex-column ">
            <div className="mb-3">
                <h5 className="mb-4">{plan.name}</h5>
                {
                    plan.prices.map(price => (
                        <div key={price.id} className="d-flex flex-row justy-content-center align-items-center mb-3">
                            <h2> ${(price.unit_amount / 100).toFixed(2)} </h2> 
                            <div className="text-muted fw-bold">/{price.interval}</div>
                        </div>
                    ))
                }
                {
                    plan.features.map((feature, idx) => (

                        <div key={idx} className="d-flex flex-row align-items-center mb-2">
                            <Icon.CheckCircleFill className="text-success me-2" size={20} />
                            <span>{feature.name}</span>
                        </div>
                    ))
                }   
            </div>
            <small className="px-3 mt-3 text-muted pb-3">{plan.description}</small>
        </div>
        
    )
}
export default SubscriptionItem;