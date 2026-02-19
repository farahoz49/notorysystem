import api from "./axios";

export const getTasdiiqs = async () => {
  const res = await api.get("/tasdiiqs");
  return res.data;
};

export const createTasdiiq = async (payload) => {
  const res = await api.post("/tasdiiqs", payload);
  return res.data;
};

export const updateTasdiiq = async (id, payload) => {
  const res = await api.put(`/tasdiiqs/${id}`, payload);
  return res.data;
};

export const deleteTasdiiq = async (id) => {
  const res = await api.delete(`/tasdiiqs/${id}`);
  return res.data;
};