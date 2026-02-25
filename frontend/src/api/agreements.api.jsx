import api from "./axios";

// Get all agreements
export const getAgreements = async (params = {}) => {
  const res = await api.get("/agreements", { params });
  return res.data;
};

// ✅ Get current month agreements only (DB load yar)
export const getAgreementsCurrentMonth = async () => {
  const res = await api.get("/agreements/current-month");
  return res.data;
};

// ✅ Dashboard current month (stats + latest + serviceData)
export const getDashboardCurrentMonth = async () => {
  const res = await api.get("/agreements/dashboard/current-month");
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