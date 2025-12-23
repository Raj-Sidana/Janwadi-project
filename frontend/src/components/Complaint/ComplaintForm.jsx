import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    contactPhone: "",
    contactEmail: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const categories = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "safety", label: "Safety" },
    { value: "environment", label: "Environment" },
    { value: "transportation", label: "Transportation" },
    { value: "sanitation", label: "Sanitation" },
    { value: "other", label: "Other" },
  ];

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select an image file",
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "Image size must be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
      setPhotoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({
        ...prev,
        photo: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validate Title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    // Validate Category
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // Validate Description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    // Validate State
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Validate City
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate Pincode
    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    // Validate Contact Phone (optional but if provided must be valid)
    if (formData.contactPhone && !validateMobile(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid 10-digit mobile number";
    }

    // Validate Contact Email (optional but if provided must be valid)
    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);

    // If no errors → submit complaint
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        setSubmissionMessage(null);

        const complaintData = new FormData();
        complaintData.append("title", formData.title);
        complaintData.append("category", formData.category);
        complaintData.append("description", formData.description);
        complaintData.append("state", formData.state);
        complaintData.append("city", formData.city);
        complaintData.append("address", formData.address);
        complaintData.append("pincode", formData.pincode);
        complaintData.append("contactPhone", formData.contactPhone);
        complaintData.append("contactEmail", formData.contactEmail);
        if (formData.photo) {
          complaintData.append("photo", formData.photo);
        }

        const token = localStorage.getItem("token");
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/complaints`, {
          method: "POST",
          headers: headers, // Pass headers here. Note: body is FormData, so don't set Content-Type, browser sets it with boundary.
          body: complaintData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to register complaint");
        }

        setSuccessInfo({
          refId: data?.complaint?._id,
          message: data.message || "Complaint registered successfully!",
        });

        setFormData({
          title: "",
          category: "",
          description: "",
          state: "",
          city: "",
          address: "",
          pincode: "",
          contactPhone: "",
          contactEmail: "",
          photo: null,
        });
        setPhotoPreview(null);
      } catch (error) {
        console.error("Error registering complaint:", error);
        setSubmissionMessage({
          type: "error",
          text: error.message || "An error occurred while registering the complaint",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl md:max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Register Your Complaint
        </h2>

        {/* Title Input */}
        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            Complaint Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="e.g., Pothole on Main Street"
          />
          {errors.title && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Please provide detailed information about the complaint..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* State and City Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {/* State */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Maharashtra"
            />
            {errors.state && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Pune"
            />
            {errors.city && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Address and Pincode Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {/* Address */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Street address, landmark, etc."
            />
            {errors.address && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., 411001"
              maxLength="6"
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>

        {/* Contact Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {/* Contact Phone */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactPhone}</p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="your.email@example.com"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactEmail}</p>
            )}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="mb-5 sm:mb-6">
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            Upload Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {errors.photo && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.photo}</p>
          )}
          {photoPreview && (
            <div className="mt-3 sm:mt-4">
              <img
                src={photoPreview}
                alt="Preview"
                className="max-w-full sm:max-w-xs max-h-40 sm:max-h-48 rounded-md border border-gray-300 w-full object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setFormData((prev) => ({ ...prev, photo: null }));
                }}
                className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800"
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 bg-indigo-900 text-white py-2.5 sm:py-3 rounded-md hover:bg-indigo-800 duration-200 font-semibold text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Register Complaint"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                category: "",
                description: "",
                state: "",
                city: "",
                address: "",
                pincode: "",
                contactPhone: "",
                contactEmail: "",
                photo: null,
              });
              setPhotoPreview(null);
              setErrors({});
            }}
            className="w-full sm:w-auto sm:px-6 bg-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-md hover:bg-gray-400 duration-200 font-semibold text-base sm:text-base"
          >
            Reset
          </button>
        </div>

        {submissionMessage && (
          <p
            className={`mt-3 sm:mt-4 text-xs sm:text-sm text-center ${
              submissionMessage.type === "success"
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {submissionMessage.text}
          </p>
        )}

        <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">
          <span className="text-red-500">*</span> indicates required fields
        </p>
      </form>

      {successInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative">
            <button
              onClick={() => {
                setSuccessInfo(null);
                setSubmissionMessage(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Close success message"
            >
              ×
            </button>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Complaint Registered!
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              {successInfo.message}
            </p>
            {successInfo.refId && (
              <p className="text-sm font-semibold text-gray-800">
                Reference ID: <span className="text-indigo-700">{successInfo.refId}</span>
              </p>
            )}
            <button
              onClick={() => setSuccessInfo(null)}
              className="mt-5 w-full bg-indigo-900 text-white py-2.5 rounded-md hover:bg-indigo-800 duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

