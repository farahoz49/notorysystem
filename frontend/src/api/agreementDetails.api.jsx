// src/api/agreementDetails.api.jsx
import api from "./axios";

// serviceType -> endpoint
const endpointMap = {
  Mooto: "/mootos",
  baabuur: "/baabuur",
  DhulBanaan: "/dhul-banaan",
  Wakaalad_Gaar_ah: "/Wakaalad_Gaar_ah",
  Saami: "/saamis",
};

const normalize = (res) => res?.data?.data || res?.data || null;

export const getAgreementById = async (id) => {
  const res = await api.get(`/agreements/${id}`);
  return normalize(res);
};

export const getServiceByAgreement = async (agreement) => {
  if (!agreement?.serviceRef) return null;

  // haddii populate already (object)
  if (typeof agreement.serviceRef === "object" && agreement.serviceRef?._id) {
    return agreement.serviceRef;
  }

  const endpoint = endpointMap[agreement.serviceType];
  if (!endpoint) return null;

  const serviceId = agreement.serviceRef; // string ObjectId
  const res = await api.get(`${endpoint}/${serviceId}`);
  return normalize(res);
};

// ✅ hal function oo kuu soo celinaya agreement + service
export const getAgreementWithService = async (id) => {
  const agreement = await getAgreementById(id);
  const serviceData = await getServiceByAgreement(agreement);
  return { agreement, serviceData };
};