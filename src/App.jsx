import {Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart/Cart';
import MyOrders from './components/Orders/MyOrders'
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
// import MyTicket from './components/MyTicket';
// import TicketDetails from './components/TicketDetails';
import Checkout from './components/PaymentMethod/Checkout';
import Plan from './components/PaymentMethod/Plan';
import SuccessPage from './components/PaymentMethod/SuccessPage';
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationGuard from "./auth/AuthenticationGuard";
import './App.css';
import { useCart } from "./components/Cart/CartContext";
import { useEffect } from 'react';
const App = () => {

  const { loadCart } = useCart();
  const {isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  // if(isLoading) return (<div>Loading...</div>)
    
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/success" element={<SuccessPage/>} />
        <Route path="/subscription" element={<Plan/>} />
        <Route path="/products" element={<ProductListing/>} />
        <Route path="/products/:productId" element={<ProductDetails/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/my_orders" element={<MyOrders/>} />
        <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
        <Route path="/edit-profile" element={<EditProfile/>} />
        {/* <Route path="/my-ticket" element={<MyTicket/>} /> */}
        {/* <Route path="/my-ticket/:id" element={<TicketDetails />} />  */}
      </Routes>
    </>
  )
}

export default App
