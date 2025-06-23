import {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
// import {useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Form} from 'react-bootstrap';
import UserIcon from './UserIcon';
import axios from 'axios';
// import LoginAuth from './LoginAuth';
import { useAuth0 } from "@auth0/auth0-react";

function NavBar(){
    const [isUserSynced, setIsUserSynced] = useState(false);
    const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const syncUserToBackend = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = axios.post(`${backend_url}/customers/sync`,{
                    email: user?.email,
                    name: user?.name,
                    picture: user?.picture,
                    sub: user?.sub, // this is the Auth0 user ID (e.g., "google-oauth2|xyz")
                    },{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }     
                })
                const data = await response
                console.log(data)

                setIsUserSynced(true); // prevent refiring
            } catch (error) {
                console.error("User sync failed:", error);
            }
        };

        if (isAuthenticated && user && !isUserSynced) {
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
        <Navbar bg="light" sticky="top" data-bs-theme="light"  variant="light" expand="lg" className="p-3 mb-4">
            <Navbar.Brand href="/">Mechanic Shop</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Nav>
                    <Nav.Link as={NavLink} to="/"  className={({ isActive }) => (isActive ? "active" : "")}>Home</Nav.Link>
                    {/* <Nav.Link as={NavLink} to="/services"  className={({ isActive }) => (isActive ? "active" : "")} >Services</Nav.Link> */}
                    <Nav.Link as={NavLink} to="/products"  className={({ isActive }) => (isActive ? "active" : "")} >Products</Nav.Link>
                </Nav>
                <Nav className="gap-4">
                    {
                        isAuthenticated ?
                        <>
                            <UserIcon/>
                        </>
                        :
                        <Nav.Link as={NavLink} onClick={handleLogin} className={({ isActive }) => (isActive ? "active" : "")}>Login</Nav.Link>
                    }
                </Nav>
                
            </Navbar.Collapse>
      </Navbar>
    )
}
export default NavBar;