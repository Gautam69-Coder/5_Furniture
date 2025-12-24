import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollTop.jsx";

import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './components/Navbar'
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

// TopMenu Pages

// Contact Us Page
import Contact from './Pages/TopMenu/ContactUs.jsx';

//Professional Page
import Professional from './Pages/TopMenu/Professional.jsx';


const App = () => {

  const location = useLocation();

  const hideNavbar = location.pathname === "/checkout"




  return (
    <>
      {/* Global Navbar or hide a navabar in checkout page */}
      {!hideNavbar && <Navbar />}

      <main>
        <AnimatePresence mode="wait" >
            <ScrollToTop/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/practice' element={<Practice />} />
            <Route path='/p' element={<CartDrawer />} />

            {/* Top Menu Pages*/}
            <Route path='/pages/contact-us' element={<Contact />} />
            <Route path='/pages/professionals' element={<Professional />} />

            {/*Colllection Routes*/}
            <Route path='/collections/:category' element={<Furniture />} />

            {/* Product Page */}
            <Route path="/collections/:category/products/:id/" element={<ProductPage />} />

            {/* Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Payment */}
            <Route path="/payment-status" element={<PaymentStatus />} />

            {/* Order */}
            <Route path="/order/:orderId" element={<OrderDetails  />} />
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
