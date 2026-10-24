import React, { useState, useEffect } from 'react';
import { Drawer, message } from 'antd';
import { useQuickView } from '../context/PopupContext';
import api from "../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cart from './Cart';
import { API_BASE_URL } from '../api';
import { getErrorMessage } from '../Utils/errorHandler';

const CartDrawer = ({ Close }) => {
  const { closeCart, isOpenCart, user } = useQuickView();
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
        if (!user) {
          setLoading(false);
          setCart([]);
          return;
        }

        const res = await api.get("/cart");

        const products = await res.data.data[0].product;
        console.log("Products  : ",products);
        setCart(products);
        
        const calculatedSubTotal = products.reduce((total, item) => {
          return total + (item.productData.price * item.quantity);
        }, 0);
        
        setSubTotal(calculatedSubTotal);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        setCart([]);
        if (error.response?.status !== 401) {
          message.error(getErrorMessage(error, "Failed to load cart items"));
        }
      }
    };

    if (isOpenCart) {
      setTimeout(() => {
        fetchCart();
      }, 500);
    }
  }, [isOpenCart]);

  const deleteItem = async (productId) => {
    try {
      if (!user) return;

      await api.post("/deleteItem", { productId });

      // Update cart locally after deletion
      const updatedCart = cart.filter(item => item.productId !== productId);
      setCart(updatedCart);
      
      const newSubTotal = updatedCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      setSubTotal(newSubTotal);
      message.success("Item removed from cart");

    } catch (error) {
      message.error(getErrorMessage(error, "Failed to remove item from cart"));
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
