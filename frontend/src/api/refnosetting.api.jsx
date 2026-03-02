import api from "./axios";

// ✅ GET settings (ADMIN)
export const getRefNoSettings = async () => {
  const res = await api.get("/agreements/refno/settings");
  return res.data; // { key, startNumber, refNo }
};

// ✅ UPDATE startNumber (ADMIN)
export const updateRefNoStartNumber = async (startNumber) => {
  const res = await api.put("/agreements/refno/start", { startNumber });
  return res.data; // { message, startNumber, refNo }
};