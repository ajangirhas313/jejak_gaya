import { useNavigate } from "react-router-dom";
import { CloudOff } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-300 to-sky-500 text-white">
      <div className="text-center bg-white text-gray-800 p-8 rounded-lg shadow-lg">
        <CloudOff size={64} className="text-gray-600 mb-4 mx-auto" />
        <h1 className="text-4xl font-bold mb-4">Oops! Something Went Wrong</h1>
        <p className="text-lg mb-6">
          We encountered an unexpected error. Please try again later or contact support if the issue persists.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
