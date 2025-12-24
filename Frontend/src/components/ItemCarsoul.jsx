import { useRef, useState } from 'react';

const ItemCarousel = () => {
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
    { id: 1, name: 'T-Shirt', price: '$20', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
    { id: 2, name: 'Jeans', price: '$40', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
    { id: 3, name: 'Hoodie', price: '$30', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
    { id: 4, name: 'Sneakers', price: '$60', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
    { id: 5, name: 'Sneakers', price: '$60', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
    { id: 6, name: 'Sneakers', price: '$60', img: 'https://freedomtree.in/cdn/shop/files/1_2b7705a4-8ffb-4df4-92bb-be0c692c5be1_480x.jpg?v=1753445119' },
  ];

  return (
    <div className=" relative  sm:mx-[60px] mx-5"
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
        className={`absolute sm:left -left-8 top-1/2 text-[25px] -translate-y-1/2 ml-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center  transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
      >
        {`<`}
      </button>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scroll-smooth no-scrollbar cursor-pointer gap-3"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="sm:h-[58.53px] h-[30px] w-[130px]  sm:w-[246.54px] shrink-0 bg-white shadow-md overflow-hidden"

          >
            <img
              src={product.img}
              loading='lazy'
              alt={product.name}
              className=" w-full object-cover"
            />
            
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll('right')}
        className={`absolute sm:right -right-8 top-1/2 text-[25px] -translate-y-1/2 mr-5 z-10 bg-[#e9c1bd] px-1 py-1 shadow  w-8 text-center transition-all duration-300 ease-in-out
          ${isHover ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-75"}
          `}
      >
        {`>`}
      </button>
    </div>
  );
};

export default ItemCarousel;
