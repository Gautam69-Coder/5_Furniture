import { useState, useEffect } from 'react'
import logos from "../assets/logos/facebook.svg"
import { collectionsData } from '../Collections/data'

const Footter = () => {

    const [email, setemail] = useState()

    const data = collectionsData;
    const furniture = data.furniture.map((item)=>(item.category));
    const furnishing = data.furnishing.map((item)=>(item.category));
    
    const usefulLinks = {
        data: [
            "Our Story",
            "Our Store",
            "Inspiration",
            "Free Design Services",
            "For Profeesional",
            "Carrers",
            "Contact Us",
            "Shipping & Delivery",
            "Terms & Conditions",
        ],
    };


    return (
        <div>
            <hr className='text-[#e9c1bd] my-2' />

            <div className='mx-[60px]  mb-15'>
                <div className="md:flex md:gap-4 ">
                    <div className="overflow-hidden">
                        <img className='mb-[30px] cursor-pointer hover:scale-105 object-cover transition-all w-full ' src="https://freedomtree.in/cdn/shop/files/Sitewide_34d8e893-7dc0-4313-a155-b66aa70a0fa5_720x.jpg?v=1761326444" alt="" />
                        <p className='text-[28px] leading-7 font-bold text-center mb-4'> Ready to Ship Furniture</p>
                        <p className='text-[17px] leading-[27px] font-normal text-center mb-4'> Handcrafted furniture from our design studio. Ships in two weeks.</p>
                        <div className='flex justify-center items-center'>
                            <button className='py-3 cursor-pointer px-[37px] border font-normal text-[11px] leading-4 border-[#e8e8e1]'>Shop Now</button>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <img className='mb-[30px] cursor-pointer hover:scale-105 object-cover transition-all w-full ' src="https://freedomtree.in/cdn/shop/files/Sitewide_34d8e893-7dc0-4313-a155-b66aa70a0fa5_720x.jpg?v=1761326444" alt="" />
                        <p className='text-[28px] leading-7 font-bold text-center mb-4'> Ready to Ship Furniture</p>
                        <p className='text-[17px] leading-[27px] font-normal text-center mb-4'> Handcrafted furniture from our design studio. Ships in two weeks.</p>
                        <div className='flex justify-center items-center'>
                            <button className=' cursor-pointer py-3 px-[37px] border font-normal text-[11px] leading-4 border-[#e8e8e1]'>Shop Now</button>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <img className='mb-[30px] cursor-pointer hover:scale-105 object-cover transition-all w-full ' src="https://freedomtree.in/cdn/shop/files/Sitewide_34d8e893-7dc0-4313-a155-b66aa70a0fa5_720x.jpg?v=1761326444" alt="" />
                        <p className='text-[28px] leading-7 font-bold text-center mb-4'> Ready to Ship Furniture</p>
                        <p className='text-[17px] leading-[27px] font-normal text-center mb-4'> Handcrafted furniture from our design studio. Ships in two weeks.</p>
                        <div className='flex justify-center items-center'>
                            <button className='py-3 px-[37px] cursor-pointer border font-normal text-[11px] leading-4 border-[#e8e8e1]'>Shop Now</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className='w-full bg-black text-white flex flex-wrap md:justify-between justify-evenly px-10 py-4 items-center  '>
                <div>
                    <h3 className='cursor-pointer text-[14px] leading-[22px] font-normal md:m-0 mb-6 mt-2 text-center tracking-[2px]'>NOTIFY ME FOR LATEST UPDATES</h3>
                </div>

                <div className='md:m-0 mb-6 flex '>
                    <input type="email"
                        value={email}
                        defaultValue={localStorage.getItem("email")}
                        placeholder='Enter your email address'
                        className='focus:outline-none border-b w-60'
                        onChange={(e)=>{
                            setemail(e.target.value)
                        }}
                    />
                    <button className='p-2 border mx-2 rounded-2xl cursor-pointer text-[15px]'>
                        Subscribe
                    </button>
                </div>

                <div className='flex '>
                    {/* FaceBook */}
                    <div className='cursor-pointer w-full m-[7.5px]'>
                        <img src={logos} height={12} width={22} alt="" />
                    </div>
                    <div className='cursor-pointer w-full m-[7.5px]'>
                        <img src={logos} height={12} width={22} alt="" />
                    </div>
                    <div className='cursor-pointer w-full m-[7.5px]'>
                        <img src={logos} height={12} width={22} alt="" />
                    </div>
                    <div className='cursor-pointer w-full m-[7.5px]'>
                        <img src={logos} height={12} width={22} alt="" />
                    </div>
                    <div className='cursor-pointer w-full m-[7.5px]'>
                        <img src={logos} height={12} width={22} alt="" />
                    </div>
                </div>
            </div>

            <div className='m-[30px]'></div>

            <div className='flex flex-wrap mx-[60px] gap-10 mb-10 justify-between items-center'>
                <div className='text-[#545454] font-bold tracking-[2px] text-[13px]'>USEFULL LINKS</div>
                <ul className='text-[#545454] flex flex-wrap justify-around gap-10 items-center text-[13px]'>
                    {usefulLinks.data.map((item, index) => (
                        <li key={index} className="hover:underline cursor-pointer">{item}</li>
                    ))}
                    <li className='p-4 w-20 text-center bg-black cursor-pointer text-white rounded-2xl'>Login</li>
                </ul>
            </div>

            <div className=' my-10 mx-[60px] '>
                <div className="flex justify-between flex-wrap ">
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>FURNITURE</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454] space-y-2 text-left flex flex-col  text-[13px]'>
                                {furniture[0].map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>FURNISHING</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454]  space-y-2 text-left flex flex-col  text-[13px]'>
                                {furnishing[0].map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer flex ">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>DINNING</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454] space-y-2 text-left  text-[13px]'>
                                {data.dining.map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>DECOR & LIGHTING</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454] space-y-2 text-left  text-[13px]'>
                                {data.decorAndLighting.map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>CLOTHING</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454] space-y-2 text-left  text-[13px]'>
                                {data.clothing.map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:m-0 mb-10">
                        <div className='text-[#545454]  tracking-[2px] text-[15px] text-left mb-5'>GIFTING</div>
                        <div className='flex flex-col '>
                            <ul className='text-[#545454] space-y-2 text-left  text-[13px]'>
                                {data.gifting.map((items, index) => (
                                    <li key={index} className="hover:underline cursor-pointer">{items}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className='m-[30px]'></div>

            <div className='mx-[60px] text-[#545454] text-justify '>
                <div className='font-normal text-[14px] leading-[22px]  tracking-[.2em] mb-5'>
                    Shipping & Returns Policy
                </div>
                <div className='mb-[15px]'>
                    <p className='mb-[15px]'>
                        We offer free shipping on most products, including furniture, for orders above Rs. 1999, across India. Our goal is to deliver your products within 10-15 working days, although larger furniture items may take up to 6-8 weeks for delivery. Freedom Tree’s return or exchange policy applies only in cases of damaged, defective, or incorrectly delivered products. In such cases, we will either exchange the product or provide you with store credit for the full amount paid. We maintain rigorous hygiene standards and regular sanitization procedures to ensure your safety
                    </p>
                    <p className='mb-[15px] cursor-pointer'>
                        Read more shipping and returns.
                    </p>
                    <p className='mb-[15px] cursor-pointer'>
                        Review our privacy policy and terms and conditions.
                    </p>
                </div>
            </div>

            <div className='m-[30px]'></div>

            <div className='mx-[60px] text-[#545454] text-justify'>
                <div className='font-normal text-[14px] leading-[22px]  tracking-[.2em] mb-5'>
                    Bringing you the best of home decor
                </div>

                <p className='mb-[15px]'>
                    Good design, every day – exclusively curated by our design team for your happy home. Our collection includes everything from designer furniture and home furnishings to hand-painted dinnerware, as well as printed, woven, and solid fabrics – all available online with the click of a button or at our stores! We also offer a wide range of indoor lighting for your home and office, along with an impressive selection of cushion covers, curtains, bedcovers, rugs, blankets, and pillows for your space. Shop FT's signature and new-age designs online or in-store to experience a beautiful home décor story!
                </p>
            </div>

            <div className='flex flex-col justify-center items-center mb-40 mt-20'>
                <div className='mb-5'>
                    <svg className="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"></path><path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"></path><path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"></path></svg>
                </div>
                <p className='text-[15px]'>© 2025 Freedom Tree | All rights reserved</p>
            </div>

        </div>
    )
}

export default Footter
