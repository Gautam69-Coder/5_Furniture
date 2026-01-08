import { Link } from 'react-router-dom';
import { useQuickView } from "../context/PopupContext";
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { loader } from '../Utils/loarder';
import { useState } from 'react';

const ProductCard = ({ link, item }) => {
    const { openQuickView, openCart } = useQuickView();
    const [loading, setloading] = useState(false)

    // console.log(item)

    // Send Add to cart pro to
    const cartData = async () => {
        try {
            const token = localStorage.getItem("refreshToken");
            setloading(true)
            console.log(item)
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/cart`,
                {
                    productId: item._id,
                    name: item.name,
                    image: item.images[0],
                    price: item.price,
                    quantity:  1,
                    size: item.details.sizeIN,
                    materail: item.details.frameMaterial,
                    description: item.description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data.data)
            let user = res.data.data.user
            if (user) {
                await openCart();
                setloading(false)
            }
        } catch (error) {
            console.log("Error in cart", error.response?.data || error.message);
        }
    };

    return (
        <div className="cursor-pointer relative">
            <div className="relative group">
                <Link to={link}>
                    <img src={item.images?.[0]} className="transition-all duration-300 group-hover:opacity-0 w-full" />
                    <img src={item.gallery?.[1]} className="transition-all duration-300 absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100" />
                </Link>

                <div className="absolute bottom-[5px] w-full opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex justify-around">

                        <div
                            className="px-3 py-2 text-white text-[12px] sm:text-[18px] bg-green-500 hover:bg-black"
                            onClick={() => {
                                openQuickView(item)
                            }}
                        >
                            Quick View
                        </div>

                        <button className={`px-3 py-2 text-white bg-black `}
                            onClick={() => {
                                cartData();
                                openCart();
                                setloading(!loading);
                            }}
                            disabled={loading}
                        >{loading ? (loader(14, "white")) : ("Add to Cart")}</button>
                    </div>
                </div>
            </div>

            <div className="text-center sm:mt-2 sm:pt-2.5 sm:pb-2">
                <p>{item.name}</p>
                <p className="italic text-[13px] pt-1">RS {item.price}</p>
            </div>
        </div>
    );
};

export default ProductCard
