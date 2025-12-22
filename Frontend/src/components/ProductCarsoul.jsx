import { useRef, useState } from 'react';

const ProductCarousel = () => {
  const scrollRef = useRef(null);
  const [isHover, setisHover] = useState()

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const products = [
    { id: 1, name: 'T-Shirt', price: '$20', img: 'https://freedomtree.in/cdn/shop/files/NOV_START_25_b0b04c15-0029-4038-a84e-3ed70bf55616_480x.jpg?v=1762593678' },
    { id: 2, name: 'Jeans', price: '$40', img: 'https://freedomtree.in/cdn/shop/files/NOV_START_25_b0b04c15-0029-4038-a84e-3ed70bf55616_480x.jpg?v=1762593678' },
    { id: 3, name: 'Hoodie', price: '$30', img: 'https://freedomtree.in/cdn/shop/files/NOV_START_25_b0b04c15-0029-4038-a84e-3ed70bf55616_480x.jpg?v=1762593678' },
    { id: 4, name: 'Sneakers', price: '$60', img: 'https://freedomtree.in/cdn/shop/files/NOV_START_25_b0b04c15-0029-4038-a84e-3ed70bf55616_480x.jpg?v=1762593678' },
    { id: 5, name: 'Sneakers', price: '$60', img: 'https://freedomtree.in/cdn/shop/files/NOV_START_25_b0b04c15-0029-4038-a84e-3ed70bf55616_480x.jpg?v=1762593678' },
  ];

  return (
    <div className=" relative  sm:mx-[60px] "
      onMouseEnter={() => {
        setisHover(true)
      }}
      onMouseLeave={() => {
        setisHover(false)
      }}
    >
      {/* Left Button */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left top-1/2 text-[25px] -translate-y-1/2 ml-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center  transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
      >
        {`<`}
      </button>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex sm:mx-4 mx-2 overflow-x-hidden scroll-smooth no-scrollbar cursor-pointer gap-3"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="md:h-auto   md:w-[303.556px] w-fit shrink-0 bg-white shadow-md overflow-hidden"

          >
            <img
              src={product.img}
              loading='lazy'
              alt={product.name}
              className=" sm:w-full w-[130px]  object-cover"
            />
            
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 text-[25px] -translate-y-1/2 mr-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
      >
        {`>`}
      </button>
    </div>
  );
};

export default ProductCarousel;
