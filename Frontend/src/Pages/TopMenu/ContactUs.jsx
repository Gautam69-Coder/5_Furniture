import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../../api"

const Contact = () => {

  const [phone, setPhone] = useState("");
  const [name, setname] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const sendMessage = async () => {
    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/v1/send`, {
        phone: phone, // 91XXXXXXXXXX
        message: message,
      });

      alert("WhatsApp message sent ✅");
      setMessage("");
    } catch (error) {
      alert("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='mb-[45px]'>
        <nav className='py-5 px-10 m-2 size-14.45 flex gap-1'>
          <a className='text-green-400 bg-transparent text-left cursor-pointer' href="/">Home</a>
          <span className='text-gray-300'>/</span>
        </nav>
        <div className=' px-50 font-bold text-4xl mb-15'>
          <h1 className=' font-semibold h-1'>Contact us</h1>
        </div>
        <div className='text-center px-6 max-w-md mx-auto'>
          <p className='tracking-[2px] font-semibold text-3xl'>Contect Information</p>
          <p className='font-bold py-2'>CORPORATE OFFICE</p>
          <p>
            Block 31, Laxmi Woolen Mill Compound,
            <br />
            Shakti Mill Lane, Off E.Moses Road,
            <br />
            Mahalaxmi(W),
            <br />
            Mumbai 400011, India.
          </p>
        </div>
        <div className='flex justify-center p-10 '>
          <button className='bg-black m-4 py-2 px-8 text-white uppercase flex justify-center gap-5'>
            <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M27.2,18.3c-3-3-6.5-3.4-9-0.8c0,0,0,0,0,0c-0.3,0.3-0.6,0.6-0.8,1c-1.4-1.2-2.6-2.5-3.8-3.8c0.4-0.3,0.7-0.5,1-0.8 c2.5-2.5,2.2-6-0.8-9c-3-3-6.5-3.4-9-0.8c-2.7,2.7-3.1,7.4-1,10.6c3.5,5.2,8.6,10.4,13.8,13.8c1.4,0.9,3,1.3,4.6,1.3 c2.2,0,4.4-0.8,5.9-2.3C30.6,24.8,30.3,21.3,27.2,18.3z"></path> </g></svg>
            <span>call us</span>
          </button>
          <button className='bg-black text-white m-4 py-2 px-8  uppercase flex justify-center gap-5 '>
            <svg className='w-5' fill="#f7f7f7" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.667 30.667" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017 c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382 c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076 c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427 c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437 c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536 c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609 c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611 c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787 c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739 C23.307,19.268,23.307,18.533,23.214,18.38z"></path> </g> </g>
            </svg>
            <span> whatsapp</span>
          </button>
          <button className='bg-black text-white m-4 py-2 px-10 uppercase flex justify-center gap-5 '>
            <svg className='w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#ffffff"></path> </g>
            </svg>
            <span>email us</span>
          </button>
        </div>
        <div className='mx-60'>
          <div className='flex justify-between w-full gap-4 '>
            <div className='w-full'>
              <label className='block cursor-pointer uppercase tracking-[.2em] text-[.8em] ' For="user">name</label>
              <input className='border border-black  bg-white py-2 pl-3  p-2.5 w-full ' type="text" name='user'
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
              />
            </div>
            <div className='w-full'>
              <label className='block cursor-pointer uppercase tracking-[.2em] text-[.8em] ' For="email">Phone</label>
              <input className='border border-black  bg-white py-2 pl-3 w-full ' type="text" name='phone'
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>
          </div>
          <div className=' pt-10 mb-[30px]'>
            <div>
              <label className='block cursor-pointer uppercase tracking-[.2em] text-[.8em]' for="Contact">Message</label>
              <textarea className='border border-black w-full min-h-[100px] pl-3 pt-2 ' rows="5" id="Contact" name="contact[body]"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <button className='bg-black text-white py-2 px-4 uppercase' onClick={()=>{
            console.log(name)
            console.log(phone)
            console.log(message)
            sendMessage()
          }}>send</button>
        </div>
      </div>
    </>
  )
}

export default Contact