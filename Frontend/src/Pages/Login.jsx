import React, { useState, useEffect } from 'react'
import { Input, message, Checkbox } from 'antd';
import { motion, easeInOut } from 'motion/react';
import { useQuickView } from '../context/PopupContext';

import validator from 'validator'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { API_BASE_URL } from '../api';


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


  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });


  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();

      const res = await axios.post(`${API_BASE_URL}/api/v1/google`, { token: firebaseToken }, { withCredentials: true });

      localStorage.setItem("refreshToken", res.data.data)
      await messageApi.open({
        type: 'success',
        content: 'Signup successFully',
      });

      closeLogin();

      window.location.reload();

      console.log("Login success, JWT cookie set by backend");
    } catch (error) {
      if (error.response) console.error("Backend error:", error.response.data);
      else console.error("Popup closed or blocked:", error);
    }
  };


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
        `${API_BASE_URL}/api/v1/user/register`,
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
              <img src="https://res.cloudinary.com/gautamcloudinary/image/upload/v1766924530/close_vb6fdm.svg" alt="close svg" />
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
                    src="https://res.cloudinary.com/gautamcloudinary/image/upload/v1766924191/freedomtree_phpfqw.avif"
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

                        <div className='flex gap-6 justify-center'>


                          <button className='shadow-md  rounded-[5px] py-[7px] px-5 flex justify-center items-center gap-2'
                            onClick={() => {
                              login();
                            }}
                          >
                            <svg width="20px" height="20px" viewBox="0 0 256 262" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                              <g>
                                <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4"></path>
                                <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853"></path>
                                <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05"></path>
                                <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335"></path>
                              </g>
                            </svg>
                            <p className='text-[14px] font-semibold leading-[26px] text-[#111b21]'>Sign in with google</p>
                          </button>
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
