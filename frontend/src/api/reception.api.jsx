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
// src/api/reception.api.js
import axios from "./axios"; // ama meesha axios instance-kaaga yaal

export const getAgreements = async ({
  range = "all",
  page = 1,
  limit = 10,
  searchBy = "",
  searchText = "",
} = {}) => {
  const res = await axios.get("/agreements", {
    params: { range, page, limit, searchBy, searchText },
  });
  return res.data; // { meta, data }
};
export const searchAgreements = async ({
  range = "all",
  page = 1,
  limit = 10,
  searchBy = "refNo",
  searchText = "",
} = {}) => {
  const res = await axios.get("/agreements/search", {
    params: { range, page, limit, searchBy, searchText },
  });
  return res.data; // { meta, data }
};