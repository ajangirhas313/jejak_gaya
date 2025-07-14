import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";
import { Trash } from "lucide-react";

export default function Cart() {
  const [cartDetails, setCartDetails] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  // Fetch cart data from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const groupedCart = groupCartItems(data);
        setCartDetails(groupedCart);
      })
      .catch((error) => {
        console.error("Error fetching cart details:", error);
        navigate(-1);
      });
  }, [token]);

  // Group cart items by product_id and size
  const groupCartItems = (items) => {
    const grouped = items.reduce((acc, item) => {
      const key = `${item.product_id}_${item.size}`;
      if (!acc[key]) {
        acc[key] = { ...item, quantity: 0 };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const calculateSubtotal = (item) => item.quantity * (item.price || 0);

  const calculateTotal = () =>
    cartDetails.reduce((acc, item) => acc + calculateSubtotal(item), 0);

  const updateQuantity = (item, newQuantity) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: item.product_id,
        size: item.size,
        quantity: newQuantity,
      }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        const updatedCart = cartDetails.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
        setCartDetails(groupCartItems(updatedCart));
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleDelete = (itemId) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          setCartDetails(cartDetails.filter((item) => item.id !== itemId));
        } else {
          alert(result.message || "Failed to delete item");
        }
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  if (!token || (token&&jwtDecode(Cookies.get("token")).role !== "customer"))
    useEffect(() => {
      navigate("/error");
    });
  else
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-100 to-sky-300 p-8 flex justify-center">
          {/* Product List */}
          <div className="flex-grow bg-white shadow-2xl rounded-2xl p-8 mr-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
              Shopping Cart
            </h2>
            {cartDetails.length > 0 ? (
              cartDetails.map((item) => (
                <div
                  key={`${item.product_id}_${item.size}`}
                  className="flex items-center gap-6 mb-6 border-b pb-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Quantity:
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item, Number(e.target.value))
                        }
                        className="ml-2 border border-gray-300 rounded-lg p-1 w-16 text-center shadow-inner"
                        min="1"
                      />
                    </p>
                    <p className="text-sm text-gray-500">
                      Price:{" "}
                      <span className="font-semibold text-gray-700">
                        Rp.{calculateSubtotal(item)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
                  >
                    <Trash />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
          </div>

          {/* Summary */}
          <div className="w-96 bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 shadow-lg rounded-2xl p-8">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">
              Order Summary
            </h3>
            <div className="flex justify-between text-gray-800 text-lg mb-4 border-b border-gray-300 pb-4">
              <p className="font-medium">Subtotal:</p>
              <p className="font-semibold">Rp.{calculateTotal().toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-800 text-lg mb-6 border-b border-gray-300 pb-4">
              <p className="font-medium">Total:</p>
              <p className="text-xl font-bold text-indigo-600">
                Rp.{calculateTotal().toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    );
}
