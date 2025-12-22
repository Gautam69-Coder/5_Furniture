import { collectionsData } from '../Collections/data';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import downArrow from "../assets/basicIcons/downarrow.svg";
import '../App.css';
import axios from 'axios';

const Practice = ({ onFilterChange }) => {
    const { category } = useParams();
    const [subCategory, setsubCategory] = useState()
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isMaterialOpen, setIsMaterialOpen] = useState(false);
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [okcategory, setcategory] = useState([]);
    const [ProductData, setProductData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("/api/v1/product");
            setProductData(res.data.data);
        };
        fetchData();
    }, []);

    const data = collectionsData;

    const st = ProductData.filter((item) => item.category.includes(category));

    const myitems = {
        CATEGORY: data[category][0].category.map(item => item),
        PRODUCT: data[category][1].products.map(item => item.collection),
        COLOR: [data[category][2].color.map(item => item)],
        STYLE: st.map(item => item.style),
        COLLECTION: st.map(item => item.collection),
        MATERIAL: st.map(item => item.material),
        SIZE: st.map(item => item.size),
        PRICE: st.map(item => item.price)
    };

    useEffect(() => {
        const mycategories = data[category][0].category;
        setsubCategory(mycategories.map((item) => item));
    }, []);

    const toggleCategory = (e) => {
        if (okcategory.includes(e.target.value)) {
            setcategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setcategory(prev => [...prev, e.target.value]);
        }
    };

    useEffect(() => {
        onFilterChange(okcategory);
    }, [okcategory]);

    return (
        <div className="sm:sticky top-0  ">
            {/* Filter */}
            <div className='my-2.5'>
                <div className='flex gap-1 text-[13.45px] text-left'>
                    <p className='text-[#0db269] '>Home</p>
                    <p className='text-[#e8e8e1]'>/</p>
                    <p className='text-[#0db269] '> Furniture</p>
                </div>

                <div>
                    <div className='py-4 tracking-[0.2em] text-[0.8em] font-light'>
                        <h1 className='uppercase'>Filters</h1>
                    </div>
                </div>
            </div>
            <div className="w-[220px] border-t border-r h-full overflow-y-scroll custom-scroll">

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Category</span>
                        <span>{isCategoryOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isCategoryOpen &&
                    myitems.CATEGORY.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input
                                type="checkbox"
                                className="mx-2 h-4 w-4"
                                value={item}
                                onClick={toggleCategory}
                            /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsProductOpen(!isProductOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Product</span>
                        <span>{isProductOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isProductOpen &&
                    myitems.PRODUCT.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsColorOpen(!isColorOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Color</span>
                        <span>{isColorOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isColorOpen &&
                    myitems.COLOR[0].map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsStyleOpen(!isStyleOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Style</span>
                        <span>{isStyleOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isStyleOpen &&
                    myitems.STYLE.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Collection</span>
                        <span>{isCollectionOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isCollectionOpen &&
                    myitems.COLLECTION.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsMaterialOpen(!isMaterialOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Material</span>
                        <span>{isMaterialOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isMaterialOpen &&
                    myitems.MATERIAL.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsSizeOpen(!isSizeOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Size</span>
                        <span>{isSizeOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isSizeOpen &&
                    myitems.SIZE.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

                <div className="border-t-2 border-[#e8e8e1] py-[18px]">
                    <button
                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                        className="w-full px-2 flex justify-between items-center"
                    >
                        <span>Price</span>
                        <span>{isPriceOpen ? <img src={downArrow} className="h-2 w-2" /> : ">"}</span>
                    </button>
                </div>

                {isPriceOpen &&
                    myitems.PRICE.map((item, index) => (
                        <div key={index} className="pt-2 bg-white flex items-center">
                            <input type="checkbox" className="mx-2 h-4 w-4" value={item} onClick={toggleCategory} /> {item}
                        </div>
                    ))
                }

            </div>
        </div>
    );
};

export default Practice;
