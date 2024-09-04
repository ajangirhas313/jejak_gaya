import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";

export default function Checkout() {
  const [cartDetails, setCartDetails] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [totalAmount, setTotalAmount] = useState(0);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  // Mengambil data keranjang dari API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const groupedCart = groupCartItems(data);
        setCartDetails(groupedCart);
        setTotalAmount(calculateTotal(groupedCart));
      })
      .catch((error) => console.error("Error fetching cart details:", error));
  }, [token]);

  // Mengelompokkan item keranjang berdasarkan product_id dan size
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

  // Menghitung subtotal per item
  const calculateSubtotal = (item) => item.quantity * (item.price || 0);

  // Menghitung total harga dari semua item
  const calculateTotal = (cartItems) =>
    cartItems.reduce((acc, item) => acc + calculateSubtotal(item), 0);

  // Fungsi untuk submit order
  const handlePayment = (e) => {
    e.preventDefault();

    const orderData = {
      shipping_address: address,
      payment_method: paymentMethod,
      total_amount: totalAmount,
      items: cartDetails,
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("pembayaran berhasil");
          // Kosongkan keranjang setelah pembayaran berhasil
          setCartDetails([]);
          setTotalAmount(0);
          setAddress("");         
          navigate("/");
        } else {
          alert("Gagal memproses pembayaran");
        }
      })
      .catch((error) => console.error("Error processing checkout:", error));
  };

  if (!token || jwtDecode(Cookies.get("token")).role !== "customer")
    useEffect(() => {
      navigate("/error");
    });
  else

  return (
    <div>
  <Header />
  <div className="checkout-container min-h-screen bg-gradient-to-br from-sky-200 to-sky-300 p-8 flex justify-center items-start">
    <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-3xl font-extrabold text-sky-800 mb-6 text-center">
        Checkout
      </h2>

      <div className="cart-items mb-8">
        <h3 className="text-2xl font-semibold text-sky-700 mb-4">
          Produk yang Dibeli:
        </h3>
        {cartDetails.length > 0 ? (
          cartDetails.map((item) => (
            <div
              key={`${item.product_id}_${item.size}`}
              className="flex items-center gap-6 mb-6 bg-sky-50 p-4 rounded-xl shadow-md transform transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg shadow-sm border border-sky-200"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-sky-800">
                  {item.name}
                </h3>
                <p className="text-sm text-sky-600">Size: {item.size}</p>
                <p className="text-sm text-sky-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-sky-600">
                  Price:{" "}
                  <span className="font-semibold text-sky-800">
                    Rp.{calculateSubtotal(item)}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sky-500">No items in cart.</p>
        )}
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-sky-700 mb-2">
            Alamat Pengiriman:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border border-sky-300 rounded-lg p-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sky-700 mb-2">
            Metode Pembayaran:
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="border border-sky-300 rounded-lg p-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="credit_card">Gopay</option>
            <option value="bank_transfer">Dana</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-sky-800">
            Total: Rp.{totalAmount}
          </h3>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 to-sky-600 text-white py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-sky-500 hover:to-sky-700"
          >
            Bayar Sekarang
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}
