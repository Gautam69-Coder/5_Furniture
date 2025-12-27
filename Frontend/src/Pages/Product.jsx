import { useParams } from 'react-router-dom'
import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import facebookLogo from "../assets/logos/facebook.svg"
import { useQuickView } from '../context/PopupContext';

const ProductPage = () => {
    const { openCart } = useQuickView();
    const { id } = useParams();
    const [product, setproduct] = useState([])
    const [qty, setqty] = useState(1);
    const [zoom, setzoom] = useState(false);
    const [img, setimg] = useState("https://freedomtree.in/cdn/shop/files/buy-toddy-palm-pure-cotton-moss-grey-printed-upholstery-fabric-online-10000017508-1193955233_360x.jpg");
    const [isSection, setisSection] = useState({
        details: true,
        instruction: true,
    })

    // const [AddToCart, setAddToCart] = useState();

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get("/api/v1/product/");
                const products = res.data.data;
                console.log(products)
                const productk = products.find(item => item.name.toLowerCase().replace(/\s+/g, "-") === id);
                setproduct(productk);
                console.log(productk)
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchdata();
    }, [id]);


    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const userActivity = async () => {
            try {

                const res2 = await axios.get("/api/v1/product/");
                const products = res2.data.data;
                // console.log(product)

                const productt = products.find(item => item.name.toLowerCase().replace(/\s+/g, "-") === id);
                // console.log(productt)
                const token = localStorage.getItem("refreshToken");
                const res = await axios.post("/api/v1/track", {
                    action: "view",
                    productId: productt?._id,
                    category: productt?.category
                },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }

                );
                console.log(res)
            } catch (error) {
                console.log(error);
            }
        }
        userActivity();
    }, [id])


    const increaseQty = () => {
        if (qty < 10) {
            setqty(qty + 1);
        }
    }
    const decreaseQty = () => {
        if (qty > 1) {
            setqty(qty - 1);
        }
    }

    const cartData = async () => {
        try {
            const token = localStorage.getItem("refreshToken");

            const res = await axios.post(
                "/api/v1/cart",
                {
                    productId: product._id,
                    name: product.name,
                    image: img,
                    price: product.price,
                    quantity: qty,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);
            openCart();
        } catch (error) {
            console.log("Error in cart", error.response?.data || error.message);
        }
    };

    const userActivity = async () => {
        try {

            const token = localStorage.getItem("refreshToken");
            const res = await axios.post("/api/v1/track", {
                action: "add_to_cart",
                productId: product._id
            },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }

            );
            console.log(res)
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}

            transition={{
                duration: 0.5,
                delay: 0.5,
            }} className="p-6 sm:pt-5 pt-2 sm:px-[60px] px-5">

            {/* <div className='flex justify-start'>
                <p className='text-[11px] leading-[18px]  font-normal flex gap-1 '>
                    <Link className='text-[#0db269]' to={"/"}>Home</Link>
                    /
                    <Link className='text-[#0db269]' to={`/collections/${product.category}`}>{product.category}</Link>
                    /
                    <Link>{product.name}</Link>
                </p>
            </div> */}

            <div className='grid grid-cols-1 sm:grid-cols-5 w-full'>

                {/* Image part */}
                <div className='sm:flex gap-4 my-4 sm:mr-[22px]  col-span-2'>
                    <div className='sm:flex sm:flex-col  gap-[15px] h-[600px] sm:overflow-y-auto hide-scrollbar mb-2  hidden '>
                        <img src={product?.images || "https://freedomtree.in/cdn/shop/files/buy-toddy-palm-pure-cotton-moss-grey-printed-upholstery-fabric-online-10000017508-1193955233_360x.jpg"}
                            className='object-center sm:w-22 sm:h-30 h-30 w-20 bg-black hover:border-black hover:border-2  ' alt=""
                            onClick={() => {
                                setimg(product?.images)
                            }}

                        />
                        {product?.gallery?.map((item, index) => (
                            <div key={index}>
                                <img src={item || "Hello"}
                                    className='object-center sm:w-22 sm:h-30 h-30 w-20  bg-black hover:border-black hover:border-2' alt=""
                                    onClick={() => {
                                        setimg(item)
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="overflow-hidden sm:w-[450px] sm:h-[600px] w-auto h-[400px] ">
                        <img
                            src={img || "https://freedomtree.in/cdn/shop/files/buy-toddy-palm-pure-cotton-moss-grey-printed-upholstery-fabric-online-10000017508-1193955233_360x.jpg"}
                            alt=""
                            className={` transition-all cursor-zoom-in duration-300 object-cover w-full h-full ${zoom ? "scale-150 cursor-zoom-out" : "scale-100 cursor-none"}`}
                            onClick={() => setzoom(!zoom)}
                        />
                    </div>
                    <div className="flex gap-[15px] mt-2 overflow-x-auto whitespace-nowrap w-full sm:hidden hide-scrollbar">

                        <img
                            src={product?.images}
                            className="h-30 w-20 shrink-0 object-center bg-black hover:border-black hover:border-2"
                            onClick={() => setimg(product?.images)}
                        />

                        {product?.gallery?.map((item, index) => (
                            <img
                                key={index}
                                src={item}
                                className="h-30 w-20 shrink-0 object-center bg-black hover:border-black hover:border-2"
                                onClick={() => setimg(item)}
                            />
                        ))}
                    </div>

                </div>

                {/* Main details product page */}
                <div className='text-left pt-2  sm:pl-5 col-span-3'>
                    <div className='mb-[30px]'>
                        <div className='sm:text-[30px] font-semibold mb-2'>
                            {product?.name}
                        </div>
                        <div className='sm:text-[25px] font-light flex gap-2' >
                            Rs. <p className='italic'>{product?.price}</p>
                        </div>
                    </div>
                    <div className='mb-5'>
                        <p className='mb-2 font-light text-[14px]'>SIZE</p>
                        <div className='mb-5 border-black border-2 w-fit sm:px-4 px-3 py-2 uppercase sm:py-2 text-[12px]'>{product?.details?.sizeCM || `Normal Size`}</div>
                    </div>

                    <div className='mb-5'>
                        <p className='text-[14px] uppercase mt-4 mb-5'>Select from any of our upholstery options</p>
                        <div className=' border-gray-300 border-2 w-fit sm:px-4 px-3 text-[12px] sm:text-[14px] uppercase py-2 hover:border-black hover:border-2'>Browse All Upadate</div>
                    </div>

                    <div className='mb-5'>
                        <p className='uppercase mb-2 sm:text-[14px] text-[14px]'>Pick suggest colors - Fabric selected Seprately </p>
                        <div className='flex gap-2'>
                            {product?.gallery?.map((item, index) => (
                                <div key={index} className='border-gray-300 overflow-hidden focus:border-black border-2   hover:border-black rounded-full w-10 h-10 flex justify-center items-center'>
                                    <img src={item} alt={item}
                                        className='w-10 h-10 rounded-full scale-2000 p-2 object-center'
                                        onClick={() => {
                                            setimg(item)
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='text-[12px] mb-1'>
                        Quantity
                    </div>
                    <div className='border flex w-fit text-[18px] justify-center items-center mb-15'>

                        <button className='border-r px-2 py-1 cursor-pointer' onClick={() => { decreaseQty() }}>-</button >
                        <div className='w-[60px] text-center ' >{qty}</div>
                        <button className='border-l px-2 py-1 cursor-pointer' onClick={() => { increaseQty() }}>+</button >
                    </div>

                    <div className='flex justify-between gap-2'>
                        <button className='px-6 text-center bg-black py-3 text-white uppercase font-bold text-[14px] w-full cursor-pointer'
                            onClick={() => {
                                userActivity();
                                cartData();
                            }} >Add to Cart</button>
                        <button className='px-6 text-center hover:bg-black bg-[#0db269] py-3 text-white uppercase font-bold text-[14px] w-full transition-all duration-300 cursor-pointer' >Buy it Now</button>
                    </div>

                    <div className='text-left my-10 font-medium '>
                        <p>A classic and handsome chair, it can easily be an accent chair in a bedroom or sitting area. The arms gracefully slope down to the seat, giving it an effortless formality. Upholstery in unexpected graphic prints gives it a cheeky update. Contact us for fabric options.</p>
                    </div>

                    <div className=''>
                        <img src="https://cdn.shopify.com/s/files/1/0258/1394/2371/files/product_page_narrow_banner_15.jpg?v=1740134690" alt="" />
                    </div>

                    <div className='mt-10 sm:mb-30 mb-10'>
                        <p className='mb-4 text-[16px] font-bold'>Explore by : </p>
                        <div className='text-[14px] font-medium'>
                            <div className='mb-1 flex gap-2'>
                                <p className=''>Category : </p>
                                <span className='text-blue-400 underline'> {product?.category}</span>
                            </div>
                            <div className='mb-1 flex gap-2'>
                                <p className=''>SubCategory : </p>
                                <span className='text-blue-400 underline'> {product?.subCategory}</span>
                            </div>
                            <div className='mb-1 flex gap-2'>
                                <p className=''>Product Category : </p>
                                <span className='text-blue-400 underline'>Accent Chairs</span>
                            </div>
                        </div>
                    </div>

                    <div className='font-bold text-[17px]'>
                        Ready to Ship Furniture will be dispatched within 2 weeks of placing order with 7-10 day delivery timeline. Prices include pan-India shipping and GST. Please contact our stores for local delivery rates.
                    </div>

                    <div className='w-full border border-gray-400 py-2.5 px-5 mt-10'>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-bold p-2.5 transition-all'>Details</h1>
                            <p className={`transition-all text-[20px] cursor-pointer ${!isSection.details ? "rotate-0" : "rotate-90"}`}
                                onClick={() => {
                                    if (isSection.details) {
                                        setisSection(prev => ({ ...prev, details: false }))
                                    } else {
                                        setisSection(prev => ({ ...prev, details: true }))
                                    }
                                }}
                            >{`>`}</p>
                        </div>
                        {isSection.details && (
                            <div className='transition-all'>
                                <ul className='flex flex-col gap-1 list-disc px-5'>
                                    <li className='font-bold'>Size : <span className='font-normal'>{product?.details?.sizeCM}</span></li>
                                    <li className='font-bold'>Size Conversion : <span className='font-normal'>{product?.details?.sizeIN}</span></li>
                                    {/* <li className='font-bold'>Additional Sizes : <span className='font-normal'>{product.details?.additionalSizes ||`Not data found`}</span></li> */}
                                    <li className='font-bold'>Material : <span className='font-normal'>{product?.details?.material || `No Data Found`}</span></li>
                                    <li className='font-bold'>Color : <span className='font-normal'>{product?.details?.color || `No Data Found`}</span></li>
                                    <li className='font-bold'>Style : <span className='font-normal'>{product?.details?.stlye || `No Data Found`}</span></li>
                                    <li className='font-bold'>Technique : <span className='font-normal'>{product?.details?.technique || `No Data Found`}</span></li>
                                    <li className='font-bold'>Foam Feel : <span className='font-normal'>{product?.details?.foamFeel || `No Data Found`}</span></li>
                                    <li className='font-bold'>Fabric custamisation : <span className='font-normal'>{product?.details?.fabricCustomisation || `No Data Found`}</span></li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className='w-full border border-gray-400 py-2.5 px-5 mt-10'>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-bold p-2.5 transition-all '>Information</h1>
                            <p className={`transition-all text-[20px] cursor-pointer ${!isSection.instruction ? "rotate-0" : "rotate-90"}`}
                                onClick={() => {
                                    if (isSection.instruction) {
                                        setisSection(prev => ({ ...prev, instruction: false }))
                                    } else {
                                        setisSection(prev => ({ ...prev, instruction: true }))
                                    }
                                }}
                            >{`>`}</p>
                        </div>
                        {isSection.instruction && (
                            <div>
                                <ul className='flex flex-col gap-1 list-disc px-5'>
                                    <li className='font-normal'>Our furniture is made with natural materials and techniques, they require your mindful care for a long life in your home. Read More about how to care for and what to expect from your furniture</li>
                                    <li className='font-normal'>Dust daily with soft cloth or duster, wipe clean weekly with a damp cloth to avoid dust residue settling.</li>
                                    <li className='font-normal'>Protect the surfaces from exposure to sun and water, excessive temperature variations, moisture, and heat. Indoor use only.</li>
                                    <li className='font-normal'>Avoid banging, dropping or improper usage of the pieces as this will void the warranty. We always recommend professional packers for moving.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className='w-full border border-gray-400 py-2.5 px-5 mt-10'>
                        <h1 className='font-bold p-2.5'>Instruction</h1>
                        <div>
                            <ul className='flex flex-col gap-1 list-disc px-5'>
                                <li className='font-bold'>Note : <span className='font-normal'>Please select your upholstery separately if you do not select one of the options above. Please contact our customer care team for detailed furniture dimensions, material information, or delivery queries.</span></li>
                                <li className='font-bold'>Pricing : <span className='font-normal'>All prices inclusive of pan India shipping charges of 10-15% and GST.</span></li>
                                <li className='font-bold'>Delivery : <span className='font-normal'>We deliver furniture across India! If the item is in stock, expect delivery within 3-4 weeks. For items under production, delivery may take 6-8 weeks.</span></li>
                                <li className='font-bold'>Product variation : <span className='font-normal'>Each piece will have small variations in size, shape, and finish that are a hallmark of our handmade small batch production process.</span></li>
                                <li className='font-bold'>Return and Exchange : <span className='font-normal'>Items once sold can only be exchanged for store credit if there is a recognizable quality issue or damage in delivery.</span></li>
                                <li className='font-bold'>Product Warranty : <span className='font-normal'>Limited 1 year warranty from delivery due to manufacturing defect or damage in delivery.</span></li>
                                <li className='font-bold'>International Shipping and Cash on Delivery : <span className='font-normal'>International shipping is available. Please contact us for assistance. Cash on Delivery not available.</span></li>
                                <li className='font-bold'>Origin : <span className='font-normal'>Made in India. Sold by Freedom Tree Retail LLP.</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <div className='mt-10 flex gap-2 items-center'>
                            <p>Share on : </p> <img src={facebookLogo} alt="" className='invert w-4 h-4' /> <p>share</p>
                        </div>

                        <div className='mt-10 flex gap-2 items-center'>
                            <img src={facebookLogo} alt="" className='invert w-4 h-4' /> <p>tweet</p>
                        </div>

                        <div className='mt-10 flex gap-2 items-center'>
                            <img src={facebookLogo} alt="" className='invert w-4 h-4' /> <p>Pin it</p>
                        </div>
                    </div>
                </div>

            </div>
            <div>

            </div>

        </motion.div>
    )
}

export default ProductPage
