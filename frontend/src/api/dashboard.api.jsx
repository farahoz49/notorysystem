// src/api/dashboard.api.jsx
import api from "./axios";

// ✅ dashboard current month (totals + serviceData + latest + month)
export const getDashboardCurrentMonthApi = async () => {
  const res = await api.get("/agreements/dashboard/current-month");
  return res.data;
};

// ✅ agreements current month (full agreements list haddii aad u baahato)
export const getAgreementsCurrentMonthApi = async () => {
  const res = await api.get("/agreements/current-month");
  return res.data;
};