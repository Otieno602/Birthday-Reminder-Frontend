import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/resetPassword/${token}`,
        { newPassword },
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Reset error:", error);
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        {message && (
          <p className="mb-4 text-sm text-center text-red-600">{message}</p>
        )}
        <form onSubmit={handleReset}>
          <label className="block mb-2 font-medium">New Password:</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded"
          />
          <label className="block mb-2 font-medium">Confirm Password:</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
