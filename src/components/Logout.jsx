// import { useNavigate } from 'react-router-dom';
// import { logout } from '../features/authSlice';
// import { useDispatch } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';
const Logout = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth0();
    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };

    return(
        isAuthenticated ?
            <span onClick={handleLogout} role="button">Logout</span>
        : ""
    )
}

export default Logout;