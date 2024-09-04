import { Home, Info, ShoppingCart, LogIn, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function Header() {
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
    navigate("/");
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-6 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400 text-white shadow-md sticky top-0 z-50 font-poppins ">
    <div className="flex items-center gap-1">
      <img src="/Logggo.png" alt="logo" className="h-12 w-auto max-h-12" />
      <h1 className="text-3xl font-bold tracking-wide font-protest">Jejak Gaya</h1>
    </div>
    <nav>
      <ul className="flex items-center gap-8 font-protest">
        <li>
          <Link to="/" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
            <Home className="w-6 h-6" /> Home
          </Link>
        </li>
        <li>
          <Link to="/products" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
            <ShoppingCart className="w-6 h-6" /> Products
          </Link>
        </li>
        <li>
          <Link to="/about" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
            <Info className="w-6 h-6" /> About
          </Link>
        </li>

          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg"
              >
                <LogIn className="w-6 h-6" /> Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
                  <LogIn className="w-6 h-6" /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
                  <User className="w-6 h-6" /> Register
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/cart" className="flex items-center gap-2 hover:text-sky-200 transition-colors duration-300 text-lg">
              <ShoppingCart className="w-6 h-6" /> Cart
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
