import { withAuthenticationRequired } from "@auth0/auth0-react";

const AuthenticationGuard  = ({component})=>{
    const Component = withAuthenticationRequired(component,{
        onRedirecting: () => <div>Redirecting you to the login page...</div>,
    })

    return(
        <Component />
    )
}

export default AuthenticationGuard;