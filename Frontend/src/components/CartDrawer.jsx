import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';

import { useQuickView } from '../context/PopupContext';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Cart from './Cart';
import { API_BASE_URL } from '../api';


const CartDrawer = ({ Close }) => {
  const { closeCart, isOpenCart } = useQuickView();
  const [open, setOpen] = useState(false);
  const [cart, setcart] = useState([])
  const [deleteProduct, setdeleteProduct] = useState(false)
  const [subTotal, setsubTotal] = useState()
  const [loading, setloading] = useState(false)

  const onClose = () => {
    setOpen(false);
    closeCart()
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpenCart) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isOpenCart])

  const deleteItem = async (productId) => {
    try {
      const token = localStorage.getItem("refreshToken")
      const res = await axios.post(`${API_BASE_URL}/api/v1/deleteItem`,
        { productId },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch Cart Data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setloading(true)
        const token = localStorage.getItem("refreshToken")
        const res = await axios.get(`${API_BASE_URL}/api/v1/cart`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log(res.data.data.length)
        setcart(res.data.data[0]?.product || []);
        if (res.data.data.length === 0) {
          setloading(false);
        }
        else {
          setloading(false);
          const s = res.data.data[0].product.reduce((total, item) => {
            return total + item.price * item.quantity
          }, 0)
          setsubTotal(s)
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (isOpenCart || deleteProduct) fetchCart();
  }, [isOpenCart, deleteProduct]);


  return (
    <>
      <Drawer
        title="Cart"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        onClick={() => {
          Close
          closeCart
        }}
        open={open}
        className='flex justify-center w-[400px]'
      >
        <Cart cart={cart} loading={loading} subTotal={subTotal} deleteItem={deleteItem} setdeleteProduct={setdeleteProduct} deleteProduct={deleteProduct} closeCart={closeCart} navigate={navigate} />
      </Drawer>
    </>
  );
};
export default CartDrawer;