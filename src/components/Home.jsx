import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBirthdays, editBirthday, deleteBirthday } from "../api/birthdays";
import { toast } from "react-toastify";
import { format } from "date-fns";

function Home() {
  const [birthdays, setBirthdays] = useState([]);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [userName, setUserName] = useState("");

  // Fetch birthdays from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      fetchBirthdays();
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name);
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
      }
    }
  }, []);
  const fetchBirthdays = async () => {
    setLoading(true);
    try {
      const res = await getBirthdays();
      setBirthdays(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Error fetching birthdays:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit existing birthday
  const handleEditSubmit = async (e, _id) => {
    e.preventDefault();
    if (!editName.trim() || !editDate.trim()) {
      toast.error("Please fill in both the name and the date fields!");
      return;
    }

    setIsEditing(true);
    try {
      await editBirthday(_id, editName, editDate);
      toast.success("Birthday updated successfully");
      setEditingBirthday(null);
      fetchBirthdays();
    } catch (error) {
      console.error("Error editing birthday:", error);
      toast.error("Failed to update the birthday. Please try again");
    } finally {
      setIsEditing(false);
    }
  };

  // Delete birthday
  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this birthday?"
    );
    if (!confirmDelete) return;

    setDeletingId(_id);
    try {
      await deleteBirthday(_id);
      toast.success("Birthday deleted successfully!");
      setBirthdays(birthdays.filter((b) => b._id !== _id));
    } catch (error) {
      console.error("Error deleting birthday:", error);
      toast.error("Failed to delete the birthday. Please try again");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-blue-200 to-white p-4 md:p-6">
      {userName && (
        <h2 className="text-xl font-semibold text-gray-800 bg-blue-100 px-4 py-2 rounded-md shadow-sm mb-4 text-center">
          Welcome Back, {userName.toUpperCase()}!
        </h2>
      )}
      <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
        🎉 Upcoming Birthdays 🎉
      </h3>

      <div className="w-full max-w-4xl px-2 md:px-0">
        <div className="w-full bg-white shadow-lg rounded-lg p-3 md:p-4 min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : birthdays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
              <span className="text-3xl md:text-5xl mb-2">🎈</span>
              <p className="text-base md:text-lg mb-2 font-medium">
                No Birthdays Added Yet?
              </p>
              <p className="text-sm md:text-base text-center px-4">
                Add one to start keeping track of the celebrations 🎉
              </p>
            </div>
          ) : (
            <ul>
              {birthdays.map((bday) => (
                <li
                  key={bday._id}
                  className="p-3 md:p-4 mb-2 border rounded-lg shadow-sm bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  {editingBirthday?._id === bday._id ? (
                    // Edit Form
                    <form
                      onSubmit={(e) => handleEditSubmit(e, bday._id)}
                      className="w-full flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-2 rounded flex-1 min-w-0"
                        placeholder="Name"
                        required
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="border p-2 rounded flex-1 min-w-0"
                        required
                      />
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          type="submit"
                          disabled={isEditing}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition flex-1"
                        >
                          {isEditing ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBirthday(null)}
                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-500 transition flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full sm:w-auto flex-1">
                        <span className="font-semibold text-gray-700 truncate">
                          {bday.name}
                        </span>
                        <span className="text-gray-500 text-sm sm:text-base">
                          {format(new Date(bday.date), "dd MMM yyyy")}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setEditingBirthday(bday);
                            setEditName(bday.name);
                            setEditDate(bday.date);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm sm:text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bday._id)}
                          disabled={deletingId === bday._id}
                          className={`px-3 py-1 text-sm rounded ${
                            deletingId === bday._id
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {deletingId === bday._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Link
        to="/add"
        className="mt-6 px-5 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition text-sm sm:text-base"
      >
        Add Birthday
      </Link>
    </div>
  );
}

export default Home;
