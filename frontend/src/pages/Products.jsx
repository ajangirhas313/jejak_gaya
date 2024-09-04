import { useState, useEffect} from "react";
// import { UserContext } from "../App"; // Import UserContext
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Import Link for navigation
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Products() {
  // const { user } = useContext(UserContext); // Ambil user dari context
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sorting by name
  const [filterCategory, setFilterCategory] = useState("all"); // Default filter
  const navigate = useNavigate();

  const token = Cookies.get("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [token]);

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        filterCategory === "all" || product.category === filterCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    if (token && jwtDecode(Cookies.get("token")).role !== "customer")
      useEffect(() => {
        navigate("/admin");
      });
    else

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-purple-200 to-indigo-400 p-6">
        <h1 className="text-4xl font-bold text-center text-white mb-6 font-poppins drop-shadow-md">
          Our Products
        </h1>

        <div className="flex justify-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-blue-200 rounded p-2 w-full max-w-md bg-white text-black placeholder-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-poppins"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-blue-200 rounded p-2 bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-poppins"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border-2 border-blue-200 rounded p-2 bg-white text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-poppins"
          >
            <option value="all">All Categories</option>
            <option value="running">Running</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="basketball">Basketball</option>
            <option value="gym and training">Gym and Training</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl p-4"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 border border-gray-200 rounded-lg transition-all duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 font-poppins">
                  {product.name}
                </h3>
                <h3 className="text-sm font-medium text-gray-500 font-poppins">
                  {product.category}
                </h3>
                <p className="text-xl font-bold text-blue-700 mt-2 font-poppins">
                  Rp.{product.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
