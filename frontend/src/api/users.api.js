// src/api/users.api.js
import api from "./axios"; // <-- adiga waxaad leedahay src/api/axios.jsx (haddii path ka duwan yahay, sax)

const BASE = "/users";

export const getUsers = async (params = {}) => {
  const res = await api.get(`${BASE}`, { params });
  return res.data; // { data, pagination?, message? }
};

export const registerUser = async (payload) => {
  const res = await api.post(`${BASE}/registerUser`, payload);
  return res.data;
};

export const updateUserById = async (id, payload) => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
};

export const deleteUserById = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};

export const approveUserById = async (id) => {
  const res = await api.put(`${BASE}/approve/${id}`, {});
  return res.data;
};

export const deactivateUserById = async (id) => {
  const res = await api.put(`${BASE}/inactive/${id}`, {});
  return res.data;
};
// src/api/users.api.js


export const getAllUsersApi = async () => {
  const { data } = await api.get("/users"); // hubi route-kaaga saxda ah
  // haddii response uu yahay {success:true,data:[...]}
  return data?.data || [];
};