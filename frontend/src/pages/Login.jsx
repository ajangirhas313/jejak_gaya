import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { UserContext } from "../App"; // Import UserContext
import { X } from 'lucide-react'; // Import Lucide Icon

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use UserContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status); // Log status code

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data); // Log data received

        // Save token to cookies
        Cookies.set('token', data.token, { expires: 7, secure: false });
        
        // Save user_id and role in UserContext
        setUser({ id: data.user_id, role: data.role });
        
        // Redirect based on role
        if (data.role === 'admin') {
          navigate("/admin");
        } else if (data.role === 'customer') {
          navigate("/");
        } else {
          setError("Unknown role. Please contact support.");
        }
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData); // Log error response
        setError(errorData.message || "Login failed. Please check your username and password.");
      }
    } catch (err) {
      console.error('Fetch error:', err); // Log fetch error
      setError("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 flex items-center justify-center">
      <div className="relative p-8 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 shadow-md hover:bg-gray-300 transition"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="text-center text-3xl font-extrabold text-gray-800">Welcome Back!</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Dont have an account?{" "}
            <Link to="/register" className="text-sky-600 hover:text-sky-800 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
