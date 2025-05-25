import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBirthday } from "../api/birthdays";
import { toast } from "react-toastify";

const Addbirthday = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least two characters";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addBirthday({ name: name.trim(), date });
      toast.success("Birthday added successfully! 🎉");
      navigate("/");
    } catch (error) {
      console.error("Error adding birthday:", error);
      toast.error("Failed to add birthday. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-blue-200 to-white p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
        🎂 Add a New Birthday 🎂
      </h1>
      <div className="w-full max-w-md px-3 sm:px-0">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white shadow-lg rounded-lg p-4 md:p-6"
        >
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-medium text-sm md:text-base">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-green-400 text-sm md:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium text-sm md:text-base">
              Date
            </label>
            <input
              type="date"
              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-green-400 text-sm md:text-base"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 md:p-3 rounded-lg shadow-md text-sm md:text-base transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save Birthday"}
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-4 md:mt-6 text-blue-700 hover:text-blue-950 text-sm md:text-base flex items-center"
      >
        <span className="mr-1">⬅</span>Back to Birthdays
      </button>
    </div>
  );
};

export default Addbirthday;
