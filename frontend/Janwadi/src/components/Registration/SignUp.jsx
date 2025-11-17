import { useState } from "react";
import Navbar from "../homepage/Navbar";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validation Helpers
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile);

  const validatePincode = (pin) =>
    /^[0-9]{6}$/.test(pin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.name || form.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!validateMobile(form.number))
      newErrors.number = "Enter a valid 10-digit mobile number";

    if (!validateEmail(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.state)
      newErrors.state = "State is required";

    if (!form.city)
      newErrors.city = "City is required";

    if (!form.address || form.address.length < 10)
      newErrors.address = "Address must be at least 10 characters";

    if (!validatePincode(form.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            number: form.number,
            email: form.email,
            state: form.state,
            city: form.city,
            address: form.address,
            pincode: form.pincode,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Signup Successful!');
          // Reset form
          setForm({
            name: "",
            number: "",
            email: "",
            state: "",
            city: "",
            address: "",
            pincode: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup');
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div> <Navbar/>
    <div id="Signupbg" className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-10 px-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* All Inputs */}
        <div className="space-y-4 ">

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1 font-medium">Number</label>
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter mobile number"
            />
            {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter state"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter city"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter address"
              rows="2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block mb-1 font-medium">Pincode</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter pincode"
            />
            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
    </div>
  );
}
