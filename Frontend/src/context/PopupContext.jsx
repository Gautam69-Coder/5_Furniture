import { createContext, useContext, useState } from "react";
import axios from "axios"
import { useEffect } from "react";
export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  //Quick View
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);

  //Cart Data and Cart drawer open and close
  const [isOpenCart, setisOpenCart] = useState(false);
  const [CartProduct, setCartProduct] = useState(null);

  //Login
  const [isLoginOpen, setisLoginOpen] = useState(false);
  const [loginData, setloginData] = useState(null);

  //Quantity
  const [quantity, setquantity] = useState(1);
  const [quantityProductId, setquantityProductId] = useState("");

  //Search
  const [isSearch, setisSearch] = useState(false);

  const openQuickView = (productData) => {
    setProduct(productData);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setProduct(null);
  };

  const openCart = (productData) => {
    setCartProduct(productData);
    setisOpenCart(true);
  }

  const closeCart = () => {
    setCartProduct(null);
    setisOpenCart(false);
  }

  const openLogin = (loginData) => {
    // setloginData(loginData);
    setisLoginOpen(true);
  }

  const increaseQty = (quantity, productId) => {
    if (quantity < 10) {
      setquantity(quantity + 1);
      setquantityProductId(productId)
    }
  }

  const decreaseQty = (quantity, productId) => {
    if (quantity > 1) {
      setquantity(quantity - 1);
      setquantityProductId(productId)
    }
  }

  const closeLogin = () => {
    // setloginData(null)
    setisLoginOpen(false);
  }

  return (
    <PopupContext.Provider value={{
      isOpen, product,

      openQuickView, closeQuickView,
      openCart, closeCart, setCartProduct,

      CartProduct, isOpenCart,
      openLogin, closeLogin,
      isLoginOpen, loginData,

      increaseQty, decreaseQty, quantity,

      isSearch,setisSearch
    }}>
      {children}
    </PopupContext.Provider>
  );
};

export const useQuickView = () => useContext(PopupContext);