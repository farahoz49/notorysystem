import api from "./axios";

export const updateAgreement = async (agreementId, payload) => {
  const res = await api.put(`/agreements/${agreementId}`, payload);
  return res.data;
};

export const linkServiceToAgreement = async (agreementId, serviceId) => {
  return updateAgreement(agreementId, { serviceRef: serviceId });
};

export const unlinkServiceFromAgreement = async (agreementId) => {
  return updateAgreement(agreementId, { serviceRef: null });
};