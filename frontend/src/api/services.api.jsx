import api from "./axios";

// map serviceType -> endpoint
const serviceEndpointMap = {
  Mooto: "/mootos",
  baabuur: "/baabuur",
  DhulBanaan: "/dhul-banaan",
  GuriDhisan: "/GuriDhisan",
  Wakaalad_Gaar_ah: "/Wakaalad_Gaar_ah",
  Saami: "/saamis",
  Wakaalad_Saami: "/wakaalad-saami",
  Daaminulmaal: "/daaminulmaal", // ✅ NEW
  Shaqaaleysiin: "/Shaqaaleysiin", // ✅ NEW
  XayiraadSaami: "/XayiraadSaami", // ✅ NEW
  asasidshirkad: "/asasidshirkad", // ✅ NEW
  Sponsorship: "/Sponsorship", // ✅ NEW
  Kireeyn: "/Kireeyn", // ✅ NEW

};

const getEndpoint = (serviceType) => serviceEndpointMap[serviceType] || "";

const normalize = (res) => res?.data?.data || res?.data || null;

export const createService = async (serviceType, payload) => {
  const endpoint = getEndpoint(serviceType);
  if (!endpoint) throw new Error("ServiceType endpoint ma jiro");

  const res = await api.post(endpoint, payload);
  const created = normalize(res);

  if (!created?._id) throw new Error("Service lama helin _id");

  return created;
};

export const updateService = async (serviceType, serviceId, payload) => {
  const endpoint = getEndpoint(serviceType);
  if (!endpoint) throw new Error("ServiceType endpoint ma jiro");
  if (!serviceId) throw new Error("Service ID ma jiro");

  const res = await api.put(`${endpoint}/${serviceId}`, payload);
  return normalize(res);
};

export const deleteService = async (serviceType, serviceId) => {
  const endpoint = getEndpoint(serviceType);
  if (!endpoint) throw new Error("ServiceType endpoint ma jiro");
  if (!serviceId) throw new Error("Service ID ma jiro");

  await api.delete(`${endpoint}/${serviceId}`);
  return true;
};