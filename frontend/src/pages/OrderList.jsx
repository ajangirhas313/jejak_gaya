import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AdminHeader from "../components/HeaderAdmin";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      setError("Anda belum login. Silakan login terlebih dahulu.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data orders.");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    let sortedOrders = [...orders];

    if (filterKey && filterValue) {
      sortedOrders = sortedOrders.filter((order) =>
        order[filterKey]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    if (sortKey) {
      sortedOrders.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (a[sortKey] > b[sortKey]) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(sortedOrders);
  }, [orders, sortKey, sortOrder, filterKey, filterValue]);

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterKey(e.target.value);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (token && jwtDecode(Cookies.get("token")).role !== "admin") {
    useEffect(() => {
      navigate("/admin");
    });
  } else {
    return (
      <div>
        <AdminHeader />
        <div className="flex justify-center mt-10">
          <main className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">
            <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">
              Order List
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="mb-4 flex justify-between items-end space-x-4">
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-bold mb-1 text-sm">
                    Sort By
                  </label>
                  <select
                    value={sortKey}
                    onChange={handleSortChange}
                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm"
                  >
                    <option value="">Select Field</option>
                    <option value="user_id">User ID</option>
                    <option value="product_name">Product Name</option>
                    <option value="price">Price</option>
                    <option value="order_date">Order Date</option>
                    <option value="total_amount">Total Amount</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-bold mb-1 text-sm">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={handleOrderChange}
                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-bold mb-1 text-sm">
                    Filter By
                  </label>
                  <select
                    value={filterKey}
                    onChange={handleFilterChange}
                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm"
                  >
                    <option value="">Select Field</option>
                    <option value="user_id">User ID</option>
                    <option value="product_name">Product Name</option>
                    <option value="order_date">Order Date</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-bold mb-1 text-sm">
                    Filter Value
                  </label>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm"
                    placeholder="Enter value"
                  />
                </div>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-400 to-sky-300 text-white">
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        User ID
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Product Name
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Size
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Quantity
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Price
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Order Date
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 font-semibold text-left">
                        Alamat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-sky-100 transition duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4 border-b border-gray-200">
                          {order.user_id}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {order.product_name}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {order.size}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Rp.{order.price}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {formatDate(order.order_date)}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Rp.{order.total_amount}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {order.shipping_address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !error && (
                <p className="text-center mt-6">
                  Tidak ada data order yang tersedia.
                </p>
              )
            )}
          </main>
        </div>
      </div>
    );
  }
};

export default OrderList;
