// src/api/reports.api.js
import api from "./axios";

export const getAgreementsReportApi = async (params) => {
  const { data } = await api.get("/agreements/reports/agreements", { params });
  return data; // { rows, totals }
};