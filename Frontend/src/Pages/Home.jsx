import ProductCarousel from '../components/ProductCarsoul'
import ItemCarousel from '../components/ItemCarsoul'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Activity from '../components/Activity'
import { API_BASE_URL } from '../api'

const Home = () => {

  const [item, setitem] = useState([])
  const [recommended, setrecommended] = useState([])



  useEffect(() => {
    const recently_viewed = async () => {
      try {
        const token = localStorage.getItem("refreshToken");
        const res = await axios.get(`${API_BASE_URL}/api/v1/recently-view`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        setitem(res.data.data.map(item => item))
      } catch (error) {
        console.log(error)
      }
    }
    recently_viewed();
  }, [])

  useEffect(() => {
    const recommended = async () => {
      try {
        const token = localStorage.getItem("refreshToken");
        const res = await axios.get(`${API_BASE_URL}/api/v1/recommended`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials : true
        })
        setrecommended(res.data.data.map(item => item))

      } catch (error) {
        console.log(error)
      }
    }
    recommended();
  }, [])


  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}

      transition={{
        duration: 0.5,
        delay: 0.5,
      }}

    >
      <div className='sm:mb-10 mb-5'>
        <img className='w-full h-auto'
          loading="lazy"
          src="https://freedomtree.in/cdn/shop/files/NOV_START_25_c5440a48-26cb-4ec7-8c30-a5beba163d0d_1900x.jpg?v=1762593648" alt="" />
      </div>

      {/* Recently Viewed */}
      {item.length > 0 && (
        <div className='sm:mx-8 mx-2  mt-4'>
          <p className='font-semibold mb-3 sm:text-[20px] text-[16px]'>Recently Viewed</p>
          <div className=''>
            <Activity item={item} />
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className='sm:mx-8 mx-2  mt-4'>
          <p className='font-semibold mb-3 sm:text-[20px] text-[16px]'>Recommended</p>
          <div className=''>

            <Activity item={recommended} />
          </div>
        </div>
      )}

      {/* Template */}
      <div className='pt-10 pb-5 '>
        <div className='sm:mx-[60px] mx-5 '>
          <p className='text-[34px] font-semibold leading-[34px] mb-[15px]'>India`s Happiest Home Store</p>
          <p className='text-[17px] text-[#545454] font-normal leading-[27px] mb-[15px] text-justify'>
            The work of many heads, hearts, and hands, we're a creative Home Décor & Furnishings Store. We design with joy, no pretense, and dollops of relevance. Our collections marry form with functionality. Explore modern lifestyle furniture, upholstery & curtain fabrics, lighting & accessories, and unique ceramics & tableware for your home.
          </p>
        </div>
      </div>

      <div className=''>
        <img className='cursor-pointer w-full h-auto'
          loading="lazy"
          src="https://freedomtree.in/cdn/shop/files/NOV_START_25_2_93e17d64-9a63-4b5e-ae98-f2a0b0f0c185_1900x.jpg?v=1762593640" alt="" />
        <img className='cursor-pointer w-full h-auto'
          loading="lazy"
          src="https://freedomtree.in/cdn/shop/files/text_1_cb6ff8a7-a7e5-4fb4-ba14-415ff45ea003_1900x.jpg?v=1762593728" alt="" />
        <img className='cursor-pointer w-full h-auto'
          loading="lazy"
          src="https://freedomtree.in/cdn/shop/files/NOV_START_25_150f50a3-c885-4204-8250-196f213adf27_1900x.jpg?v=1762593696" alt="" />
      </div>

      <div>

        <img className='cursor-pointer'
          loading="lazy"
          src="https://freedomtree.in/cdn/shop/files/06ca43b5-aa7c-4618-a5fd-7f81d43f2824_1900x.jpg?v=1762593703" alt="" />

        <div className=''>
          <ProductCarousel />
        </div>

        <div className='mb-5 mt-5'>
          <ItemCarousel />
        </div>

        <div className=' mt-5'>
          <video className='h-auto'
            loading="lazy"
            src="https://cdn.shopify.com/videos/c/o/v/34085054d57a457dad184f722ddbc760.mp4" autoPlay loop muted></video>
        </div>

        <div className='mb-4'>
          <img className='h-auto w-full my-1'
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/60c88798-d8a8-41d2-a13e-d8e9a26a8a6f_1900x.jpg?v=1762593710" alt="" />
          <img className='h-auto w-full my-1'
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/furniture_banner_desktop_1900x.jpg?v=1762240841" alt="" />
        </div>

        <div className='w-full flex  gap-4 justify-center mb-4'>
          <div className='w-[32%]'>
            <img
              loading="lazy"
              src="https://freedomtree.in/cdn/shop/files/NOV_START_25_720x.jpg?v=1762168844" alt="" />
          </div>
          <div className='w-[32%]'>
            <img
              loading="lazy"
              src="https://freedomtree.in/cdn/shop/files/NOV_START_25_720x.jpg?v=1762168844" alt="" />
          </div>
          <div className='w-[32%]'>
            <img
              loading="lazy"
              src="https://freedomtree.in/cdn/shop/files/NOV_START_25_720x.jpg?v=1762168844" alt="" />
          </div>
        </div>

        <div className=' md:flex gap-4 items-center'>
          <div className=''>
            <img className='sm:w-[755px] sm:h-[755px] '
              loading="lazy"
              src="https://freedomtree.in/cdn/shop/files/NOV_START_25_720x.jpg?v=1762168844" alt="" />
          </div>
          <div className=''>
            <img className='sm:w-[755px] sm:h-[755px] '
              loading="lazy"
              src="https://freedomtree.in/cdn/shop/files/NOV_START_25_720x.jpg?v=1762168844" alt="" />
          </div>
        </div>

        <div className=' sm:flex w-full flex-col sm:flex-row  mt-4 justify-center gap-4 items-center'>

          <div className=''>
            <video
              loading="lazy" className=''
              src="https://cdn.shopify.com/videos/c/o/v/54d343b93935495a92c391642088275b.mp4" autoPlay loop muted></video>
          </div>
          <div className=''>
            <video
              loading="lazy"
              src="https://cdn.shopify.com/videos/c/o/v/54d343b93935495a92c391642088275b.mp4" autoPlay loop muted></video>
          </div>

        </div>

        <div className='my-5'>
          <img
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/02-_Small_Banner_File__2025_e3fc23b9-1dbe-4d84-945e-577588e7cc7c_1900x.jpg?v=1758280962" alt="" />
        </div>

        <div className='flex flex-wrap justify-center py-5'>
          <img height={335} width={335}
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/1_5853800e-db07-4cf2-80f6-dee743a32b93_480x.jpg?v=1742391105" alt="" />
          <img height={335} width={335}
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/1_5853800e-db07-4cf2-80f6-dee743a32b93_480x.jpg?v=1742391105" alt="" />
          <img height={335} width={335}
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/1_5853800e-db07-4cf2-80f6-dee743a32b93_480x.jpg?v=1742391105" alt="" />
          <img height={335} width={335}
            loading="lazy"
            src="https://freedomtree.in/cdn/shop/files/1_5853800e-db07-4cf2-80f6-dee743a32b93_480x.jpg?v=1742391105" alt="" />
        </div>
      </div>
    </motion.div>
  )
}

export default Home
