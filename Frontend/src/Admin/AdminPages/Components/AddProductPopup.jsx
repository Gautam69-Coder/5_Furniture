import { useQuickView } from '../../../context/PopupContext'
import { useState } from 'react'
import { motion, easeInOut } from 'motion/react'


const Popup = () => {

  const { isOpenEdit, setisOpenEdit } = useQuickView();

  if (!isOpenEdit) return null;
  return (
    <div className='fixed inset-0 flex justify-center items-center  bg-white/30  z-50'>
      <motion.div
        className='flex flex-col max-w-[50vw] rounded-2xl   bg-white mx-auto  relative w-full z-50 '
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeInOut }}
      >
        <div className='h-[70vh] p-8'>
          <p className='absolute  right-3.75 top-2.5 cursor-pointer' onClick={() => {
            setisOpenEdit(false);
          }}>x</p>

          <div className=' h-full space-y-3'>
            <p className='text-[20px] font-semibold text-cyan-400'>Add Product</p>

            <div className='flex items-center justify-center'>
              <input type="file" className='border rounded-2xl justify-center items-center w-30 h-30' />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default Popup
