import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth0ProviderWithNavigate from "./auth/Auth0Provider";
import { CartProvider } from "./components/CartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <CartProvider>
          <App />
        </CartProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
)
