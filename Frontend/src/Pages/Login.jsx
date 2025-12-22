import React, { useState, useEffect } from 'react'
import { Input, message, Checkbox } from 'antd';
import { motion, easeInOut } from 'motion/react';
import { useQuickView } from '../context/PopupContext';

import validator from 'validator'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'


const Login = () => {
  const { closeLogin, isLoginOpen, openLogin } = useQuickView();
  const [headerText1, setheaderText1] = useState()
  const [headerText2, setheaderText2] = useState()
  const [button, setbutton] = useState()
  const [ResendOTP, setResendOTP] = useState()
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  //Input State
  const [text, settext] = useState("")
  const [OTPNumber, setOTPNumber] = useState()
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setemail] = useState("")

  //Content Switch
  const [isNumber, setisNumber] = useState(true)
  const [isOTP, setisOTP] = useState(false)
  const [isRegister, setisRegister] = useState(false)

  //Timer for OTP
  const [Timer, setTimer] = useState(5)
  const [StartTimer, setStartTimer] = useState(true)

  //All register input
  const [register, setregister] = useState()
  const [open, setopen] = useState(false);

  // Loaders
  const [loaders, setloaders] = useState(false)
  const [success, setsuccess] = useState(false)

  // OTP timer
  useEffect(() => {
    if (!isOTP || !StartTimer) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendOTP("Resend OTP");
          setStartTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOTP, StartTimer]);
  const startOTPTimer = () => {
    setTimer(5)
    setStartTimer(true)
    setResendOTP("")
  }


  // Phone Number validation
  const PhoneNumberValidate = () => {
    if (text.length !== 10) {
      messageApi.open({
        type: 'error',
        content: 'Please enter valid number',
      });
    } else {
      setisNumber(false);
      setisOTP(true);
      setisRegister(false)
    }
  }

  // OTP Number validation
  const OTPValidation = () => {
    if (OTPNumber.length !== 6) {
      messageApi.open({
        type: 'error',
        content: 'Please enter OTP valid number',
      });
    } else {
      setisNumber(false)
      setisOTP(false);
      setisRegister(true);
    }
  }

  // Register Number validation
  const RegisterValidation = () => {
    if (firstName.length < 3) {
      messageApi.open({
        type: 'error',
        content: 'Please Filled minimum 3 letter of name',
      });
    } else if (!validator.isEmail(email)) {
      messageApi.open({
        type: 'error',
        content: 'Please Enter valid Email Address',
      });
    } else {
      setregister({
        firstName,
        lastName,
        email,
        text,
      })
    }
  }

  


  //Register user 
  const DataSend = async () => {
    try {

      setloaders(true)
      setisRegister(false)

      const response = await axios.post(
        "/api/v1/user/register",
        {
          firstName,
          lastName,
          email,
          phoneNumber: text,
        },
        { withCredentials: true }
      );
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("email", response.data.data.user.email)
      setloaders(false);
      setsuccess(true);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message || "Something went wrong",
      });
      console.log(error)
    }
  }




  // From Handle
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isNumber) {

      //Phone Number Validation
      PhoneNumberValidate();

    } else if (isOTP) {

      //OTP validation
      OTPValidation();

    } else if (isRegister) {

      // Register validation and all input are store in one object
      RegisterValidation();

      //Data send to backend
      DataSend();

    } else {

    }
  }

  const formateTimer = Timer.toString().padStart(2, 0)


  // Handle header Text
  const handleHeaderText = () => {
    if (isNumber) {
      setheaderText1("Easy Secure Login via OTP")
      setheaderText2("Please login to join India's happiest creative community of home & lifestyle enthusiasts.")
      setbutton("Request OTP")
    } else if (isOTP) {
      setheaderText1("Enter OTP")
      setheaderText2(`The OTP sent on +91${text}`)
      setbutton("Verify OTP")
    } else if (isRegister) {
      setheaderText1("Enter Account Details")
      setheaderText2(`Enter below account Details`)
      setbutton("Update")
    } else {
      null
    }
  }

  useEffect(() => {
    handleHeaderText();
  }, [isNumber, isOTP, isRegister])

  const LoginPopUpClose = () => {
    localStorage.setItem("close", "close")
  }

  if (success) {
    LoginPopUpClose()
  }


  return (
    <div>

      {isLoginOpen ? (
        <div className='fixed inset-0 flex justify-center items-center bg-black/50 z-50'>
          <motion.div
            className='flex max-w-[900px] rounded-[15px] mx-auto p-5 relative w-full z-50'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: easeInOut }}
            onMouseOver={() => {
              const close = localStorage.getItem("close");
              if (close === "close") {
                setTimeout(() => {
                  // setIslogin(false)
                }, 500);
              }
              localStorage.removeItem("close");
            }}
          >

            <button
              onClick={() => {
                // setIsLogin(!isLogin)
                closeLogin();
              }}

              className='absolute -top-6 sm:-right-5 right-2 text-2xl p-2 w-10 h-10
          flex justify-center items-center bg-transparent rounded-md hover:bg-black transition-all ease-in-out'
            >
              <img src="../src/assets/Icons/close.svg" alt="close svg" />
            </button>

            <div className='sm:flex sm:h-[536px]  w-full'>
              {/* Left Image Section */}
              {contextHolder}
              <div className='sm:w-[55%]'>
                <img
                  src="https://cdn.shopify.com/s/files/1/0258/1394/2371/files/simply-otp-login-modal-mobile.jpg?v=1726567216&t=1726567222693"
                  alt="Banner"
                  className=' rounded-l-2xl rounded-r-2xl sm:h-full h-[200px] w-full object-cover'
                />
              </div>

              {/* Right Login Section */}
              <div className='p-5 sm:mx-auto flex flex-col items-center sm:w-[45%] sm:rounded-r-2xl rounded-r bg-white rounded-l'>

                <div>
                  <img
                    src="../src/assets/Icons/freedomtree.avif"
                    alt="Freedom Tree Logo"
                    
                    className='pt-4 sm:mb-[30px] mb-5 w-[150px]'
                  />
                </div>

                {(isNumber || isOTP || isRegister) ? (
                  <div className='flex flex-col items-center'>
                    <div className='text-[20px] font-semibold leading-5 mb-0'>{headerText1}</div>
                    <div className="text-[14px] font-normal leading-[21px] mb-[30px] text-center">
                      {headerText2}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <div className='text-[20px] font-semibold leading-[30px] mb-0'>Welcome</div>
                    <div className="text-[14px] font-normal leading-[21px] mb-[30px] text-center">
                      Welcome to our Website
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center'>

                  {isNumber ? (
                    <div className='w-full'>
                      <div className='text-[14px] leading-[18px] font-semibold mb-[5px]'>Phone</div>
                      <div className='border h-[42px] flex items-center rounded-[5px] border-[#c7c7c7] '>

                        <div className='border-r w-20 h-[42px] border-[#c7c7c7] flex justify-center items-center focus:outline-none'>
                          <select
                            className='focus:outline-none bg-transparent text-[14px]'
                            defaultValue="+91"
                          >
                            <option value="+91">IN +91</option>
                          </select>
                        </div>

                        <div>
                          <input
                            className='pl-2 h-[42px] focus:outline-none w-full'
                            type="text"
                            placeholder='Mobile Number'
                            value={text}
                            maxLength={10}
                            autoComplete='tel-number'
                            onChange={(e) => settext(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (isOTP) ? (
                    <>
                      <div className='text-[14px] leading-[18px] font-semibold mb-0.5'>OTP</div>
                      <div className='flex items-center justify-center rounded-[5px]'>
                        <div>
                          <Input.OTP formatter={str => str.toUpperCase()}
                            onChange={(value) => {
                              setOTPNumber(value)
                            }}

                            style={{
                              height: '60px',
                              gap: '16px',
                            }}
                          />
                        </div>
                      </div>
                      <div className='flex rounded-[5px] gap-2 justify-center items-center mb-1'>
                        <span className='bg-[#009900] flex justify-center items-center text-[12px] rounded-[5px] text-white p-1 w-6'>
                          00
                        </span>
                        <span className='bg-[#009900] flex justify-center items-center text-[12px] rounded-[5px] text-white p-1 w-6'>
                          {formateTimer}
                        </span>
                      </div>

                      <div className={`flex justify-center items-center text-[16px] 
              ${ResendOTP ? (
                          "text-green-700 underline cursor-pointer"
                        ) : (
                          "text-[#c7c7c7]"
                        )}`
                      }>
                        <p>{ResendOTP || `Resend OTP in 5`}</p>
                      </div>

                    </>

                  ) : (isRegister) ? (
                    <>
                      <div className='flex w-full justify-between mb-2'>
                        <div className='w-[48%]'>
                          <div className='text-[14px] leading-[18px] font-semibold mb-[5px]'>First Name</div>
                          <div >
                            <div className='border h-[42px] flex items-center rounded-[5px]  border-[#c7c7c7]'>
                              <input type="text" className='pl-2 h-[42px] w-[95%] focus:outline-none placeholder:text-[14px] '
                                placeholder='Enter your First Name'
                                value={firstName}
                                name='fisrtName'
                                autoComplete='fname'
                                onChange={(e) => {
                                  setfirstName(e.target.value)
                                }} />
                            </div>
                          </div>
                        </div>
                        <div className='w-[48%]'>
                          <div className='text-[14px] leading-[18px] font-semibold mb-[5px]'>Last Name</div>
                          <div >
                            <div className='border h-[42px] flex items-center rounded-[5px]  border-[#c7c7c7]'>
                              <input type="text" className='pl-2 w-[95%] h-[42px] focus:outline-none placeholder:text-[14px] '
                                placeholder='Enter your Last Name'
                                value={lastName}
                                name='lastName'
                                autoComplete='lname'
                                onChange={(e) => {
                                  setlastName(e.target.value)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='w-full mb-2'>
                        <div className='text-[14px] leading-[18px] font-semibold mb-[5px]'>Email</div>
                        <div >
                          <div className='border h-[42px] flex items-center rounded-[5px]  border-[#c7c7c7]'>
                            <input type="text" className='pl-2 w-[95%] h-[42px] focus:outline-none placeholder:text-[14px] '
                              placeholder='Enter your Email id'
                              value={email}
                              name='email'
                              autoComplete='email'
                              onChange={(e) => {
                                setemail(e.target.value)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='w-full mb-2'>
                        <div className='text-[14px] leading-[18px] font-semibold mb-[5px]'>Phone</div>
                        <div >
                          <div className='border h-[42px] flex items-center rounded-[5px]  border-[#c7c7c7]'>
                            <input type="text" className='pl-2 w-[95%] h-[42px] focus:outline-none placeholder:text-[14px] '
                              placeholder='Enter your Phone Number'
                              value={text}
                              name='Mobile Number'
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (loaders) ? (
                    <div>
                      <TailChase
                        size="40"
                        speed="1.75"
                        color="black"
                      />
                    </div>
                  ) : (success) ? (
                    <div>
                      Congratulation your accout create Successfully
                    </div>
                  ) : (
                    null
                  )
                  }

                  {(!success && !loaders) ? (
                    <button className='text-white text-[14px] leading-7 font-medium p-[7px]
            bg-[#009900] flex justify-center items-center rounded-[5px] mt-2
             hover:bg-[#229f22] hover:scale-99 transition-all w-full'
                      type='submit'
                      onClick={() => {
                        if (ResendOTP) {
                          startOTPTimer();
                        }
                      }}
                    >
                      {button}
                    </button>
                  ) : (
                    null
                  )}
                </form>

                {(!success && !loaders) ? (
                  <div>
                    {isOTP ? (
                      <>
                        <div className='flex justify-center items-center sm:w-[70%] w-full font-normal leading-[21px]'>
                          <p className='text-center text-[12px] text-[#C7C7C7] relative top-18'>I accept that I have read & understood Privacy Policy and T&Cs.</p>
                        </div>
                      </>
                    ) : (isRegister == false) ? (
                      <>
                        <p className='mb-[15px] mt-[15px] flex justify-center gap-3 items-center'>
                          <span className='w-[60px] border h-0.5 border-[#C7C7C7]'></span>
                          <span className='text-[#C7C7C7]'>Or Login Using</span>
                          <span className='w-[60px] border h-0.5 border-[#C7C7C7]'></span>
                        </p>

                        <div className='border rounded-[5px] py-[7px] px-5 flex justify-center items-center gap-2'>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0859 2.90629C15.2061 1.03307 12.7059 0.000950389 10.042 0C4.55283 0 0.08547 4.44545 0.08356 9.90971C0.082605 11.6565 0.54147 13.3615 1.41288 14.8641L0 20L5.27909 18.6219C6.7335 19.4117 8.37128 19.8275 10.0377 19.828H10.042C15.5302 19.828 19.9981 15.382 20 9.91779C20.0009 7.26956 18.9662 4.77999 17.0859 2.90677V2.90629ZM10.042 18.1543H10.0387C8.55367 18.1539 7.09689 17.7566 5.82583 17.0063L5.52357 16.8276L2.39078 17.6454L3.22686 14.6056L3.03013 14.2938C2.20169 12.9823 1.76383 11.4664 1.76479 9.91021C1.7667 5.36875 5.47963 1.67364 10.0454 1.67364C12.2561 1.67459 14.3342 2.53232 15.8969 4.08953C17.4598 5.64627 18.3197 7.71624 18.3188 9.91685C18.3168 14.4588 14.6039 18.1539 10.042 18.1539V18.1543ZM14.5819 11.9854C14.3332 11.8614 13.1099 11.2626 12.8816 11.1799C12.6534 11.0972 12.4877 11.0559 12.322 11.3039C12.1563 11.552 11.6793 12.1099 11.5342 12.2748C11.389 12.4401 11.2438 12.4606 10.9951 12.3365C10.7463 12.2125 9.94461 11.9511 8.99395 11.1077C8.25433 10.4509 7.75483 9.64029 7.60972 9.39221C7.46456 9.14418 7.59444 9.01016 7.71856 8.88709C7.83028 8.7759 7.96733 8.59771 8.09194 8.45324C8.21661 8.30877 8.25767 8.20521 8.34072 8.04028C8.42383 7.87492 8.38228 7.7305 8.32022 7.60643C8.25811 7.48242 7.76061 6.26352 7.55289 5.76791C7.35089 5.28512 7.14561 5.3507 6.99328 5.34262C6.84811 5.33549 6.68244 5.33407 6.51628 5.33407C6.35011 5.33407 6.08078 5.39584 5.85256 5.6439C5.62433 5.89192 4.98162 6.49114 4.98162 7.70954C4.98162 8.92795 5.87311 10.106 5.99772 10.2714C6.12233 10.4367 7.75244 12.9377 10.2483 14.0107C10.8418 14.2658 11.3054 14.4184 11.6669 14.5324C12.2628 14.7211 12.8052 14.6945 13.234 14.6308C13.712 14.5595 14.7061 14.0316 14.9133 13.4532C15.1206 12.8749 15.1206 12.3788 15.0585 12.2757C14.9964 12.1726 14.8303 12.1103 14.5815 11.9863L14.5819 11.9854Z" fill="#111B21"></path>
                          </svg>
                          <p className='text-[14px] font-semibold leading-[26px] text-[#111b21]'>WhatsApp</p>
                        </div>

                        <div className='flex justify-center items-center sm:w-[70%] font-normal leading-[21px]'>
                          <p className='text-center text-[12px] text-[#C7C7C7] relative sm:top-18 top-2'>I accept that I have read & understood Privacy Policy and T&Cs.</p>
                        </div>
                      </>
                    ) : (
                      <div className='flex gap-2 mt-2 justify-start items-start relative right-6'>
                        <Checkbox  >
                        </Checkbox>
                        <div className='flex flex-col justufy-start items-start'>
                          <div className=''>
                            KEEP ME UPDATED ON NEW UPDATES,
                          </div>
                          <div>
                            EXCLUSIVE OFFERS
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  null
                )}
              </div >
            </div >

          </motion.div>
        </div>
      ) : (
        null
      )}
    </div>
  )
}

export default Login
