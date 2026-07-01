import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
