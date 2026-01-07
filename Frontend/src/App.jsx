import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./components/ScrollTop.jsx";

import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './components/Navbar';
import Practice from './Pages/Practice';
import Profile from './Pages/Profile';
import Footter from './components/Footter';
import Furniture from "./Pages/Collection";
import ProductPage from "./Pages/Product";
import QuickView from "./components/QuickView";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./Pages/Checkout";
import PaymentStatus from "./Pages/PaymentStatus"
import OrderDetails from "./Pages/Order";
import EditProfile from "./Pages/EditProfile.jsx";

// TopMenu Pages
import Contact from './Pages/TopMenu/ContactUs.jsx';
import Professional from './Pages/TopMenu/Professional.jsx';
import Search from "./components/Search.jsx";

// Admin Imports
import DashboardLayout from "./Admin/AdminLayouts/DashboardLayout.jsx";
import Dashboard from "./Admin/AdminPages/ADashboard.jsx";
import Products from "./Admin/AdminPages/AProducts.jsx";
import Orders from "./Admin/AdminPages/AOrders.jsx";
import Customers from "./Admin/AdminPages/ACustomers.jsx";
import Settings from "./Admin/AdminPages/ASettings.jsx"
import AddProduct from  "./Admin/AdminPages/Components/AddProductPopup.jsx"

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/checkout" || location.pathname === "/payment-status" || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main>

        <AnimatePresence >
          <ScrollToTop />
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
            <Route path='/login' element={<PageWrapper><Login /></PageWrapper>} />
            <Route path='/profile' element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path='/profile/edit' element={<PageWrapper><EditProfile /></PageWrapper>} />
            <Route path='/practice' element={<PageWrapper><Practice /></PageWrapper>} />
            <Route path='/p' element={<PageWrapper><CartDrawer /></PageWrapper>} />

            {/* Top Menu Pages */}
            <Route path='/pages/contact-us' element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path='/pages/professionals' element={<PageWrapper><Professional /></PageWrapper>} />

            {/* Collection & Product */}
            <Route path='/collections/:category' element={<PageWrapper><Furniture /></PageWrapper>} />
            <Route path="/collections/:category/products/:id/" element={<PageWrapper><ProductPage /></PageWrapper>} />

            {/* Checkout & Payment */}
            <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path="/payment-status" element={<PageWrapper><PaymentStatus /></PageWrapper>} />

            {/* Order */}
            <Route path="/order/:orderId" element={<PageWrapper><OrderDetails /></PageWrapper>} />

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

        {/* Popups and Drawers */}
        <QuickView />
        <CartDrawer />
        <Login />
        <Search/>

        {/* Admin Popup */}
        <AddProduct/>        
      </main>

      {!hideNavbar && <Footter />}
    </>
  );
};

// Wrapper to animate page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
