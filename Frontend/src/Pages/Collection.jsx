import { useEffect, useState } from 'react';
import Filter from '../components/Filter';
import { motion } from 'motion/react';
import SortProduct from '../components/SortProduct';
import { useQuickView } from '../context/PopupContext';
const Collection = () => {


    const {filter,setfilter}= useQuickView();

    const [filterChange, setfilterChange] = useState([])


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className='sm:mx-[60px] mx-5 sm:mt-5 sm:flex'
        >

            {/* LEFT SIDEBAR */}
            <div className='pr-5 bg-white sticky top-0 h-fit'>

               
                <div className='flex sm:block hidden'>
                    <div>
                        <Filter onFilterChange={(value) => { setfilterChange(value)}} />
                    </div>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div>

                <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pb-[30px]'>
                    <div>
                        <img src="https://freedomtree.in/cdn/shop/files/Living_Room_b7c09749-9bf1-4a08-8bd8-1db7d09d66b4_480x.jpg?v=1758864042" alt="" />
                        <p className='text-[13px] font-medium leading-[19.5px]'>Living room furniture {">>"}</p>
                    </div>
                    <div>
                        <img src="https://freedomtree.in/cdn/shop/files/Living_Room_b7c09749-9bf1-4a08-8bd8-1db7d09d66b4_480x.jpg?v=1758864042" alt="" />
                        <p className='text-[13px] font-medium leading-[19.5px]'>Living room furniture {">>"}</p>
                    </div>
                    <div>
                        <img src="https://freedomtree.in/cdn/shop/files/Living_Room_b7c09749-9bf1-4a08-8bd8-1db7d09d66b4_480x.jpg?v=1758864042" alt="" />
                        <p className='text-[13px] font-medium leading-[19.5px]'>Living room furniture {">>"}</p>
                    </div>
                    <div>
                        <img src="https://freedomtree.in/cdn/shop/files/Living_Room_b7c09749-9bf1-4a08-8bd8-1db7d09d66b4_480x.jpg?v=1758864042" alt="" />
                        <p className='text-[13px] font-medium leading-[19.5px]'>Living room furniture {">>"}</p>
                    </div>
                </div>

                <div className='mb-[15px]'>
                    <div className='box-border'>
                        <h1 className='text-[28px] font-medium'>
                            Modern Designer Furniture, handcrafted for your contemporary homes & offices
                        </h1>
                    </div>
                    <div>
                        <div className="full-text max-open">
                            <p className='text-[13px] leading-[19.5px] font-normal'>
                                Freedom Tree Design Studio is India's best designer furniture store,
                                featuring contemporary furniture designs - especially handmade by skilled
                                artisans from different parts of India. Designed in our studio and made
                                with the highest quality hardwoods, finest craftsmanship, and age-old
                                techniques, we invite you to explore our modern furniture online. Discover
                                a variety of eclectic styles and materials to suit all your needs.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='pb-[30px]'>
                    <p className='font-normal text-[18px] leading-[21px] mb-[15px]'>Get personalized assistance:</p>
                    <div className='gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                        <button className='py-2 px-9 text-left text-[13px] leading-[15px] font-medium text-white bg-black'>
                            Email us {">>"}
                        </button>
                        <button className='py-2 px-9 text-left text-[13px] leading-[15px] font-medium text-white bg-black'>
                            Contact us {">>"}
                        </button>
                        <button className='py-2 px-9 text-left text-[13px] leading-[15px] font-medium text-white bg-black'>
                            Whatsapp {">>"}
                        </button>
                    </div>
                </div>

                <div>
                    <SortProduct ProductSubcategory={filter} />
                </div>

            </div>

        </motion.div>
    )
}

export default Collection;
