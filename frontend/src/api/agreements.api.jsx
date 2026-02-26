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

// ✅ Remove image url (requires backend endpoint below)
export const removeAgreementImage = async (agreementId, imageUrl) => {
  const res = await api.patch(`/agreements/${agreementId}/images/remove`, {
    imageUrl,
  });
  return res.data;
};
// ✅ Upload images (multipart) -> returns { urls: [] }
export const uploadAgreementImages = async (agreementId, files = []) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));

  const res = await api.post(
    `/agreements/${agreementId}/images/upload`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data; // { urls: [...] }
};

// ✅ Save meta (url + description) -> saves into DB
export const saveAgreementImageMeta = async (agreementId, payload) => {
  // payload: { url, description }
  const res = await api.post(`/agreements/${agreementId}/images/meta`, payload);
  return res.data;
};

// ✅ Delete image by imageId
export const deleteAgreementImage = async (agreementId, imageId) => {
  const res = await api.delete(`/agreements/${agreementId}/images/${imageId}`);
  return res.data;
};