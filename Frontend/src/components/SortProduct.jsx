import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../api";
import { loader } from "../Utils/loarder";
import { useQuickView } from "../context/PopupContext";

const SortProduct = ({ ProductSubcategory }) => {
  const { category } = useParams();
  const hasRun = useRef(false);
  const { sort, setsort, filter, setfilter } = useQuickView();


  useEffect(() => {


    const userActivity = async (req, res) => {
      try {
        if (hasRun.current) return;
        hasRun.current = true;
        const token = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_BASE_URL}/api/v1/track`, {
          action: "category_visit",
          category: category
        },
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }

        );
      } catch (error) {
        console.log(error);
      }
    }

    userActivity();
  }, [category])

  const [myProduct, setMyProduct] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/v1/product`);
    return res.data.data;
  };

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categoryProducts = products.filter((item) =>
    item.category === category && item.subCategory.includes(filter)
  );


  useEffect(() => {
    const sub = ProductSubcategory?.map((item) => item.toLowerCase());

    const filtered = categoryProducts.filter((item) =>
      sub.includes(item.subCategory.toLowerCase())
    );

    setMyProduct(filtered);
  }, [ProductSubcategory]);


  const handleSelectedBox = (e) => {
    const sortName = e.target.value;
    let base = myProduct.length ? [...myProduct] : [...categoryProducts];

    switch (sortName) {
      case "Feature":
        base = base.filter((item) => item.tags?.includes("Feature"));
        break;

      case "Best Selling":
        base = base.filter((item) => item.tags?.includes("Best Selling"));
        break;

      case "Alphabetically, A–Z":
        base.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "Alphabetically, Z–A":
        base.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "Price, low to high":
        base.sort((a, b) => a.price - b.price);
        break;

      case "Price, high to low":
        base.sort((a, b) => b.price - a.price);
        break;

      default:
        base = categoryProducts;
    }

    setMyProduct(base);
  };

  const SortOptions = [
    "Sort",
    "Feature",
    "Best Selling",
    "Alphabetically, A–Z",
    "Alphabetically, Z–A",
    "Price, low to high",
    "Price, high to low",
  ];

  if (isLoading) return <div className="h-[30vh] flex justify-center items-center">{loader(60)}</div>;
  if (isError) return <p>Error loading products</p>;

  const finalProducts = myProduct.length ? myProduct : categoryProducts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="text-[18px] mb-[30px] flex justify-between">
        <div>{finalProducts.length} products</div>

        <div className="px-2 border rounded-[5px]">
          <select
            className="w-[13vw] outline-none py-1 cursor-pointer text-[15px]"
            onChange={handleSelectedBox}
          >
            {SortOptions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-[30px]">
        {finalProducts.map((item, index) => (

          <ProductCard
            key={index}
            img1={item.images?.[0]}
            img2={item.gallery?.[1]}
            price={item.price}
            name={item.name}
            item={item}
            link={`/collections/${category}/products/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
          />

        ))}
      </div>
    </motion.div>
  );
};

export default SortProduct;
