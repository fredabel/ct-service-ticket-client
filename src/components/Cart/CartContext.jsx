import { createContext, useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { getAccessTokenSilently} = useAuth0();
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [cart, setCart] = useState({ id: null, items: [], subTotal: 0, totalQty: 0 });

  const resetCart = () => {
    setCart({ id: null, items: [], subTotal: 0, totalQty: 0 });
  };

  const computeTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        acc.totalQty += item.quantity;
        acc.subTotal += item.quantity * parseFloat(item.product.price);
        return acc;
      },
      { totalQty: 0, subTotal: 0 }
    );
  };
  
  const loadCart = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${backend_url}/carts/my_cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)
      const items = response.data.cart_items;
      const id = response.data.id;
      const totals = computeTotals(items);

      setCart({ id, items, ...totals });
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };


  const updateCart = (items) => {
    const totals = computeTotals(items);
    setCart((prev) => ({
      ...prev,
      items,
      ...totals
    }));
  };

  return (
    <CartContext.Provider value={{ cart, loadCart, updateCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};
