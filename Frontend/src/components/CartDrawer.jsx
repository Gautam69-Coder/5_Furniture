import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { useQuickView } from '../context/PopupContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cart from './Cart';
import { API_BASE_URL } from '../api';

const CartDrawer = ({ Close }) => {
  const { closeCart, isOpenCart } = useQuickView();
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
    closeCart();
  };

  useEffect(() => {
    setOpen(isOpenCart);
  }, [isOpenCart]);

  // Fetch Cart Data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("refreshToken");
        
        if (!token) {
          setLoading(false);
          setCart([]);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/v1/cart`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const products =await res.data.data[0].product;
        setCart(products);
        
        const calculatedSubTotal = products.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
        
        setSubTotal(calculatedSubTotal);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
        setCart([]);
      }
    };

    if (isOpenCart) {
      setTimeout(() => {
        fetchCart();
      }, 1000);
    }
  }, [isOpenCart]);

  const deleteItem = async (productId) => {
    try {
      const token = localStorage.getItem("refreshToken");
      await axios.post(`${API_BASE_URL}/api/v1/deleteItem`,
        { productId },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      // Update cart locally after deletion
      const updatedCart = cart.filter(item => item.productId !== productId);
      setCart(updatedCart);
      
      const newSubTotal = updatedCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      setSubTotal(newSubTotal);

    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Drawer
      title="Cart"
      closable={true}
      onClose={onClose}
      open={open}
      width={400}
    >
      <Cart 
        cart={cart} 
        loading={loading} 
        subTotal={subTotal} 
        deleteItem={deleteItem} 
        closeCart={closeCart} 
        navigate={navigate} 
      />
    </Drawer>
  );
};

export default CartDrawer;
