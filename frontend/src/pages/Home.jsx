import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Banner Section */}
      <div
        className="glass"
        style={{
          padding: "3rem 2rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(0,242,254,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <h1
          style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-1px" }}
        >
          Equip Your <span className="text-gradient-cyan">Battle Station</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          Explore next-generation keyboards, premium audio gear, curved monitors, and precision mice
          to level up your work and play.
        </p>

        {/* Search & Filter Controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            maxWidth: "700px",
            margin: "0 auto",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search products..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flexGrow: 1, minWidth: "250px" }}
          />

          <select
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: "200px", cursor: "pointer" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(search || categoryFilter) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
              }}
              style={{ padding: "0.8rem 1.2rem" }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>Available Hardware</span>
        <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 400 }}>
          ({filteredProducts.length} items)
        </span>
      </h2>

      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass" style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            No products match your search/filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
