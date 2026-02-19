import api from "./axios";

/**
 * Update witnesses array for an agreement
 */
export const updateAgreementWitnesses = async (agreementId, witnesses = []) => {
  const res = await api.put(`/agreements/${agreementId}`, { witnesses });
  return res.data;
};

/**
 * Helpers (optional) - convenient functions
 */
export const addWitness = async (agreementId, currentWitnesses = [], witnessName = "") => {
  const name = String(witnessName || "").trim();
  if (!name) throw new Error("Enter witness name");

  const updated = [...(currentWitnesses || []), name];
  await updateAgreementWitnesses(agreementId, updated);
  return updated;
};

export const updateWitnessAt = async (agreementId, currentWitnesses = [], index, newName = "") => {
  const name = String(newName || "").trim();
  if (!name) throw new Error("Enter witness name");

  const updated = [...(currentWitnesses || [])];
  if (index < 0 || index >= updated.length) throw new Error("Invalid witness index");

  updated[index] = name;
  await updateAgreementWitnesses(agreementId, updated);
  return updated;
};

export const deleteWitnessAt = async (agreementId, currentWitnesses = [], index) => {
  const updated = [...(currentWitnesses || [])];
  if (index < 0 || index >= updated.length) throw new Error("Invalid witness index");

  updated.splice(index, 1);
  await updateAgreementWitnesses(agreementId, updated);
  return updated;
};