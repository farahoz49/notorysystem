import api from "./axios";

// helper: update agreement partial
const updateAgreement = async (agreementId, payload) => {
  const res = await api.put(`/agreements/${agreementId}`, payload);
  return res.data;
};

// LINK doc to specific agent inside dhinac1/dhinac2
export const linkAgentDocument = async ({
  agreementId,
  agreementSnapshot,
  side = "dhinac1",
  agentId,
  docType, // "Wakaalad" | "Tasdiiq"
  docId,
}) => {
  const current = agreementSnapshot?.[side] || {};
  const agentDocuments = current.agentDocuments || {};
  const existing = agentDocuments[agentId] || {};
  const field = docType === "Wakaalad" ? "wakaalad" : "tasdiiq";

  const updatedAgentDocs = {
    ...agentDocuments,
    [agentId]: { ...existing, [field]: docId },
  };

  return updateAgreement(agreementId, {
    [side]: {
      ...current,
      agentDocuments: updatedAgentDocs,
    },
  });
};

// UNLINK doc from agent
export const unlinkAgentDocument = async ({
  agreementId,
  agreementSnapshot,
  side = "dhinac1",
  agentId,
  docType, // "Wakaalad" | "Tasdiiq"
}) => {
  const current = agreementSnapshot?.[side] || {};
  const agentDocuments = { ...(current.agentDocuments || {}) };
  const existing = agentDocuments[agentId] || {};
  const field = docType === "Wakaalad" ? "wakaalad" : "tasdiiq";

  if (existing) {
    const updated = { ...existing };
    delete updated[field];

    if (Object.keys(updated).length === 0) delete agentDocuments[agentId];
    else agentDocuments[agentId] = updated;
  }

  return updateAgreement(agreementId, {
    [side]: {
      ...current,
      agentDocuments,
    },
  });
};