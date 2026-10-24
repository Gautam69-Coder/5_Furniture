import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/axiosInstance";
export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const res = await api.get("/user/profile");
      setUser(res.data.data);
      return res.data.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // Cookie cleared even if network fails
    } finally {
      setUser(null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
  
  //Sorting and Filtering Products
  const [sort, setsort] = useState([])
  const [filter, setfilter] = useState([])


  //Start Admin Popup
  const [isOpenEdit,setisOpenEdit] = useState(false);


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
      user, setUser, userLoading, fetchUser, logout,
      isOpen, product,

      openQuickView, closeQuickView,
      openCart, closeCart, setCartProduct,

      CartProduct, isOpenCart,
      openLogin, closeLogin,
      isLoginOpen, loginData,

      increaseQty, decreaseQty, quantity,

      isSearch,setisSearch,

      setsort , sort,

      filter ,setfilter,

      //Admin Popup
      setisOpenEdit ,isOpenEdit,
    }}>
      {children}
    </PopupContext.Provider>
  );
};

export const useQuickView = () => useContext(PopupContext);