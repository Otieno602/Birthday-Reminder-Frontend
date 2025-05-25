import React from "react";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userToken, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">🎂 Birthday Reminder</h1>

        {/* Hamburger Button for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? "✖️" : "☰"}
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:space-x-4 md:items-center`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block mt-2 md:mt-0 text-yellow-300 font-semibold"
                : "block mt-2 md:mt-0 hover:text-yellow-300"
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              isActive
                ? "block mt-2 md:mt-0 text-yellow-300 font-semibold"
                : "block mt-2 md:mt-0 hover:text-yellow-300"
            }
            onClick={() => setIsOpen(false)}
          >
            addBirthday
          </NavLink>
          {userToken ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block mt-2 md:mt-0 hover:text-yellow-300"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "block mt-2 md:mt-0 text-yellow-300 font-semibold"
                  : "block mt-2 md:mt-0 hover:text-yellow-300"
              }
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
