import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'ldrs/react/TailChase.css'
import axios from "axios"
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { loader } from "../Utils/loarder";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setcart] = useState([])
  // const [totalAmount, settotalAmount] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {

        const token = localStorage.getItem("refreshToken")
        const res = await axios.get(`${API_BASE_URL}/api/v1/user/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setUser(res.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user details");
        setLoading(false);
        console.log(err)
      }
    };

    fetchUserDetails();
  }, []);


  useEffect(() => {
    const myorders = async () => {
      try {
        const token = localStorage.getItem("refreshToken")
        const res = await axios.get(`${API_BASE_URL}/api/v1/myorders`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log(res.data.data)
        setcart(res.data.data)

      } catch (error) {
        console.log(error)
      }
    }
    myorders()
  }, []);


  if (loading) return <div>
    <div className="flex justify-center items-center h-[70vh]">
      {loader()}
    </div>
  </div>;
  if (error) return <p className="flex justify-center items-center w-full h-[70vh]" style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-[#fafafa] sm:py-10 ">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-10">
          <p className="text-sm text-gray-500">My Account</p>
          <h1 className="text-2xl font-light tracking-wide text-gray-900">
            Profile & Orders
          </h1>
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 mb-12">

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              Profile Details
            </h2>

            <p className="text-sm text-gray-800 mb-2">
              <span className="text-gray-500">Name:</span>{" "}
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-sm text-gray-800 mb-2">
              <span className="text-gray-500">Email:</span>{" "}
              {user?.email}
            </p>

            <p className="text-sm text-gray-800">
              <span className="text-gray-500">Member Since:</span>{" "}
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => {
                localStorage.removeItem("refreshToken");
                navigate("/");
              }}
              className="mt-6 text-sm underline text-gray-700 hover:text-black"
            >
              Logout
            </button>
          </div>

          <div className="bg-[#f4f1ec] flex items-center justify-center text-sm text-gray-600">
            Freedom Tree • Crafted Living
          </div>

        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6">
            My Orders
          </h2>

          {(cart.length === 0) ? (
            <div className='flex flex-col mt-20 justify-center items-center'>
              <div className='my-2'>
                <img src="https://res.cloudinary.com/gautamcloudinary/image/upload/v1766924530/cart2_cjjh48.svg" alt="" className='w-[82px] h-[70px]' />
              </div>

              <p className='font-medium text-[18px] text-center my-2'>Your cart looks deserted currently. Start shopping our originally designed and handmade products.</p>

              <Link to={"/"}>
                <button className='px-6 py-3 font-bold text-[15px] leading-3 uppercase bg-[#333333] text-white'>Start Shopping</button>
              </Link>
            </div>
          ) : (
            (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="border-b pb-6 last:border-none"
                >
                  <div className="space-y-6">
                    {item.order_details.map((prod, idx) => (
                      <div key={idx}>
                        <div className="flex gap-6" >
                          <img
                            src={prod.items[0].item_image_url}
                            alt={prod.items[0].item_name}
                            className="w-28 h-28 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-md font-light text-gray-900">
                              {prod.items[0].item_name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Size: {prod.items[0].item_size || "N/A"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Quantity: {prod.items[0].item_quantity}
                            </p>

                            <p className="text-sm font-medium text-gray-900 mt-3">
                              ₹ {prod.status[0].totalAmount}
                            </p>

                            <Link
                              to={`/order/${prod._id}`}
                              className="inline-block  text-sm underline text-gray-700 hover:text-black"
                            >
                              View Order Details
                            </Link>
                          </div >

                        </div>
                        {prod.items.length > 1 && (
                          <p className="text-sm text-gray-500 mt-2 ">
                            + {prod.items.length - 1} more item(s)

                          </p>
                        )}
                        <hr className="mt-6 text-neutral-400"/>
                      </div>

                    ))}


                  </div>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );

};

export default Profile;
