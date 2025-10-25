import api from "./axios";

export const fetchUserProfile = async () => {
  try {
    const res = await api.get("/user/profile");
    return res.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/user/login";
};

export const setPageTitle = (title) => {
  document.title = `${title} | BiryaniRide`;
};
