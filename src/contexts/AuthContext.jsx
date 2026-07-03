import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext();

// Utility to decode JWT token in frontend
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login state on load
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.id) {
          // Check if we have cached profile details
          const cachedUser = localStorage.getItem(`user_profile_${decoded.id}`);
          let parsedUser = cachedUser ? JSON.parse(cachedUser) : null;
          
          if (!parsedUser) {
            // Load credentials stored during registration or set fallback
            const registerEmail = localStorage.getItem(`register_email_${decoded.id}`);
            const registerName = localStorage.getItem(`register_name_${decoded.id}`) || "AI Chat User";
            const registerPhone = localStorage.getItem(`register_phone_${decoded.id}`) || "9999999999";
            
            parsedUser = {
              id: decoded.id,
              name: registerName,
              email: registerEmail || "user@example.com",
              phone: registerPhone,
            };
          }

          // Fetch merged profile (if any updates were made locally)
          const merged = userService.getMergedProfile(decoded.id, parsedUser);
          setUser(merged);
        } else {
          // Token is invalid/expired
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Update user profile locally
  const updateProfile = async (updateData) => {
    if (!user) return;
    const result = await userService.updateProfile(user.id, updateData);
    if (result.success) {
      const updatedUser = { ...user, ...result.user };
      setUser(updatedUser);
      localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(updatedUser));
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return;
    return await userService.changePassword(user.id, currentPassword, newPassword);
  };

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        
        const decoded = decodeToken(data.token);
        const userId = decoded?.id || "temp_id";

        // Create login details
        const loggedUser = {
          id: userId,
          name: localStorage.getItem(`register_name_${userId}`) || "AI Chat User",
          email: email,
          phone: localStorage.getItem(`register_phone_${userId}`) || "9999999999",
        };

        setUser(loggedUser);
        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(loggedUser));
        
        return { success: true };
      }
      return { success: false, message: data.massage || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.massage || error.message || "Invalid credentials";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, phone, password);
      if (data.token) {
        // Automatically sign in (use sessionStorage by default)
        sessionStorage.setItem("token", data.token);
        
        const decoded = decodeToken(data.token);
        const userId = decoded?.id || "temp_id";

        // Save registration data for lookup
        localStorage.setItem(`register_name_${userId}`, name);
        localStorage.setItem(`register_email_${userId}`, email);
        localStorage.setItem(`register_phone_${userId}`, phone);

        const newUser = {
          id: userId,
          name,
          email,
          phone,
        };

        setUser(newUser);
        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(newUser));

        return { success: true };
      }
      return { success: false, message: data.massage || "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.massage || error.message || "Registration failed";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Helper method to let chat contexts enrich user profile with backend data once posts are fetched
  const enrichUserProfile = (fetchedUser) => {
    if (user && user.id === fetchedUser._id) {
      if (user.name === "AI Chat User" && fetchedUser.name !== "AI Chat User") {
        const enriched = {
          ...user,
          name: fetchedUser.name,
          email: fetchedUser.email,
          phone: fetchedUser.phone
        };
        setUser(enriched);
        localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(enriched));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        enrichUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
