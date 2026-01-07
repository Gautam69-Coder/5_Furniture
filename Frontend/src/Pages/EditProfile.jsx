import { useState, useEffect } from "react";
import axios from "axios"
import { API_BASE_URL } from "../api";
export default function EditProfile() {

    const [User, setUser] = useState(null)
    const [add, setadd] = useState([])
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });
    const [address, setaddress] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    })

    const fetchUserDetails = async () => {
        try {

            const token = localStorage.getItem("refreshToken")
            const res = await axios.get(`${API_BASE_URL}/api/v1/user/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setUser(res.data.data);
            console.log(res.data.data)
        } catch (err) {
            console.log(err)
        }
    };

    const fetchAddressDetails = async () => {
        try {

            const token = localStorage.getItem("refreshToken")
            const res = await axios.get(`${API_BASE_URL}/api/v1/address`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setadd(res.data.data || []);
            // console.log(res.data.data)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        fetchUserDetails();
        fetchAddressDetails();
    }, []);

    useEffect(() => {
        if (User) {
            setForm({
                firstName: User.firstName || "",
                lastName: User.lastName || "",
                email: User.email || "",
                phoneNumber: User.phoneNumber || "",
            })

            setaddress({
                address: "" || add.address,
                city: add.city || "",
                state: add.state || "",
                pincode: add.pincode || "",
                country: add.country || "India"
            })
        }
    }, [User])




    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setaddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const userDetils = async () => {
        try {
            const token = localStorage.getItem("refreshToken")
            const res = await axios.post(`${API_BASE_URL}/api/v1/edit-profile`, {
                form,
                address,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <p className="text-sm text-gray-500 mb-1">My Account</p>
                <h1 className="text-3xl font-semibold mb-10">Edit Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 border border-gray-200 p-8">
                        <h2 className="text-sm tracking-widest text-gray-600 mb-6">PROFILE DETAILS</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                />
                            </div>

                            <div className="pt-4">
                                <h3 className="text-sm tracking-widest text-gray-600 mb-4">ADDRESS DETAILS</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Address Line</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={address.address}
                                            onChange={handleAddressChange}
                                            placeholder="House no, Street, Area"
                                            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={address.city}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={address.state}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm mb-1">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={address.pincode}
                                                onChange={handleAddressChange}
                                                maxLength={6}
                                                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={address.country}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-8 py-2 text-sm hover:opacity-90"
                                    onClick={() => { userDetils() }}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="border border-black px-8 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-[#f7f3ec] flex items-center justify-center text-gray-700 text-sm">
                        Freedom Tree • Crafted Living
                    </div>
                </div>
            </div>
        </div>
    );
}
