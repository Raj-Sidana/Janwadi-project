import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.isAdmin) {
      navigate("/SignIn", { replace: true });
      return;
    }

    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();
      setComplaints(data.complaints || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchComplaints();
      if (selectedComplaint?._id === complaintId) {
        const updated = await fetch(
          `${API_BASE_URL}/api/admin/complaints/${complaintId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((r) => r.json());
        setSelectedComplaint(updated.complaint);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update status");
    }
  };

  const updatePriority = async (complaintId, newPriority) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/complaints/${complaintId}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update priority");
      }

      await fetchComplaints();
      if (selectedComplaint?._id === complaintId) {
        const updated = await fetch(
          `${API_BASE_URL}/api/admin/complaints/${complaintId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((r) => r.json());
        setSelectedComplaint(updated.complaint);
      }
    } catch (err) {
      console.error("Error updating priority:", err);
      alert(err.message || "Failed to update priority");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      on_hold: "bg-orange-100 text-orange-800",
      reopened: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint._id.toLowerCase().includes(searchId.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage all registered complaints</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaints List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-900 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">All Complaints ({filteredComplaints.length})</h2>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Search by Complaint ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No complaints found
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((complaint) => (
                        <tr
                          key={complaint._id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedComplaint?._id === complaint._id
                              ? "bg-indigo-50"
                              : ""
                          }`}
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {complaint._id.slice(-6)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {complaint.title}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                complaint.status
                              )}`}
                            >
                              {complaint.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                complaint.priority
                              )}`}
                            >
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(complaint.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComplaint(complaint);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Complaint Details & Actions */}
          <div className="lg:col-span-1">
            {selectedComplaint ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Complaint Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Title</p>
                    <p className="text-gray-900">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <p className="text-gray-900 capitalize">
                      {selectedComplaint.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-gray-900">{selectedComplaint.description}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-900">
                      {selectedComplaint.city}, {selectedComplaint.state}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedComplaint.address} - {selectedComplaint.pincode}
                    </p>
                  </div>

                  {selectedComplaint.submittedBy && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Submitted By</p>
                      <p className="text-gray-900">
                        {selectedComplaint.submittedBy.name || "Anonymous"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {selectedComplaint.submittedBy.email}
                      </p>
                    </div>
                  )}

                  {selectedComplaint.photoUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Photo</p>
                      <img
                        src={`${API_BASE_URL}${selectedComplaint.photoUrl}`}
                        alt="Complaint"
                        className="w-full h-48 object-cover rounded-md mt-2"
                      />
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Update Status
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatus(selectedComplaint._id, "pending")}
                        className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(selectedComplaint._id, "in_progress")
                        }
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint._id, "resolved")}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                      >
                        Resolved
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint._id, "cancelled")}
                        className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint._id, "on_hold")}
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200"
                      >
                        On Hold
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint._id, "reopened")}
                        className="px-3 py-2 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                      >
                        Reopen
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Set Priority
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updatePriority(selectedComplaint._id, "low")
                        }
                        className="px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
                      >
                        Low
                      </button>
                      <button
                        onClick={() =>
                          updatePriority(selectedComplaint._id, "medium")
                        }
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() =>
                          updatePriority(selectedComplaint._id, "high")
                        }
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200"
                      >
                        High
                      </button>
                      <button
                        onClick={() =>
                          updatePriority(selectedComplaint._id, "urgent")
                        }
                        className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                      >
                        Urgent
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-4 border-t">
                    <p>Created: {formatDate(selectedComplaint.createdAt)}</p>
                    <p>Updated: {formatDate(selectedComplaint.updatedAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                <p>Select a complaint to view details and manage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


