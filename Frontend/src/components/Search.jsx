import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuickView } from "../context/PopupContext";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";


const Search = () => {
    const { isSearch, setisSearch } = useQuickView();
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/product`);
                setProducts(res.data?.data || []);
                setFiltered(res.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (!search) {
            setFiltered(products);
            return;
        }

        const searchText = search.toLowerCase();

        const filteredData = products.filter((item) => {
            const name = (item.name || "").toLowerCase();
            const category = (item.category || "").toLowerCase();

            return name.includes(searchText) || category.includes(searchText);
        });

        setFiltered(filteredData);
    }, [search, products]);

    useEffect(() => {
        if (isSearch) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isSearch]);

    if (!isSearch) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-white h-[70vh] "
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}

        >
            <div className="m-4 h-[70vh] flex flex-col">

                <div className="flex items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search our store..."
                        value={search}
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border px-4 py-2 text-[16px] outline-none"
                    />

                    <X
                        className="cursor-pointer"
                        onClick={() => setisSearch(false)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1">
                    {filtered.length === 0 && (
                        <p className="text-center text-gray-500 mt-10">
                            No products found
                        </p>
                    )}

                    {filtered.map((product) => (
                        <div
                            key={product._id}
                            className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => {
                                navigate(
                                    `/collections/${product.category}/products/${product.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                );
                                setisSearch(false);
                            }}
                        >
                            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                <img
                                    src={product.images}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col justify-between flex-1">
                                <div>
                                    <div className="fle`${API_BASE_URL} justify-betwee`">
                                        <h3 className="text-[16px] font-semibold text-gray-800 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <h3 className="text-[16px] font-semibold text-gray-400 line-clamp-1">
                                            {product.category.charAt(0).toUpperCase()+ product.category.slice(1).toLowerCase()}
                                        </h3>

                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Material:
                                        <span className="text-gray-700 ml-1">
                                            {product.material}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Size:
                                        <span className="text-gray-700 ml-1">
                                            {product.details?.sizeIN || "—"}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[16px] font-bold text-gray-900">
                                        ₹{product.price}
                                    </span>

                                    <button className="px-4 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Search;
