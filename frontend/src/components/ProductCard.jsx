import React from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const ProductCard = ({ product }) => {
  return (
    <div
      className="glass"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        transition: "var(--transition-smooth)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.35)";
        e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(0, 242, 254, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-light)";
        e.currentTarget.style.boxShadow = "var(--shadow-main)";
      }}
    >
      {/* Category badge */}
      <span
        className="badge badge-blue"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 2,
          backdropFilter: "blur(4px)",
        }}
      >
        {product.category}
      </span>

      {/* Product Image */}
      <div
        style={{
          height: "240px",
          width: "100%",
          overflow: "hidden",
          background: "#0d1222",
          position: "relative",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      {/* Product Details */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Link to={`/product/${product._id}`}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              lineHeight: 1.3,
              height: "2.6em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Stock Badge */}
        <div style={{ marginBottom: "1rem" }}>
          {product.countInStock > 0 ? (
            <span className="badge badge-green">In Stock</span>
          ) : (
            <span className="badge badge-red">Out Of Stock</span>
          )}
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
            height: "3em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </p>

        {/* Price & Action */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            ${product.price.toFixed(2)}
          </span>

          <Link
            to={`/product/${product._id}`}
            className="btn btn-primary"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
            }}
          >
            Details
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
