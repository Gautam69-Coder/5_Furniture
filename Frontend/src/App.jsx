import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollTop.jsx";
import { useState } from "react";

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

// Admin Imports
import DashboardLayout from "./Admin/layouts/DashboardLayout.jsx";
import Dashboard from "./Admin/Pages/Dashboard";
import Products from "./Admin/Pages/Products";
import Orders from "./Admin/Pages/Orders";
import Customers from "./Admin/Pages/Customers";
import Settings from "./Admin/Pages/Settings";

// TopMenu Pages

// Contact Us Page
import Contact from './Pages/TopMenu/ContactUs.jsx';

//Professional Page
import Professional from './Pages/TopMenu/Professional.jsx';


const App = () => {

  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const hideNavbar = location.pathname === "/checkout" || location.pathname === "/payment-status" || location.pathname.startsWith("/admin");

  return (
    <>
      {/* Global Navbar or hide a navabar in checkout page */}
      {!hideNavbar && <Navbar />}

      <main>
        <AnimatePresence mode="wait" >
          <ScrollToTop />
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
            <Route path="/order/:orderId" element={<OrderDetails />} />


            {/* Admin Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="/admin/" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            
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
