import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

const initialFormState = {
  name: "",
  email: "",
  number: "",
  state: "",
  city: "",
  address: "",
  pincode: "",
};

export default function Profile() {
  const storedUser = getStoredUser();
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    ...(storedUser || {}),
  }));
  const [originalData, setOriginalData] = useState(() => ({
    ...initialFormState,
    ...(storedUser || {}),
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const parseJsonResponse = async (response) => {
    try {
      return await response.clone().json();
    } catch (jsonError) {
      const text = await response.text();
      const statusLabel = `${response.status} ${response.statusText || ""}`.trim();

      if (text && !text.trim().startsWith("<")) {
        throw new Error(text);
      }

      throw new Error(
        `Unexpected response from server (${statusLabel || "unknown status"}). Please try again.`
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/SignIn", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("authChange"));
          navigate("/SignIn", { replace: true });
          return;
        }

        const data = await parseJsonResponse(response);
        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const userData = {
          name: data.user?.name || "",
          email: data.user?.email || "",
          number: data.user?.number || "",
          state: data.user?.state || "",
          city: data.user?.city || "",
          address: data.user?.address || "",
          pincode: data.user?.pincode || "",
        };
        setFormData(userData);
        setOriginalData(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const startEditingField = (fieldKey) => {
    setEditingField(fieldKey);
    setEditingValue(formData[fieldKey] || "");
    setMessage(null);
  };

  const cancelEditingField = () => {
    setEditingField(null);
    setEditingValue("");
    setMessage(null);
  };

  const validateField = (field, value) => {
    const trimmed = value.trim();
    switch (field) {
      case "name":
        if (!trimmed) return "Name is required";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email";
        break;
      case "number":
        if (!/^[0-9]{10}$/.test(trimmed)) return "Enter a valid 10-digit mobile number";
        break;
      case "state":
        if (!trimmed) return "State is required";
        break;
      case "city":
        if (!trimmed) return "City is required";
        break;
      case "address":
        if (!trimmed) return "Address is required";
        break;
      case "pincode":
        if (!/^[0-9]{6}$/.test(trimmed)) return "Enter a valid 6-digit pincode";
        break;
      default:
        break;
    }
    return null;
  };

  const saveField = async () => {
    if (!editingField) return;

    const error = validateField(editingField, editingValue);
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/SignIn", { replace: true });
      return;
    }

    try {
      setSavingField(editingField);
      setMessage(null);

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField]: editingValue }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/SignIn", { replace: true });
        return;
      }

      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      const updatedData = {
        name: data.user?.name || "",
        email: data.user?.email || "",
        number: data.user?.number || "",
        state: data.user?.state || "",
        city: data.user?.city || "",
        address: data.user?.address || "",
        pincode: data.user?.pincode || "",
      };
      setFormData(updatedData);
      setOriginalData(updatedData);
      setMessage({
        type: "success",
        text: data.message || "Profile updated successfully",
      });
      cancelEditingField();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSavingField(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-900 text-white flex items-center justify-center text-2xl font-semibold uppercase">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
              <p className="text-gray-500 text-sm">
                View and manage your account information
              </p>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm mb-4 ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "number", label: "Mobile Number", type: "tel", maxLength: 10 },
              { key: "state", label: "State", type: "text" },
              { key: "city", label: "City", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "pincode", label: "Pincode", type: "text", maxLength: 6 },
            ].map(({ key, label, type, maxLength }) => (
              <div
                key={key}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">
                      {label}
                    </p>
                    {editingField === key ? (
                      <input
                        type={type}
                        value={editingValue}
                        maxLength={maxLength}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium break-words">
                        {formData[key] || "Not provided"}
                      </p>
                    )}
                  </div>
                  {editingField !== key ? (
                    <button
                      onClick={() => startEditingField(key)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
                {editingField === key && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      onClick={saveField}
                      disabled={savingField === key}
                      className="px-4 py-2 bg-indigo-900 text-white rounded-md text-sm font-semibold hover:bg-indigo-800 transition disabled:opacity-60"
                    >
                      {savingField === key ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditingField}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

