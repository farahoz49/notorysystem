import api from "./axios";

export const getWakaalads = async () => {
  const res = await api.get("/wakaalads");
  return res.data;
};

export const createWakaalad = async (payload) => {
  const res = await api.post("/wakaalads", payload);
  return res.data;
};

export const updateWakaalad = async (id, payload) => {
  const res = await api.put(`/wakaalads/${id}`, payload);
  return res.data;
};

export const deleteWakaalad = async (id) => {
  const res = await api.delete(`/wakaalads/${id}`);
  return res.data;
};