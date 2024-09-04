import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Home, List, User, LogIn } from 'lucide-react';

const AdminHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-4 shadow-md">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-protest">Admin Panel</h1>
      </div>
      <nav>
        <ul className="flex gap-6">
          <li>
            <Link to="/admin" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300">
              <Home /> Home
            </Link>
          </li>
          <li>
            <Link to="/orders" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300">
              <List /> Order List
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300">
              <User /> Add Admin Account
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300"
              >
                <LogIn /> Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AdminHeader;
