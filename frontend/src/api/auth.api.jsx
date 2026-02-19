import api from "./axios";

// ✅ LOGIN
export const loginRequest = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

// ✅ LOGOUT
export const logoutRequest = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};

// ✅ LOAD USER (REFRESH FIX)
export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};


export const forgotPasswordApi = async (payload) => {
  const { data } = await api.post("users/forgot-password", payload);
  return data;
};
export const resetPasswordApi = async (token, password) => {
  const { data } = await api.post(`users/reset-password/${token}`, {
    password, // ama newPassword haddii backend-kaaga sidaas u magacaabay
  });
  return data;
};
