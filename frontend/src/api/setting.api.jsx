import api from "./axios";

/* =========================
   GET SETTINGS
   ========================= */
export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};


/* =========================
   INIT SETTINGS (create default haddii uusan jirin)
   ========================= */
export const initSettings = async () => {
  const res = await api.post("/settings/init");
  return res.data;
};


/* =========================
   UPDATE SETTINGS
   ========================= */
export const updateSettings = async (payload) => {
  const res = await api.put("/settings", payload);
  return res.data;
};


/* =========================
   INCREMENT REF NO
   ========================= */
export const getNextRefNo = async () => {
  const res = await api.put("/settings/refno/next");
  return res.data;
};


/* =========================
   INCREMENT RECEIPT NO
   ========================= */
export const getNextReceiptNo = async () => {
  const res = await api.put("/settings/receipt/next");
  return res.data;
};


/* =========================
   DELETE SETTINGS (optional)
   ========================= */
export const deleteSettings = async () => {
  const res = await api.delete("/settings");
  return res.data;
};