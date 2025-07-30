import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { Dropdown, Image  } from 'react-bootstrap';
import Logout from './Logout';
// import {useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";

function UserIcon(){
    // const {isAuthenticated, user} = useSelector((state) => state.auth);
   const { user, logout, isAuthenticated, error } = useAuth0();
   
    const navigate = useNavigate();


    useEffect(() => {
        // If session expired or user is not authenticated, logout
        if (error?.error === "login_required" || (!isAuthenticated && user)) {
            logout({
                logoutParams: { returnTo: window.location.origin }
            });
        }
    }, [isAuthenticated, error, logout, user]);

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };

    return (
        
        isAuthenticated ? 
            // <div className="align-items-center d-flex">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" id="user-dropdown" className="border-0 p-0" bsPrefix="custom-dropdown-toggle">
                        { user.picture ?
                            <Image  src={user.picture} alt="" role="button" roundedCircle style={{ width: '35px', height: '35px' }}/>
                            : <Icon.PersonCircle className="fw-bold" size={30} role="button" />
                        }
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="user-icon-drop-down">
                        <Dropdown.Item ><h5>{user.name}</h5></Dropdown.Item>
                        
                        <Dropdown.Divider />
                        <Dropdown.Item as="button" onClick={()=> navigate('/profile')}>Profile</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={()=> navigate('/my_orders')}>My Orders</Dropdown.Item>
                        {/* <Dropdown.Item as="button" onClick={handleTickets}>My Tickets</Dropdown.Item> */}
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger" onClick={handleLogout} as="button">
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            // </div>
        : ''
        
        
    )
}
export default UserIcon;