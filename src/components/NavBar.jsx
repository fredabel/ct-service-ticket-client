import {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import UserIcon from './UserIcon';
import CartIcon from './Cart/CartIcon';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import SideBar from './Layout/SideBar';
function NavBar(){
    const [showOffcanvas, setShowOffcanvas] = useState(false); // <-- State for Offcanvas
    const [isUserSynced, setIsUserSynced] = useState(false);
    const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const syncUserToBackend = async () => {
            try {
                // const token = await getAccessTokenSilently();
                const response = axios.post(`${backend_url}/users/sync`,{
                    email: user?.email,
                    full_name: user?.name,
                    image_url: user?.picture,
                    auth0_id: user?.sub, // this is the Auth0 user ID (e.g., "google-oauth2|xyz")  
                })
                const data = await response
                console.log(data)

                setIsUserSynced(true); // prevent refiring
            } catch (error) {
                console.log(error)
                console.error("User sync failed:", error);
            }
        };

        if (isAuthenticated && user && !isUserSynced) {
            console.log(user)
            syncUserToBackend();
        }
    }, [isAuthenticated, user, getAccessTokenSilently, isUserSynced]);


    const handleLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: "/",
            },
            authorizationParams: {
                prompt: "login",
            },
        });
    };

    return(
        <Navbar bg="light" sticky="top" data-bs-theme="light"  variant="light" expand="lg" className="p-3 mb-4 justify-content-between gap-5">
            <Nav className="d-flex flex-row align-items-center gap-3">
                <Icon.List className="fw-bold me-3 d-lg-none" size={30} role="button" onClick={() => setShowOffcanvas(true)} />
                <Navbar.Brand as={NavLink} to="/" style={{'width': '145px', 'height': 'auto'}} className="d-none d-lg-block d-md-block">
                    <img src={'./images/ft-store-brand.png'}  style={{'width': '100%', 'height': 'auto'}}/>
                </Navbar.Brand>
            </Nav>
            <Nav className="d-flex flex-row align-items-center gap-4 px-5 d-none d-lg-flex">
                <Nav.Link as={NavLink} to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products" className={({ isActive }) => (isActive ? "active" : "")}>Products</Nav.Link>
                <Nav.Link as={NavLink} to="/subscription" className={({ isActive }) => (isActive ? "active" : "")}>Subscription</Nav.Link>
            </Nav>
            <Nav className="d-flex flex-row align-items-center gap-4 pe-2">
                
                {
                    !isAuthenticated ?
                    <>
                        <Nav.Link as={NavLink} onClick={handleLogin} className={({ isActive }) => (isActive ? "active" : "")}>Login</Nav.Link>
                        
                    </>
                    :
                    <>
                        <CartIcon/>
                        <UserIcon/>
                        
                    </>                    
                }
            </Nav>
            <SideBar show={showOffcanvas} onHide={() => setShowOffcanvas(false)}></SideBar>
      </Navbar>
    )
}
export default NavBar;