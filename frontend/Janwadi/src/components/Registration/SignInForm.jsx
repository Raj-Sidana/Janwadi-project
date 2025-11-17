import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignInForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  // Validation Helpers
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { identifier: "", password: "" };

    // Validate Email or Mobile
    if (!identifier) {
      newErrors.identifier = "Email or Mobile number is required";
    } else if (!validateEmail(identifier) && !validateMobile(identifier)) {
      newErrors.identifier = "Enter a valid Email or 10-digit Mobile number";
    }

    // Validate Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If no errors → login
    if (!newErrors.identifier && !newErrors.password) {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Login Successful!');
          // Store token in localStorage or handle authentication
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          // Optionally redirect or update state
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full md:max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full max-w-sm md:max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-5">Sign In</h2>

        {/* Email / Mobile Input */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium">Email or Mobile</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            placeholder="Enter Email or Mobile"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm">{errors.identifier}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            placeholder="Enter Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-200 mt-2"
        >
          Sign In
        </button>
        <p className="mt-5 text-center">You dont have any account? <Link to='/SignUp'><span className="text-blue-600">Register</span></Link></p>
      </form>
    </div>
  );
}
