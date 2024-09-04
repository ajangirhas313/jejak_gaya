import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { UserContext } from "../App";
import Cookies from "js-cookie";
import Header from "../components/Header";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useContext(UserContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [sizes, setSizes] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id]);

  useEffect(() => {
    if (product) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${product.id}/stock`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((response) => response.json())
        .then((data) => setSizes(data))
        .catch((error) => console.error("Error fetching sizes:", error));
    }
  }, [product, token]);

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = async () => {
    if (!user || !product || !selectedSize) {
      console.error("User, product, or size is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
            size: selectedSize,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const result = await response.json();
      console.log(result.message);
      setModalVisible(false); // Close modal after adding to cart
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-blue-200 via-sky-300 to-indigo-300 p-8 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
          {/* Gambar Produk */}
          <div className="w-1/2 p-6 flex items-center justify-center bg-gradient-to-b from-white to-sky-200">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          {/* Informasi Produk */}
          <div className="w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-4">
                {product.name}
              </h1>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {product.category}
              </p>
              <p className="text-md text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-2xl font-bold text-red-600 mb-6">
                Rp.{product.price}
              </p>

              {/* Tombol */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setModalVisible(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all duration-300 flex-1 flex items-center justify-center"
                >
                  <ShoppingCart className="inline-block mr-2" /> Add to Cart
                </button>

                <Link to="/cart" className="flex-1">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition-all duration-300 w-full">
                    Go to Cart
                  </button>
                </Link>
              </div>
            </div>

            {/* Tombol Back */}
            <Link to="/products" className="mt-6">
              <button className="bg-red-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-600 transition-all duration-300 w-full">
                Back to Products
              </button>
            </Link>
          </div>
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Add to Cart
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                {product.name}
              </h4>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
              <p className="text-2xl font-bold text-red-600 mb-4">
                Rp.{product.price}
              </p>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1">
                  Select Size:
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size.size} value={size.size}>
                      {size.size} ({size.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1">
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500 transition-all duration-300"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => setModalVisible(false)}
                  className="bg-red-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
