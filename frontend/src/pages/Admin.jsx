import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, Edit, Package } from "lucide-react";
import AdminHeader from "../components/HeaderAdmin";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState("");
  const [showProductModal, setShowProductModal] = useState(false); // control product modal visibility
  const [showStockModal, setShowStockModal] = useState(false); // control stock modal visibility
  const [showEditStockModal, setShowEditStockModal] = useState(false); // control edit stock modal visibility
  const [productId, setProductId] = useState(null); // store the id of the product for stock and size entry
  const [sizes, setSizes] = useState([{ size: "", stock: "" }]); // state for storing sizes and stocks
  const [editStock, setEditStock] = useState([]); // state for storing sizes and stocks for editing
  const [notification, setNotification] = useState("");
  const [isError, setIsError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false); // control add admin modal visibility
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    role: "admin",
  }); // state for new admin
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const showNotificationMessage = (message, error = false) => {
    setNotification(message);
    setIsError(error);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        const product = await response.json();
        setProducts([...products, product]);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          image_url: "",
          category: "",
        });
        setProductId(product.id);
        setShowProductModal(false);
        setShowStockModal(true);
        showNotificationMessage("Product added successfully!");
      } else {
        showNotificationMessage("Failed to add product.");
      }
    } catch (err) {
      showNotificationMessage("An error occurred. Please try again: " + err);
    }
  };

  const handleEditProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProduct),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();

        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        setEditProduct(null);
        setShowProductModal(false);
        setNotification("Product updated successfully!");
        setIsError(false);
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);

        fetchProducts();
      } else {
        setNotification("Failed to update product.");
        setIsError(true);
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch (err) {
      setNotification("An error occurred. Please try again: " + err);
      setIsError(true);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAdmin),
        }
      );

      if (response.ok) {
        // const admin = await response.json();
        setShowAddAdminModal(false); // Close modal after success
        showNotificationMessage("Admin account added successfully!");
      } else {
        showNotificationMessage("Failed to add admin account.", true);
      }
    } catch (err) {
      showNotificationMessage(
        "An error occurred. Please try again: " + err,
        true
      );
    }
  };

  const handleAddSizeStock = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/stock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sizes }),
        }
      );

      if (response.ok) {
        setSizes([{ size: "", stock: "" }]); // reset the sizes state
        setShowStockModal(false); // close stock modal

        // Set notifikasi berhasil
        setNotification("Sizes and stock added successfully!");
        setIsError(false);
        setShowNotification(true);

        // Sembunyikan notifikasi setelah beberapa detik
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // 3 detik
      } else {
        // Set notifikasi gagal
        setNotification("Failed to add sizes and stock.");
        setIsError(true);
        setShowNotification(true);

        // Sembunyikan notifikasi setelah beberapa detik
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // 3 detik
      }
    } catch (err) {
      // Set notifikasi jika terjadi error
      setNotification("An error occurred. Please try again: " + err);
      setIsError(true);
      setShowNotification(true);

      // Sembunyikan notifikasi setelah beberapa detik
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); // 3 detik
    }
  };

  const handleEditStock = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/stock`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sizes: editStock }),
        }
      );

      if (response.ok) {
        setEditStock([]);
        setShowEditStockModal(false); // close edit stock modal
      } else {
        setError("Failed to update sizes and stock.");
      }
    } catch (err) {
      setError("An error occurred. Please try again." + err);
    }
  };

  const handleDeleteStock = async (productId, size) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/products/${productId}/stock/${size}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Stock deleted successfully");
        // Update editStock state to remove the deleted stock
        setEditStock(editStock.filter((stock) => stock.size !== size));
      } else {
        console.error("Failed to delete stock");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id)); // Remove the deleted product from state
      } else {
        setError("Failed to delete product.");
      }
    } catch (err) {
      setError("An error occurred. Please try again." + err);
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleEditSizeChange = (index, field, value) => {
    const updatedEditStock = [...editStock];
    updatedEditStock[index][field] = value;
    setEditStock(updatedEditStock);
  };

  const addSizeInput = () => {
    setSizes([...sizes, { size: "", stock: "" }]);
  };

  const addEditSizeInput = () => {
    setEditStock([...editStock, { size: "", stock: "" }]);
  };

  const handleProductModalOpen = (product) => {
    setEditProduct(product);
    setShowProductModal(true);
    navigate("/admin");
  };

  if (
    !Cookies.get("token") ||
    jwtDecode(Cookies.get("token")).role !== "admin"
  ) {
    navigate("/");
  } else
    return (
      <div>
        <AdminHeader />
        <div className="p-6 bg-blue-50 min-h-screen">
          <h2 className="text-3xl font-bold text-blue-800">
            Admin - Manage Products
          </h2>
          {error && <p className="text-red-500">{error}</p>}

          {/* Notifikasi */}
          {showNotification && (
            <div
              className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-md ${
                isError ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {notification}
            </div>
          )}

          {/* Add Product Button */}
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-gradient-to-r from-blue-500 to-sky-400 text-white px-6 py-2 rounded mt-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            Add Product
          </button>

          {/* Product List in Table Format */}
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Product List
            </h3>
            <table className="min-w-full bg-white border border-blue-300 rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-sky-400 text-white">
                <tr>
                  <th className="border border-blue-300 p-3 text-left">Name</th>
                  <th className="border border-blue-300 p-3 text-left">
                    Price
                  </th>
                  <th className="border border-blue-300 p-3 text-left">
                    Category
                  </th>
                  <th className="border border-blue-300 p-3 text-left">
                    Image
                  </th>
                  <th className="border border-blue-300 p-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-blue-100 transition-colors duration-200"
                  >
                    <td className="border border-blue-200 p-3">
                      {product.name}
                    </td>
                    <td className="border border-blue-200 p-3">
                      Rp.{product.price}
                    </td>
                    <td className="border border-blue-200 p-3">
                      {product.category}
                    </td>
                    <td className="border border-blue-200 p-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="border border-blue-200 p-3 space-x-2 flex justify-center items-center">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 flex justify-center items-center"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        onClick={() => handleProductModalOpen(product)}
                        className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors duration-200 flex justify-center items-center"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setProductId(product.id);
                          fetch(
                            `${
                              import.meta.env.VITE_API_BASE_URL
                            }/api/products/${product.id}/stock`
                          )
                            .then((response) => response.json())
                            .then((data) => {
                              setEditStock(data);
                              setShowEditStockModal(true);
                            })
                            .catch((error) =>
                              console.error("Error fetching stock data:", error)
                            );
                        }}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200 flex justify-center items-center"
                      >
                        <Package size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-sky-200 bg-opacity-70">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl">
              <h3 className="text-2xl font-bold text-sky-700 mb-4 text-center">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={editProduct ? editProduct.name : newProduct.name}
                  onChange={(e) => {
                    if (editProduct) {
                      setEditProduct({ ...editProduct, name: e.target.value });
                    } else {
                      setNewProduct({ ...newProduct, name: e.target.value });
                    }
                  }}
                  className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={
                    editProduct
                      ? editProduct.description
                      : newProduct.description
                  }
                  onChange={(e) => {
                    if (editProduct) {
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      });
                    } else {
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      });
                    }
                  }}
                  className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editProduct ? editProduct.price : newProduct.price}
                  onChange={(e) => {
                    if (editProduct) {
                      setEditProduct({ ...editProduct, price: e.target.value });
                    } else {
                      setNewProduct({ ...newProduct, price: e.target.value });
                    }
                  }}
                  className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={
                    editProduct ? editProduct.image_url : newProduct.image_url
                  }
                  onChange={(e) => {
                    if (editProduct) {
                      setEditProduct({
                        ...editProduct,
                        image_url: e.target.value,
                      });
                    } else {
                      setNewProduct({
                        ...newProduct,
                        image_url: e.target.value,
                      });
                    }
                  }}
                  className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />

                {/* Mengubah input kategori menjadi select */}
                <select
                  value={
                    editProduct ? editProduct.category : newProduct.category
                  }
                  onChange={(e) => {
                    if (editProduct) {
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      });
                    } else {
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                      });
                    }
                  }}
                  className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="">Select Category</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="running">Running</option>
                  <option value="basketball">Basketball</option>
                  <option value="football">Football</option>
                  <option value="gym and training">Gym and Training</option>
                </select>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={editProduct ? handleEditProduct : handleAddProduct}
                  className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-sky-600 hover:to-sky-800"
                >
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
                <button
                  onClick={() => {
                    setEditProduct(null);
                    setShowProductModal(false);
                  }}
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stock Modal */}
        {showStockModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-sky-200 bg-opacity-70">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl">
              <h3 className="text-2xl font-bold text-sky-700 mb-4 text-center">
                Add Sizes and Stock
              </h3>
              <div className="mt-4 space-y-4">
                {sizes.map((size, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Size"
                      value={size.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                      className="w-1/2 border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeChange(index, "stock", e.target.value)
                      }
                      className="w-1/2 border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                ))}
                <button
                  onClick={addSizeInput}
                  className="w-full mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-700"
                >
                  Add Size
                </button>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleAddSizeStock}
                  className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-sky-600 hover:to-sky-800"
                >
                  Save Sizes and Stock
                </button>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Stock Modal */}
        {showEditStockModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-sky-200 bg-opacity-70">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl">
              <h3 className="text-2xl font-bold text-sky-700 mb-4 text-center">
                Edit Sizes and Stock
              </h3>
              <div className="mt-4 space-y-4">
                {editStock.map((stock, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Size"
                      value={stock.size}
                      onChange={(e) =>
                        handleEditSizeChange(index, "size", e.target.value)
                      }
                      className="w-1/2 border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stock.stock}
                      onChange={(e) =>
                        handleEditSizeChange(index, "stock", e.target.value)
                      }
                      className="w-1/2 border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                      onClick={() => handleDeleteStock(productId, stock.size)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-2 py-1 rounded shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={addEditSizeInput}
                  className="w-full mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-700"
                >
                  Add Size
                </button>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleEditStock}
                  className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-sky-600 hover:to-sky-800"
                >
                  Save Sizes and Stock
                </button>
                <button
                  onClick={() => setShowEditStockModal(false)}
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Modal */}
        {showAddAdminModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <h3 className="text-xl font-semibold">Add New Admin Account</h3>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newAdmin.username}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, username: e.target.value })
                  }
                  className="border rounded p-2 mb-2 w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="border rounded p-2 mb-2 w-full"
                />
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, role: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddAdmin}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Admin
                </button>
                <button
                  onClick={() => setShowAddAdminModal(false)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
