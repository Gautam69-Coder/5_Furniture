
import { motion, easeInOut } from 'motion/react';
import { Link } from 'react-router-dom';
import { slugify } from '../Utils/slugify';
import { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import {FurnitureCollection,FurnishingCollection} from "../Collections/Navbardata" 


const NavMenu = () => {

    const [Dropdown, setDropdown] = useState(false);
    const [TopImageURL, setTopImageURL] = useState('https://freedomtree.in/cdn/shop/files/Website_-_Nav_Images_1179_x_543_px_54.jpg?v=1760088073');
    const [BottomImageName, setBottomImageName] = useState('Gifting Ideas');
    const [TopImageName, setTopImageName] = useState('Phases Clothing Collection');

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

    const NewCollection = [
        { title: "Phases Clothing Collection", imageURL: "https://freedomtree.in/cdn/shop/files/Website_-_Nav_Images_1179_x_543_px_54.jpg?v=1760088073" },
        { title: "Rainshine Home Collection", imageURL: "https://freedomtree.in/cdn/shop/files/Website_-_Nav_Images_1179_x_543_px_48.jpg?v=1751023359" },
        { title: "Midori Ceramics", imageURL: "https://freedomtree.in/cdn/shop/files/Website_-_Nav_Images_1179_x_543_px_51.jpg?v=1755688964" }
    ]

    const New2ndCollection = [
        { title: "Founder Note on Nest" },
        { title: "Responsible Design" },
        { title: "Free wheeling with FT >>" },
        { title: "Gifting Guide" }
    ]


    return (
        <div>
            <div className="bg-[#455360] hidden md:block">
                <ul className="text-[17px] font-medium leading-[26px] gap-1 text-white flex justify-center">
                    <motion.li
                        className="relative px-[15px] py-[7.5px] bg-[#D5918F] cursor-pointer"
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                    >
                        NEST
                        <motion.span
                            className="absolute left-0 bottom-0 h-1.5 bg-white origin-left"
                            variants={{
                                rest: { scaleX: 0 },
                                hover: { scaleX: 1 },
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ width: "100%" }}
                        />
                    </motion.li>

                    {menuItems2.map((item, i) => (
                        <motion.li
                            key={i}
                            className="relative z-50 px-[15px] py-[7.5px] cursor-pointer"
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            onMouseEnter={() => {
                                setDropdown(item.index);
                            }}

                        >
                            <Link to={`/collections/${slugify(item.title)}`}>
                                {item.title}
                            </Link>
                            <motion.span
                                className="absolute left-0 bottom-0 h-1.5 bg-white origin-left"
                                variants={{
                                    rest: { scaleX: 0 },
                                    hover: { scaleX: 1 },
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ width: "100%" }}
                            />
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Dropdown Menus for Desktop (Hidden on small screens) */}
            {Dropdown === 1 ? (
                <div className='absolute z-50 bg-white hidden md:block'>
                    <div className='mx-[190.400px] pt-5 pb-5 flex ' onMouseLeave={() => setDropdown(false)}>
                        <div className=' px-[25px] max-w-[28%] w-[319px]'>
                            <div className='pl-[9px] pb-3 text-[16px] leading-6 font-medium tracking-[1px]'>
                                {NewCollection.map((item, index) => (
                                    <div className='px-[9px] py-1.5 hover:bg-gray-200' key={index}
                                        onMouseOver={() => {
                                            setTopImageName(item.title)
                                            setTopImageURL(item.imageURL)
                                        }}>
                                        {item.title}
                                    </div>
                                ))}
                                <div className='mb-5'></div>
                                {New2ndCollection.map((item, index) => (
                                    <div className='px-[9px] py-1.5 hover:bg-gray-200' key={index} >
                                        {item.title}
                                    </div>
                                ))}
                                <div className='mb-5'></div>
                            </div>
                        </div>

                        <div className='border-r border-gray-300 hover:underline border-l px-[25px] max-w-[36%] text-[17px] leading-[26px] font-normal '>
                            <div className='overflow-hidden '>
                                <img src="https://freedomtree.in/cdn/shop/files/New_2c281347-adff-4bae-bdb7-ac9b71181ee9_large.jpg?v=1758871244" alt=""
                                    className=' mb-2 h-96 w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105'
                                />
                                <div>Home Decor</div>
                            </div>
                        </div>

                        <div className="px-[25px] flex flex-col space-y-4 max-w-[36%] text-[17px] leading-[26px] font-normal">
                            <div className="mb-2 overflow-hidden hover:underline">
                                <img
                                    src={TopImageURL}
                                    alt=""
                                    className="mb-2 h-[165px] w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                />
                                <div className="text-left ">{TopImageName}</div>
                            </div>

                            <div className="mb-2 overflow-hidden hover:underline">
                                <img
                                    src="https://freedomtree.in/cdn/shop/files/GIFTING_9f0d6aea-8dc2-470d-9464-52e7eb5a2056_large.jpg?v=1738711856"
                                    alt=""
                                    className="mb-2 h-[165px] w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                />
                                <div className="text-left ">{BottomImageName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : Dropdown === 2 ? (
                <div onMouseLeave={() => setDropdown(false)} className='hidden md:block'>
                    <DropdownMenu
                        FurnitureCollection={FurnitureCollection}
                        MyDropdown={Dropdown}
                    />
                </div>
            ) : Dropdown === 3 ? (
                <div onMouseLeave={() => setDropdown(false)} className='hidden md:block'>
                    <DropdownMenu
                        MyDropdown={Dropdown}
                        FurnishingCollection={FurnishingCollection}
                    />
                </div>
            ) : null}
        </div>


    )
}

export default NavMenu
