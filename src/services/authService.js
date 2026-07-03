import API from "../api/axios";

const authService = {
  async register(name, email, phone, password) {
    const response = await API.post("/auth/register", {
      name,
      email,
      phone: Number(phone), // Backend converts this to a Number in mongoose schema
      password,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await API.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    // Clear cookies if the browser lets us, or let the browser clear cookies upon redirection
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

export default authService;
