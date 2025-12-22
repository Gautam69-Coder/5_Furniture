import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './components/Navbar'
import Contact from './Pages/ContactUs';
import Practice from './Pages/Practice';
import Profile from './Pages/Profile';
import Footter from './components/Footter';
import Furniture from "./Pages/Collection";
import ProductPage from "./Pages/Product";
import QuickView from "./components/QuickView";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./Pages/Checkout";
import PaymentStatus from "./Pages/PaymentStatus";
import OrderDetails from "./Pages/Order";



const App = () => {

  const location = useLocation();

  const hideNavbar = location.pathname === "/checkout"

  const order = {
    orderId: "FT-ORD-239018",
    orderDate: "12 April 2025",
    total: 4890,
    items: [
        {
            name: "Handcrafted Cotton Cushion Cover",
            material: "100% Cotton",
            size: "16 x 16 inch",
            qty: 2,
            price: 2495,
            image: "/cushion.jpg"
        }
    ],
    status: [
        { label: "Confirmed", completed: true },
        { label: "Shipped", completed: true },
        { label: "Delivered", completed: false }
    ],
    address: {
        name: "Gautam Doliya",
        street: "Chembur East",
        city: "Mumbai",
        pincode: "400071",
        phone: "+91 9XXXXXXXXX"
    }
};



  return (
    <>
      {/* Global Navbar or hide a navabar in checkout page */}
      {!hideNavbar && <Navbar />}

      <main>
        <AnimatePresence mode="wait" >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/pages/contact-us' element={<Contact />} />
            <Route path='/practice' element={<Practice />} />
            <Route path='/p' element={<CartDrawer />} />


            {/*Colllection Routes*/}
            <Route path='/collections/:category' element={<Furniture />} />

            {/* Product Page */}
            <Route path="/collections/:category/products/:id/" element={<ProductPage />} />

            {/* Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Payment */}
            <Route path="/payment-status" element={<PaymentStatus />} />

            {/* Order */}
            <Route path="/order/:orderId" element={<OrderDetails order={order} />} />
          </Routes>
        </AnimatePresence>

        {/* //Popup and Drawer */}
        <QuickView />
        <CartDrawer />
        <Login />
      </main>

      {/* Global Footer or hide a navabar in checkout page */}
      {!hideNavbar && <Footter />}

    </>
  )
}

export default App
