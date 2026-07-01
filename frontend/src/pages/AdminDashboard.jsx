import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  // Tabs: 'products' or 'orders'
  const [activeTab, setActiveTab] = useState("products");

  // Products manager states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState("");

  // Orders manager states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Status/Error notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const clearForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImage("");
    setCountInStock("");
  };

  const handleEditSelect = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
    setCountInStock(product.countInStock);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const productPayload = {
      name,
      price: Number(price),
      description,
      category,
      image:
        image ||
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop", // default image
      countInStock: Number(countInStock),
    };

    try {
      let url = `${API_URL}/products`;
      let method = "POST";

      if (editingProduct) {
        url = `${API_URL}/products/${editingProduct._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg(
        editingProduct ? "Product updated successfully!" : "Product created successfully!",
      );
      clearForm();
      fetchProducts();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleMarkAsDelivered = async (id) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/orders/${id}/deliver`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg("Order updated to Delivered!");
      fetchOrders();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Admin <span className="text-gradient-cyan">Dashboard</span>
      </h1>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("products")}
          className={`btn ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-secondary"}`}
        >
          Track Customer Orders
        </button>
      </div>

      {/* TABS VIEW CONTROLLER */}
      {activeTab === "products" ? (
        <div
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "2rem" }}
          className="grid-2"
        >
          {/* Left Panel: Create / Edit Product Form */}
          <div
            className="glass"
            style={{
              padding: "2rem",
              height: "fit-content",
              border: "1px solid var(--border-light)",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="price">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="countInStock">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    id="countInStock"
                    className="form-input"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="e.g. Keyboards, Audio"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="image">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  placeholder="Unsplash / external image link"
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-input"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button type="button" className="btn btn-secondary" onClick={clearForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Panel: Product List */}
          <div
            className="glass"
            style={{ padding: "2rem", border: "1px solid var(--border-light)" }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Products Inventory
            </h2>

            {loadingProducts ? (
              <div className="spinner" />
            ) : products.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No products found in database.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  maxHeight: "600px",
                  overflowY: "auto",
                  paddingRight: "0.5rem",
                }}
              >
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        background: "#0d1222",
                      }}
                    />
                    <div style={{ flexGrow: 1, overflow: "hidden" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prod.name}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        Price: <strong>${prod.price.toFixed(2)}</strong> | Stock:{" "}
                        <strong>{prod.countInStock}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditSelect(prod)}
                        className="btn btn-secondary"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="btn btn-danger"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TRACK CUSTOMER ORDERS VIEW */
        <div className="glass" style={{ padding: "2rem", border: "1px solid var(--border-light)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            Customer Orders List
          </h2>

          {loadingOrders ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No orders placed yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <th style={{ padding: "1rem" }}>ORDER ID</th>
                    <th style={{ padding: "1rem" }}>CUSTOMER</th>
                    <th style={{ padding: "1rem" }}>DATE</th>
                    <th style={{ padding: "1rem" }}>TOTAL</th>
                    <th style={{ padding: "1rem" }}>PAID</th>
                    <th style={{ padding: "1rem" }}>DELIVERED</th>
                    <th style={{ padding: "1rem" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr
                      key={ord._id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        fontSize: "0.95rem",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          fontFamily: "monospace",
                          color: "var(--accent-color)",
                        }}
                      >
                        {ord._id}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {ord.user ? ord.user.name : "Unknown User"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>
                        ${ord.totalPrice.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {ord.isPaid ? (
                          <span className="badge badge-green">Paid</span>
                        ) : (
                          <span className="badge badge-red">Unpaid</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {ord.isDelivered ? (
                          <span className="badge badge-green">Delivered</span>
                        ) : (
                          <span className="badge badge-red">Pending</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {ord.isPaid && !ord.isDelivered && (
                          <button
                            onClick={() => handleMarkAsDelivered(ord._id)}
                            className="btn btn-primary"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                          >
                            Deliver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
