import { useRef, useState } from "react";
import ProductCard from "./ProductCard";

const Activity = ({ item = [] }) => {
    const scrollRef = useRef(null);
    const [isHover, setIsHover] = useState(false);

    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div
            className="relative w-full h-full  "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {/* LEFT BUTTON */}
            <button
                onClick={() => scroll("left")}
                className={`absolute left top-1/2 text-[25px] sm:block hidden -translate-y-1/2 ml-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center  transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
            >
                {`<`}
            </button>

            {/* SCROLL AREA */}
            <div
                ref={scrollRef}
                className="flex gap-3 px-3 sm:overflow-x-hidden sm:no-scrollbar hide-scrollbar overflow-x-scroll scroll-smooth"
            >
                {item.map((product) => (
                    <div key={product._id} className="shrink-0 sm:w-[250px] w-[150px] ">
                        <ProductCard
                            item={product}
                            link={`/collections/${product.category}/products/${product.name
                                ?.toLowerCase()
                                .replace(/\s+/g, "-")}`}
                        />
                    </div>
                ))}
            </div>

            {/* RIGHT BUTTON */}
            <button
                onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 text-[25px] sm:block hidden  -translate-y-1/2 mr-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
            >
                {`>`}
            </button>
        </div>
    );
};

export default Activity;
