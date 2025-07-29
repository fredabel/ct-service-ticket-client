import { useEffect, useState } from "react";
import axios from "axios";
import { Placeholder, InputGroup, Button, Form, FormControl } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import * as Icon from 'react-bootstrap-icons';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
function CartProductItem({ item, maxQty, qty, onQtyChange, onRemove, checked, onCheck }) {

    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (item) setLoading(false);
    }, [item]);

    const convertPrice = (price) => parseFloat(price).toFixed(2);

    // Helper component for description with show more/less
    const DescriptionWithToggle = ({ description }) => {
        const [expanded, setExpanded] = useState(false);
        const maxLength = 50; // characters before truncation
    
        if (!description) return null;
    
        const isLong = description.length > maxLength;
        const displayText = expanded || !isLong
            ? description
            : description.slice(0, maxLength) + '...';
    
        return (
            <div className="text-muted" style={{ fontSize: "0.95em", maxWidth: "300px" }}>
            {displayText}
            {isLong && (
                <span
                role="button"
                style={{  cursor: "pointer", marginLeft: "6px", }}
                onClick={() => setExpanded(e => !e)}
                >
                {expanded ? <Icon.ChevronUp className="fw-bolder"/> : <Icon.ChevronDown className="fw-bolder"/>}
                </span>
            )}
            </div>
        );
    };

    if (error) {
        return <ErrorMessage errMsg={error} modal={true} redirect={'/products'} />;
    }

    const handleProductDetails = (productId) => {
        navigate(`/products/${productId}`);
    }

    if (loading || !item) {
        return (
            <div className="d-flex flex-row border-top border-bottom p-3">
                <Placeholder animation="glow">
                    <Placeholder className="cart-product-img mb-3" />
                </Placeholder>
                <div className="flex-grow-1 ps-3">
                    <Placeholder as="h6" animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder.Button variant="secondary" xs={2} />
                </div>
            </div>
        );
    }

    return (
        <div className="cart-item d-flex justify-content-between align-items-center flex-wrap">
            <Form.Check
                type="checkbox"
                className="me-3"
                checked={checked}
                onChange={onCheck}
                // style={{ width: "18px", height: "18px" }}
            />
            <div className="d-flex align-items-center gap-3 flex-grow-1">
            <img src={item.product.image_url} alt={item.product.name}  className="cart-item-img" />
            <div className="mb-2">
                <div className="fw-semibold cursor-pointer" onClick={() => handleProductDetails(item.product.id)}>{item.product.name}</div>
                <div className="text-muted small"><DescriptionWithToggle description={item.product.description} /></div>
            </div>
            </div>
            <div className="d-flex align-items-center gap-3 m-auto">
            <div className="d-flex align-items-center qty-box">
                <button className="qty-btn" onClick={() => onQtyChange(item.id, qty - 1)} disabled={qty === 1}>−</button>
                <span className="mx-2">{qty}</span>
                <button className="qty-btn" onClick={() => onQtyChange(item.id, qty + 1)}>+</button>
            </div>
            <div className="fw-semibold text-end" >${convertPrice(item.product.price * qty)}</div>
            <button className="btn btn-link text-danger" onClick={() => onRemove(item.id)}><Icon.Trash2Fill className=""/></button>
            </div>
        </div>
        // <div className="d-flex flex-row justify-content-between align-items-center p-1 m-3">
        //     <div className="d-flex flex-row flex-fill align-items-center">
        //         <div className="cart-product-img-container m-1">
        //             <img src={item.product.image} alt={item.product.name} className="cart-product-img" />
        //         </div>
        //     </div>
        //     <div className="p-3 flex-fill flex-wrap">
        //         <h5>{item.product.name}</h5>
        //             <p>{item.product.description}</p>
        //             <p>Stock: {maxQty}</p>
        //             <div className="input-qty">
        //                 <InputGroup>
        //                     {
        //                         qty == 1 ?
        //                             <Button variant="outline-secondary" onClick={() => onRemove(item.id)}><Icon.Trash3Fill/></Button>
        //                         :
        //                             <Button variant="outline-secondary" onClick={() => onQtyChange(item.id, qty - 1)}>-</Button>
        //                     }
                        
        //                     <FormControl className="text-center"
        //                         type="number"
        //                         min={1}
        //                         value={qty}
        //                         max={maxQty}
        //                         onChange={e => {
        //                             const value = Math.max(1, Math.min(maxQty, Number(e.target.value)));
        //                             onQtyChange(item.id, value);
        //                         }}
        //                     />
        //                     <Button variant="outline-secondary" onClick={() => onQtyChange(item.id, Math.min(maxQty, qty + 1))}>+</Button>
        //                 </InputGroup>
        //             </div>
        //     </div>
            
        //     <div className="d-flex align-items-center justify-content-center flex-fill">
        //         <h5>${convertPrice(item.product.price * qty)}</h5>
        //     </div>
        // </div>
    );
}

export default CartProductItem;