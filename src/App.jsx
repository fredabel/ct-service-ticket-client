import {Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import ProductListing from './components/ProductListing';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import MyTicket from './components/MyTicket';
import TicketDetails from './components/TicketDetails';
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationGuard from "./auth/AuthenticationGuard";
import './App.css';
const App = () => {

  const {isLoading} = useAuth0();
  if(isLoading) return (<div>Loading...</div>)
    
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/products" element={<ProductListing/>} />
        <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
        <Route path="/edit-profile" element={<EditProfile/>} />
        <Route path="/my-ticket" element={<MyTicket/>} />
        <Route path="/my-ticket/:id" element={<TicketDetails />} /> 
      </Routes>
    </>
  )
}

export default App
