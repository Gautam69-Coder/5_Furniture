import { useQuickView } from '../../../context/PopupContext'
import { useState } from 'react'
import { motion, easeInOut } from 'motion/react'
import axios from 'axios'
import { API_BASE_URL } from '../../../api'

const Popup = () => {
  const { isOpenEdit, setisOpenEdit } = useQuickView();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    price: '',
    description: '',
    images: null,
    sizeCM: '',
    frameMaterial: 'ASSORTED'
  });


  const addProduct = async () => {
    const res = await axios.post(`${API_BASE_URL}/api/v1/addproduct`,{
      formData
    });
    console.log(res.data.data)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      console.log(data)

      await axios.post(`${API_BASE_URL}/api/v1/addproduct`,{formData} );

      setisOpenEdit(false);
      setFormData({
        name: '',
        subCategory: '',
        price: '',
        description: '',
        images: null,
        sizeCM: '',
        frameMaterial: 'ASSORTED'
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpenEdit) return null;

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50'>
      <motion.div
        className='flex flex-col max-w-[600px] rounded-2xl bg-white mx-auto relative w-full z-50 shadow-2xl'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: easeInOut }}
      >
        <div className='max-h-[85vh] overflow-y-scroll hide-scrollbar'>
          <div className='sticky top-0 bg-[#0f766e] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center z-10'>
            <h2 className='text-[22px] font-bold'>Add New Product</h2>
            <button
              onClick={() => setisOpenEdit(false)}
              className='text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-5'>
            <div className='flex flex-col items-center justify-center border-2 border-dashed border-cyan-300 rounded-xl p-6 bg-cyan-50/30 hover:bg-cyan-50/50 transition-all'>
              {imagePreview ? (
                <div className='relative'>
                  <img src={imagePreview} alt='Preview' className='w-40 h-40 object-cover rounded-lg shadow-md' />
                  <button
                    type='button'
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, images: null });
                    }}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className='cursor-pointer flex flex-col items-center'>
                  <svg className='w-12 h-12 text-cyan-400 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  <span className='text-sm text-gray-600 font-medium'>Upload Product Image</span>
                  <span className='text-xs text-gray-400 mt-1'>PNG, JPG up to 5MB</span>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                    required
                  />
                </label>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Product Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter product name'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Sub Category</label>
                <select
                  name='subCategory'
                  value={formData.subCategory}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                  required
                >
                  <option value=''>Select Sub Category</option>
                  <option value='Sofa'>Sofa</option>
                  <option value='Chair'>Chair</option>
                  <option value='Table'>Table</option>
                  <option value='Bed'>Bed</option>
                  <option value='Storage'>Storage</option>
                  <option value='Decor'>Decor</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Price (₹)</label>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='0.00'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Size (CM)</label>
                <input
                  type='text'
                  name='sizeCM'
                  value={formData.sizeCM}
                  onChange={handleChange}
                  placeholder='e.g., 76L X 48D X 38H'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Frame Material</label>
                <select
                  name='frameMaterial'
                  value={formData.frameMaterial}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                  required
                >
                  <option value='ASSORTED'>Assorted</option>
                  <option value='TEAK WOOD'>Teak Wood</option>
                  <option value='MANGOWOOD'>Mango Wood</option>
                  <option value='METAL'>Metal</option>
                  <option value='OTHER'>Other</option>
                </select>
              </div>

              <div className='col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Enter product description'
                  rows='4'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none'
                  required
                />
              </div>
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => setisOpenEdit(false)}
                className='flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-all'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-[#0f766e] text-white font-semibold py-2.5 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <svg className='animate-spin h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Popup;
