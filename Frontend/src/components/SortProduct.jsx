import  { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const SortProduct = ({ ProductSubcategory }) => {
  const { category } = useParams();

  const [myProduct, setMyProduct] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get("/api/v1/product");
    return res.data.data;
  };

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categoryProducts = products.filter((item) =>
    item.category.includes(category)
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

  if (isLoading) return <p>Loading...</p>;
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
