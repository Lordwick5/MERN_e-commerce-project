import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { API_URL } from "../config";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!product) return <div className="alert alert-error">Product not found</div>;

  return (
    <div className="animate-fade-in">
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: "2rem" }}>
        ← Back to Catalog
      </Link>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Left Side: Product Image */}
        <div
          className="glass"
          style={{ overflow: "hidden", padding: "1rem", border: "1px solid var(--border-light)" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
          />
        </div>

        {/* Right Side: Product Details & Cart Box */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <span
              className="badge badge-blue"
              style={{ marginBottom: "1rem", display: "inline-block" }}
            >
              {product.category}
            </span>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}
            >
              <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-color)" }}>
                ${product.price.toFixed(2)}
              </span>
              {product.countInStock > 0 ? (
                <span className="badge badge-green">In Stock</span>
              ) : (
                <span className="badge badge-red">Out of Stock</span>
              )}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.6 }}>
              {product.description}
            </p>
          </div>

          {/* Add to Cart Glass Panel */}
          <div
            className="glass"
            style={{ padding: "2rem", border: "1px solid var(--border-light)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "1rem",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Price:</span>
              <strong>${product.price.toFixed(2)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                alignItems: "center",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Status:</span>
              <span style={{ fontWeight: 600 }}>
                {product.countInStock > 0 ? "Available" : "Unavailable"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="form-input"
                  style={{ width: "80px", padding: "0.4rem 0.8rem", background: "#0d1222" }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className={`btn btn-primary ${product.countInStock === 0 ? "btn-disabled" : ""}`}
              disabled={product.countInStock === 0}
              style={{ width: "100%", padding: "1rem" }}
            >
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
