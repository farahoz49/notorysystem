// src/api/reception.api.jsx
import api from "./axios";

/**
 * 🧾 RECEPTION API
 * - Persons
 * - Agreements
 */

// ================= PERSONS =================

// Get all persons
export const getPersons = async (params = {}) => {
  const res = await api.get("/persons", { params });
  return res.data;
};

// Create new person
export const createPerson = async (data) => {
  const res = await api.post("/persons", data);
  return res.data;
};

// ================= AGREEMENTS =================

// Get next ref no
export const getNextRefNo = async () => {
  const res = await api.get("/agreements/next/refno");
  return res.data; // { refNo: "..." }
};

// Create agreement
export const createAgreement = async (data) => {
  const res = await api.post("/agreements", data);
  return res.data; // agreement object { _id, ... }
};

// Get agreement by id (optional haddii aad u baahan tahay details page)
export const getAgreementById = async (id) => {
  const res = await api.get(`/agreements/${id}`);
  return res.data;
};

// Get agreements list (optional)
export const getAgreements = async (params = {}) => {
  const res = await api.get("/agreements", { params });
  return res.data;
};
export const getMissingRefNos = async (year) => {
  const res = await api.get("/agreements/missing-refnos", { params: { year } });
  return res.data;
};