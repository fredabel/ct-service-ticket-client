import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const AuthSync = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const syncUser = async () => {
        const token = await getAccessTokenSilently();
        const response = axios.post(`${backend_url}/users/sync`,{
            email: user?.email,
            full_name: user?.name,
            picture: user?.picture,
            sub: user?.sub, // this is the Auth0 user ID (e.g., "google-oauth2|xyz")
            },{
            headers: {
                'Authorization': `Bearer ${token}`
            }     
        })
        const data = await response
        console.log(data)
    }
        
    useEffect(() => {
        if (isAuthenticated && user) {
            syncUser();
        }
  }, [isAuthenticated, user]);

  return null; // This component runs in the background
};

export default AuthSync;
