import Trash from "../assets/Icons/trash.svg"
import Whatsapp from "../assets/Icons/whatsapp.png"
import CheckoutBanner from "../assets/Icons/checkoutBanner.png"
import Cart2 from "../assets/Icons/cart2.svg"

const Cart = ({ cart, subTotal, deleteItem, setdeleteProduct, deleteProduct, closeCart, navigate }) => {
    return (
        <div>
            <div>
                {(cart.length === 0 || !localStorage.getItem("refreshToken")) ? (
                    <div className='flex flex-col mt-40 justify-center items-center'>
                        <div className='my-2'>
                            <img src={Cart2} alt="" className='w-[82px] h-[70px]' />
                        </div>

                        <p className='font-medium text-[18px] text-center my-2'>Your cart looks deserted currently. Start shopping our originally designed and handmade products.</p>

                        <button className='px-6 py-3 font-bold text-[15px] leading-3 uppercase bg-[#333333] text-white'>Start Shopping</button>
                    </div>
                ) : (
                    <>
                        <div className='overflow-y-scroll hide-scrollbar h-[54vh]'>
                            {cart.map((item, index) => (

                                <div>
                                    <div className='flex mb-2 ' key={index}>
                                        <div className='w-[25%] mr-2'>
                                            <img src={item.image} alt="" className=' rounded w-full' />
                                        </div>
                                        <div className='flex flex-col justify-between w-full'>
                                            <div className='w-full'>
                                                <div className='flex justify-between items-center'>
                                                    <div className='mb-2 text-[12px] '>{item.name}</div>
                                                    <div className='cursor-pointer' onClick={() => { deleteItem(item.productId); setdeleteProduct(!deleteProduct) }}>
                                                        <img src={Trash} alt="" />
                                                    </div>
                                                </div>
                                                <div className='text-[10px] text-[#8f8e8e]'>{item.size}</div>
                                                <div className='text-[10px] text-[#8f8e8e]'>{item.materail}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className=' flex w-fit text-[12px] justify-center items-center '>
                                                    <p>Quantity : {item.quantity}</p>
                                                </div>
                                                <div className='text-[15px]'>RS. {item.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <p className='text-[10px] text-[#626161] mb-1'>Add your orderd note</p>
                                <input className='w-full h-8 border border-[#8f8e8e] p-2 '>
                                </input>
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            <div className='fixed bg-white bottom-0 '>
                                <div className='mb-2'>
                                    <img src={CheckoutBanner} alt="" />
                                </div>
                                <div className='border-t border-b p-2 text-center my-2  border-[#9c9c9c]'>
                                    <div className='flex justify-center items-center gap-1'>
                                        <img src={Whatsapp} alt="" width={18} />
                                        <p className='text-[12px]'>Need help ? </p>
                                    </div>
                                </div>

                                <div className='my-2 font-normal text-[24px] text-black flex justify-between items-center px-2'>
                                    <p className='font-normal text-[24px] text-black'>SubTotal</p>
                                    <p className='font-normal text-[18px] text-black '>Rs .{subTotal}</p>
                                </div>

                                <div className='my-2 w-full px-2' onClick={() => { navigate(`/checkout`); closeCart(); }}>
                                    <button className='bg-[#09AE62] flex items-center justify-center gap-2 py-1.5  text-[18px] text-white w-full font-medium text-center uppercase'>
                                        Checkbox
                                        <img src="../src/assets/Icons/upi_options.svg" alt="" />
                                    </button>
                                </div>

                                <div className='my-2'>
                                    <p className='text-[10px] text-[#585858] font-normal text-center'>Shipping, taxes, and discounts codes calculated at checkout.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Cart
