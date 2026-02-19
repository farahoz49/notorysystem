import api from "./axios";

// Get all agreements
export const getAgreements = async (params = {}) => {
  const res = await api.get("/agreements", { params });
  return res.data;
};

// Delete agreement
export const deleteAgreement = async (id) => {
  const res = await api.delete(`/agreements/${id}`);
  return res.data;
};
  // Update agreement
export const updateAgreement = async (id, formData) => {
  const res = await api.put(`/agreements/${id}`, formData);
  return res.data;
};
