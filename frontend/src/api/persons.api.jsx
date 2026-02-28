import api from "./axios";

// GET all persons
export const getPersons = async () => {
  const res = await api.get("/persons");
  return res.data;
};

// CREATE new person
export const createPerson = async (payload) => {
  const res = await api.post("/persons", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// UPDATE person
export const updatePerson = async (personId, payload) => {
  const res = await api.put(`/persons/${personId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
// GET all nationalities
export const getNationalities = async () => {
  const res = await api.get("/nationalities");
  return res.data;
};

// CREATE new nationality
export const createNationality = async (name) => {
  const res = await api.post("/nationalities", { name });
  return res.data;
};

// DELETE nationality (optional haddii admin only)
export const deleteNationality = async (id) => {
  const res = await api.delete(`/nationalities/${id}`);
  return res.data;
};