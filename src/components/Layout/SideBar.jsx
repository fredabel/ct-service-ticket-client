import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './SideBar.css';
const SideBar = ({ show, onHide })  => {
  
  return (
    <>
     
      <Offcanvas show={show} onHide={onHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> <img src={'./images/ft-store-brand.png'}  style={{'width': '150px', 'height': 'auto'}}/></Offcanvas.Title>
        </Offcanvas.Header>
        <div className="border border-bottom"/>
        <Offcanvas.Body className="p-0">
            <Nav>
                <NavLink to="/"  onClick={onHide} className={({ isActive }) => "nav-link sidebar-link " + (isActive ? "active" : "")  }>Home</NavLink>
                {/* <NavLink to="/"  onClick={onHide} className={({ isActive }) => "nav-link sidebar-link " + (isActive ? "active" : "")  }>Feeds</NavLink> */}
                <NavLink to="/products" onClick={onHide} className={({ isActive }) => "nav-link sidebar-link " +  (isActive ? "active" : "")} >Products</NavLink>
                {/* <div className="sidebar-section-title mt-2 mb-1 ps-3 text-muted fw-bold">Payment Methods</div> */}
                {/* <NavLink to="/checkout" onClick={onHide} className={({ isActive }) => "nav-link sidebar-link sidebar-indent " +  (isActive ? "active" : "")} >Checkout</NavLink> */}
                <NavLink to="/subscription"  onClick={onHide} className={({ isActive }) => "nav-link sidebar-link " +  (isActive ? "active" : "")} >Subscription</NavLink>
              
            </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideBar;