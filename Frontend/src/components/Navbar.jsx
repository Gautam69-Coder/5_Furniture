import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, easeInOut } from 'motion/react';
import { slugify } from '../Utils/slugify';
import Login from '../Pages/Login';
import CartDrawer from './CartDrawer';
import NavMenu from './NavMenu';
import { useQuickView } from '../context/PopupContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { openCart, openLogin, closeLogin, setisSearch ,isSearch } = useQuickView();

  const [Islogin, setIslogin] = useState(false);
  const [cartDrawer, setcartDrawer] = useState(false);

  // 1. New state for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    "15 YEAR JOURNEY",
    "OUR WORLD",
    "OUR STORES",
    "FREE DESIGN SERVICES",
    "PROFESSIONALS",
    "CONTACT US",
  ];

  const menuItems2 = [
    { index: 1, title: "NEW!" },
    { index: 2, title: "Furniture" },
    { index: 3, title: "Furnishing" },
    { index: 4, title: "Dinning" },
    { index: 5, title: "Decor & Lights" },
    { index: 6, title: "Clothiing" },
    { index: 7, title: "Gifting" },
    { index: 8, title: "Sale" }
  ];


  return (
    <div className='overflow-x-hidden'>
      <div className='py-[7px] sm:block hidden flex justify-center items-center bg-black'>
        <motion.span className='absolute flex justify-center items-center'
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: -500, opacity: 0 }}
          transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
        >
          <span className='text-white text-center text-[13px] leading-[23px] font-bold'>Soft, Serene, Sensory - </span>
          <span className='text-white text-center text-[13px] leading-[23px] font-normal underline'>Discover Freedom tree - Nest</span>
        </motion.span>
        <motion.span className='text-center relative'
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
        >
          <span className='text-white text-[13px] leading-[23px] font-bold'>Thoughtful designs and joyful finds for every occasion - </span>
          <span className='text-white text-[13px] leading-[23px] font-normal underline'>Discovery freedom tree-Nest</span>
        </motion.span>
      </div>

      <div className=''>
        <div className='px-[20px]  md:px-8'>
          <div className='flex justify-between items-center h-[62px] mb-4'>
            <div className='md:hidden cursor-pointer' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </div>

            <div className='hidden md:flex border h-[30px] cursor-pointer'>
              <input type="text" placeholder='Search our Store '
                onChange={(e) => console.log("User typed:", e.target.value)}
                onClick={()=>{
                  console.log("hello");
                  setisSearch(true);
                  console.log(isSearch)
                }}
                className='focus:outline-none px-3 py-2 text-[17px] w-full' />
              <img src="../src/assets/Icons/search.svg" alt="" width={25} className='mx-3' />
            </div>

            <div className='md:ml-20 cursor-pointer'>
              <img src="../src/assets/Icons/freedomtree.avif" alt="" className='w-[150px] md:w-[220px]'
                onClick={() => {
                  console.log("hello")
                  navigate('/');
                }}
              />
            </div>

            <div className='flex gap-5 items-center'>
              <div className="hidden md:flex justify-center items-center bg-white">
                <select className="px-2 py-2 focus:outline-1 text-[18px] cursor-pointer">
                  <option>INDIA - INR</option>
                  <option>USA - USD</option>
                  <option>Europe - EUR</option>
                  <option>UK - GBP</option>
                  <option>Hong Kong - HKD</option>
                  <option>Japan - JPY</option>
                  <option>Singapore - SGD</option>
                  <option>Australia - AUD</option>
                  <option>New Zealand - NZD</option>
                  <option>Canada - CAD</option>
                  <option>UAE - AED</option>
                  <option>South Korea - KRW</option>
                  <option>Sweden - SEK</option>
                  <option>Poland - PLN</option>
                  <option>Denmark - DKK</option>
                  <option>Qatar - QAR</option>
                </select>
              </div>

              <div className='cursor-pointer'>
                <img src="../src/assets/Icons/profile.svg" alt="profile" width={28} onClick={() => {
                  if (!localStorage.getItem("refreshToken")) {
                    openLogin(null)
                  } else {
                    navigate("/profile")
                  }
                }} />
              </div>

              <div className='cursor-pointer' onClick={() => {
                openCart(null)
              }}>
                <img src="../src/assets/Icons/cart.svg" alt="cart" width={28} />
              </div>

              <div className='hidden md:block cursor-pointer'>
                <img src="../src/assets/Icons/lion.png" alt="lion" width={59}
                  onClick={() => {
                    navigate('/practice');
                  }}
                />
              </div>
            </div>
          </div>

          <div className='mt-[23px] mb-[11px] hidden md:block'>
            <ul className="flex items-center justify-center gap-2 text-[15px] font-normal text-black">
              {menuItems.map((item) => (
                <div key={item}>
                  <li className='hover:underline cursor-pointer border-r text-[14px] pr-4'
                    onClick={() => {
                      navigate(`/pages/${slugify(item)}`)
                    }}
                  >{item}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            className='md:hidden absolute top-0 left-0 w-full bg-white z-40 shadow-xl p-4'
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex justify-end'>
              <button onClick={() => setIsMobileMenuOpen(false)} className='text-2xl'>&times;</button>
            </div>

            <div className='flex border h-20 cursor-pointer mb-4'>
              <input type="text" placeholder='Search our Store '
                className='focus:outline-none px-3 py-2 text-[17px] w-full' />
              <img src="../src/assets/Icons/search.svg" alt="" width={25} className='mx-3' />
            </div>

            <ul className="flex flex-col gap-2 text-[16px] font-medium text-black border-b pb-4 mb-4">
              {menuItems.map((item) => (
                <li key={item} className='py-2 hover:bg-gray-100 px-2'
                  onClick={() => {
                    setIsMobileMenuOpen(false); // Close menu on click
                    navigate(`/pages/${slugify(item)}`);
                  }}
                >{item}</li>
              ))}
            </ul>

            <ul className="flex flex-col gap-2 text-[18px] font-bold text-gray-700">
              {menuItems2.map((item) => (
                <li key={item.index} className='py-2 hover:bg-gray-100 px-2'
                  onClick={() => {
                    setIsMobileMenuOpen(false); // Close menu on click
                    navigate(`/collections/${slugify(item.title)}`);
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <NavMenu />
      </div>

      {/* Login Modal */}
      {Islogin && (
        <div>
          <Login />
        </div>

      )}


    </div>
  )
}

export default Navbar