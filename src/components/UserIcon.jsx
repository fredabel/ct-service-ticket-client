
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { Dropdown, Image  } from 'react-bootstrap';
import Logout from './Logout';
// import {useSelector } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";

function UserIcon(){
    // const {isAuthenticated, user} = useSelector((state) => state.auth);
   const { user, isAuthenticated } = useAuth0();
   
    const navigate = useNavigate();
    const handleProfile = () =>{
        navigate('/profile')
    }
    const handleSettings = () =>{
        navigate('/settings')
    }

    const handleTickets = () =>{
        navigate('/my-ticket')
    }

    return (
        
        isAuthenticated ? 
            <div className="align-items-center d-flex">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" id="user-dropdown" className="border-0 p-0" bsPrefix="custom-dropdown-toggle">
                        { user.picture ?
                            <Image  src={user.picture} alt="" role="button" roundedCircle style={{ width: '40px', height: '40px' }}/>
                            : <Icon.PersonCircle className="fw-bold" size={30} role="button" />
                        }
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item ><h5>{user.name}</h5></Dropdown.Item>
                        
                        <Dropdown.Divider />
                        <Dropdown.Item as="button" onClick={handleProfile}>Profile</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleSettings}>Settings</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleTickets}>My Tickets</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">
                            <Logout/>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        : ''
        
        
    )
}
export default UserIcon;