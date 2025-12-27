import React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js';

const Checkout = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [cart, setcart] = useState([])
    const [subTotal, setsubTotal] = useState()
    const [state, setstate] = useState();
    const [user, setUser] = useState(null);
    const [address, setaddress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Cart Data
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("refreshToken")
                const res = await axios.get("/api/v1/cart", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setcart(res.data.data[0].product);
                console.log(res.data.data);
                const s = res.data.data[0].product.reduce((total, item) => {
                    return total + item.price * item.quantity
                }, 0)
                setsubTotal(s)
                console.log(s)
            } catch (error) {
                console.error(error);
            }
        };
        fetchCart();
    }, []);

    // Fetch User Data
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {

                const token = localStorage.getItem("refreshToken")
                const res = await axios.get("/api/v1/user/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUser(res.data.data);
                // console.log(res.data.data)
                setLoading(false);
            } catch (err) {
                setError("Failed to load user details");
                setLoading(false);
            }
        };


        fetchUserDetails();
    }, []);


    //Payment Handler 

    const handlePayment = async (addressData) => {
        try {
            console.log(cart)
            let cashfree;
            console.log(address)

            cashfree = await load({
                mode: "sandbox"
            });

            const token = localStorage.getItem("refreshToken")

            const response = await axios.post('/api/v1/create-order', {
                amount: subTotal,
                customer_name: user?.firstName || "John Doe",
                customer_email: user?.email || "john@example.com",
                customer_phone: user?.phoneNumber || "9999999999",
                cart,
                address: addressData
            },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }

            );

            console.log(response)

            const sessionId = response.data.data.payment_session_id;
            console.log(sessionId)

            const orderId = response.data.data.order_id;
            localStorage.setItem("currentOrderId", orderId);

            const checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: "_self",
            };

            await cashfree.checkout(checkoutOptions);

            // let checkoutOptions = {
            //     paymentSessionId: "session_Y8KNU3hC_uEMpG8pT19wO8PfvOKNMEu7oUDky7oyGRFsDRi9xDxN8ClW6Ix5nbZgMEa7Cth4igiKeCqycnK6qJ5MWb0GCfk_KeMZbkoW2zpGneVGPdkuKxMc6Y4r5Qpaymentpayment",
            //     redirectTarget: "_self",
            // };
            // cashfree.checkout(checkoutOptions);

        } catch (error) {
            if (error.response) {
                console.log("Server Error:", error.response.data);
            } else {
                console.log("Network/App Error:", error.message);
            }
        }
    }

    const onSubmit = (formData) => {
        console.log("Address Form Data:", formData);
        setaddress(formData);
        handlePayment(formData);
    };

    const Countries = [
        "United States",
        "India",
        "United Kingdom",
        "Canada",
        "Australia",
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Netherlands",
        "China",
        "Japan",
        "South Korea",
        "Singapore",
        "United Arab Emirates",
        "Saudi Arabia",
        "Brazil",
        "Mexico",
        "South Africa",
        "Russia"
    ];

    const [paymentMethod, setPaymentMethod] = useState("cashfree");
    const [billing, setBilling] = useState("same");

    return (
        <div >
            <nav className='py-5 px-[38px] flex justify-around items-center bg-center bg-cover bg-[url("https://cdn.shopify.com/s/files/1/0258/1394/2371/files/cool_collection_51196dc4-7baf-4be6-8af5-142209398314_2000x.jpg?v=1742366830")]'>

                <div className='w-6 h-6'>
                    <svg className='' viewBox="0 0 64 64" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path d="M59.4001 53.82L53.5101 24.37C53.2395 23.0092 52.5058 21.7843 51.4337 20.9036C50.3616 20.023 49.0175 19.5411 47.6301 19.54H45.0001V16C45.0001 12.5522 43.6304 9.24558 41.1925 6.80761C38.7545 4.36964 35.4479 3 32.0001 3C28.5523 3 25.2457 4.36964 22.8077 6.80761C20.3697 9.24558 19.0001 12.5522 19.0001 16V19.54H16.3701C14.9827 19.5411 13.6386 20.023 12.5665 20.9036C11.4944 21.7843 10.7606 23.0092 10.4901 24.37L4.60009 53.82C4.4255 54.6904 4.44623 55.5887 4.6608 56.4502C4.87537 57.3116 5.27842 58.1147 5.8409 58.8015C6.40337 59.4884 7.11125 60.0418 7.91349 60.422C8.71573 60.8022 9.59233 60.9996 10.4801 61H53.4801C54.3678 60.9996 55.2445 60.8022 56.0467 60.422C56.8489 60.0418 57.5568 59.4884 58.1193 58.8015C58.6818 58.1147 59.0848 57.3116 59.2994 56.4502C59.5139 55.5887 59.5347 54.6904 59.3601 53.82H59.4001ZM21.0001 16C21.0001 13.0826 22.159 10.2847 24.2219 8.22183C26.2848 6.15893 29.0827 5 32.0001 5C34.9175 5 37.7154 6.15893 39.7783 8.22183C41.8412 10.2847 43.0001 13.0826 43.0001 16V19.54H21.0001V16ZM56.6101 57.54C56.2349 57.9965 55.7631 58.3642 55.2289 58.6166C54.6946 58.8691 54.111 59 53.5201 59H10.5201C9.92893 58.9995 9.34524 58.868 8.81099 58.615C8.27674 58.3619 7.80522 57.9936 7.43036 57.5365C7.05549 57.0794 6.78661 56.5449 6.64305 55.9714C6.49948 55.398 6.48481 54.7998 6.60009 54.22L12.4901 24.76C12.6704 23.8528 13.1596 23.0362 13.8743 22.4491C14.5891 21.862 15.4852 21.5407 16.4101 21.54H19.0001V27.25C19.0001 27.5152 19.1054 27.7696 19.293 27.9571C19.4805 28.1446 19.7349 28.25 20.0001 28.25C20.2653 28.25 20.5197 28.1446 20.7072 27.9571C20.8947 27.7696 21.0001 27.5152 21.0001 27.25V21.54H43.0001V27.25C43.0001 27.5152 43.1054 27.7696 43.293 27.9571C43.4805 28.1446 43.7349 28.25 44.0001 28.25C44.2653 28.25 44.5197 28.1446 44.7072 27.9571C44.8947 27.7696 45.0001 27.5152 45.0001 27.25V21.54H47.6301C48.555 21.5407 49.4511 21.862 50.1658 22.4491C50.8806 23.0362 51.3697 23.8528 51.5501 24.76L57.4401 54.22C57.5559 54.8003 57.5416 55.3991 57.3981 55.9732C57.2545 56.5474 56.9854 57.0825 56.6101 57.54Z" fill="white"></path>
                    </svg>
                </div>

                <div>
                    <h1 className='font-medium text-[20px] text-white'>Freedom Tree</h1>
                </div>
            </nav>

            <div className='p-[38px] grid grid-cols-6 grid-rows-5   '>
                <div className='col-span-2 row-span-5 col-start-2 pr-6 border-r border-[#DFDFDF]'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='py-[9px] '>

                            <div className='flex items-center text-[14px] justify-between border-b  border-[#DFDFDF] pb-2'>
                                <p className=' p-2 bg-[#F6F6F6] w-fit rounded-full text-[12px]'>GD</p>
                                <div className='flex items-center'>
                                    <p>gautamdoliya69@gmail.com</p>
                                    <svg className='w-4' version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style={{ enableBackground: "new 0 0 32 32" }} xmlSpace="preserve">
                                        <g>
                                            <path d="M16,10c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S14.3,10,16,10z"></path>
                                            <path d="M16,13c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,13,16,13z"></path>
                                            <path d="M16,22c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,22,16,22z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className='mt-8 space-y-4'>
                                <h1 className='pt-2 text-[21px] font-semibold pb-2 leading-[25px]'>Delivery</h1>

                                <select
                                    {...register("country", { required: "Country is required" })}
                                    className="w-full border border-[#DFDFDF] rounded-md px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-1 text-[12px]"
                                    onChange={(e) => { setstate(e.target.value); console.log(e.target.value) }}
                                >
                                    <option value="">Select Country</option>
                                    {Countries.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>

                                {/* First & Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        {...register("firstName", { required: true })}
                                        className="border border-[#DFDFDF] rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        {...register("lastName", { required: true })}
                                        className="border-[#DFDFDF] border rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1"
                                    />
                                </div>

                                {/* Company */}
                                <input
                                    type="text"
                                    placeholder="Company (optional)"
                                    {...register("company")}
                                    className="w-full border border-[#DFDFDF] rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1"
                                />

                                {/* Address */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        {...register("address", { required: true })}
                                        className="w-full border border-[#DFDFDF] rounded-md px-3 py-2 text-[12px] pr-10 focus:outline-none focus:ring-1"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-400"></span>
                                </div>

                                {/* City, State, PIN */}
                                <div className="grid grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        {...register("city", { required: true })}
                                        className="border border-[#DFDFDF] rounded-md px-2 text-[12px] py-3 focus:outline-none focus:ring-1"
                                    />

                                    <select
                                        {...register("state", { required: true })}
                                        className="border border-[#DFDFDF] rounded-md px-2 text-[12px] py-3 focus:outline-none focus:ring-1"
                                    >
                                        <option value="Maharashtra">Maharashtra</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="PIN code"
                                        {...register("pin", { required: true })}
                                        className="border border-[#DFDFDF] rounded-md px-2 text-[12px] py-3 focus:outline-none focus:ring-1"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative mb-10">
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        {...register("phone", { required: true })}
                                        className="w-full border border-[#DFDFDF] rounded-md px-2 text-[12px] py-3 pr-10 focus:outline-none focus:ring-1"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-400">?</span>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-[21px] font-semibold pb-2 leading-[25px]">Payment</h2>
                        <p className="text-[12px] text-gray-500 mb-4">
                            All transactions are secure and encrypted.
                        </p>

                        {/* Payment Box */}
                        <div className="border border-[#DFDFDF]  rounded-lg overflow-hidden">

                            {/* Razorpay */}
                            <label className="flex items-center justify-between p-4 border-b cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "razorpay"}
                                        onChange={() => setPaymentMethod("razorpay")}
                                        className="accent-green-600"
                                    />
                                    <span className="text-[12px] ">
                                        Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/upi.CmgCfll8.svg" alt="" /></span>
                                    <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" alt="" /></span>
                                    <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/master.CzeoQWmc.svg" alt="" /></span>
                                    <span className="text-green-600">+18</span>
                                </div>
                            </label>

                            {/* Cashfree */}
                            <label className="block cursor-pointer">
                                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-600">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "cashfree"}
                                            onChange={() => setPaymentMethod("cashfree")}
                                            className="accent-green-600"
                                        />
                                        <span className="text-[12px] ">
                                            Cashfree Payments (UPI, Cards, Int'l cards, Wallets)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/upi.CmgCfll8.svg" alt="" /></span>
                                        <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" alt="" /></span>
                                        <span className="border px-1 rounded"><img src="https://freedomtree.in/cdn/shopifycloud/checkout-web/assets/c1/assets/master.CzeoQWmc.svg" alt="" /></span>
                                        <span className="text-green-600">+11</span>
                                    </div>
                                </div>

                                {/* EMPTY CARD PLACEHOLDER */}
                                <div className="p-8 bg-gray-50 text-center flex flex-col items-center justify-center">
                                    <div className=" w-44    rounded-md mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-270.8 371 102 52" class="zjrzY"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2" d="M-182 404v16.8c0 .7-.4 1.2-1 1.2h-75.7c-.7 0-1.2-.6-1.2-1.2v-47.6c0-.7.6-1.2 1.2-1.2h75.7c.7 0 1 .6 1 1.2V395m-78-14h78m-17 18h27m-3.9-4.6 4.5 4.6-4.5 4.6"></path><circle cx="-255.5" cy="376.5" r="1.5" fill="currentColor"></circle><circle cx="-250.5" cy="376.5" r="1.5" fill="currentColor"></circle><circle cx="-245.5" cy="376.5" r="1.5" fill="currentColor"></circle></svg>
                                    </div>
                                    <p className="text-[12px] text-gray-600">
                                        After clicking <strong>"Pay now"</strong>, you will be redirected to
                                        Cashfree Payments (UPI, Cards, Int'l cards, Wallets) to complete your
                                        purchase securely.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Billing Address */}
                        <h3 className="text-[21px] font-semibold pb-2 leading-[25px] mt-6 mb-2">Billing address</h3>

                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-4 border border-green-600 bg-green-50 rounded-md cursor-pointer">
                                <input
                                    type="radio"
                                    checked={billing === "same"}
                                    onChange={() => setBilling("same")}
                                    className="accent-green-600"
                                />
                                <span className="text-[12px]">Same as shipping address</span>
                            </label>

                            <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer">
                                <input
                                    type="radio"
                                    checked={billing === "different"}
                                    onChange={() => setBilling("different")}
                                    className="accent-green-600"
                                />
                                <span className="text-[12px]">Use a different billing address</span>
                            </label>
                        </div>

                        {/* Pay Now Button */}
                        <button onClick={() => { handleSubmit()}} className="w-full mt-6 bg-black text-white py-4 rounded-lg font-semibold hover:opacity-90 transition">
                            Pay now
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="flex gap-4 justify-center mt-6 text-[12px] text-green-600 underline">
                        <a href="#">Refund policy</a>
                        <a href="#">Privacy policy</a>
                        <a href="#">Terms of service</a>
                    </div>
                </div>
                <div className='col-span-2 row-span-5 col-start-4 pl-6'>
                    <div className='sticky top-0'>
                        <div className="w-full max-w-md  bg-white rounded-xl  shadow-sm space-y-6">
                            {/* Product 1 */}
                            {cart.map((item, index) => (
                                <div className="flex gap-4" key={index}>
                                    <img src={item.image} className="relative w-14 h-14 rounded-lg bg-gray-100 border border-[#DFDFDF]" />
                                    <span className="absolute ml-10 -mt-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>


                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm ">{item.name}</h3>
                                            <p className="text-sm">₹{item.price * item.quantity}.00</p>
                                        </div>
                                        <p className="text-[10px] text-gray-500">76L X 48D X 38H CM</p>
                                        <p className="text-[10px] text-gray-500">Fabric Selected Separately</p>
                                    </div>

                                </div>
                            ))}
                            {/* Coupon */}
                            <div className="flex gap-2">
                                <input
                                    placeholder="Use FTWELCOME & Get a 10% Off your first order"
                                    className="flex-1 border border-[#DFDFDF] rounded-md px-3 py-2 text-sm"
                                />
                                <button className="border border-[#DFDFDF] rounded-md px-4 text-sm bg-gray-100">Apply</button>
                            </div>


                            {/* Price Summary */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal · {cart.length} items</span>
                                    <span>₹ {subTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    {state == "India" ? (
                                        <span className="text-gray-400">Free Shipping</span>
                                    ) : (
                                        <span className="text-gray-400">Enter shipping address</span>
                                    )}
                                </div>
                            </div>


                            <div className="flex justify-between text-lg font-semibold border-t pt-4">
                                <span>Total</span>
                                <span>₹ {subTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
