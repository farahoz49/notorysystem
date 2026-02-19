import api from "./axios";

/**
 * Helper:
 * - persons list can be populated objects OR ids
 */
const normalizeId = (p) => (typeof p === "object" ? (p?._id || "") : String(p || ""));
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

export const addPersonToAgreement = async ({
  agreementId,
  side, // "dhinac1" | "dhinac2"
  role, // "sellers" | "buyers" | "agents"
  personId,
  agreementSnapshot, // agreement object (current state)
}) => {
  const currentSide = agreementSnapshot?.[side] || {};
  const currentList = currentSide?.[role] || [];

  const ids = currentList.map(normalizeId);
  const updatedIds = uniq([...ids, String(personId)]);

  const payload = {
    [side]: {
      ...currentSide,
      [role]: updatedIds,
    },
  };

  const res = await api.put(`/agreements/${agreementId}`, payload);
  return res.data;
};

export const removePersonFromAgreement = async ({
  agreementId,
  side,
  role,
  personId,
  agreementSnapshot,
}) => {
  const currentSide = agreementSnapshot?.[side] || {};
  const currentList = currentSide?.[role] || [];

  const ids = currentList.map(normalizeId);
  const updatedIds = ids.filter((id) => id !== String(personId));

  const payload = {
    [side]: {
      ...currentSide,
      [role]: updatedIds,
    },
  };

  const res = await api.put(`/agreements/${agreementId}`, payload);
  return res.data;
};