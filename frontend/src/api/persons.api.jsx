import api from "./axios";

// GET all persons
export const getPersons = async () => {
  const res = await api.get("/persons");
  return res.data;
};

// CREATE new person
export const createPerson = async (payload) => {
  const res = await api.post("/persons", payload);
  return res.data;
};

// UPDATE person
export const updatePerson = async (personId, payload) => {
  const res = await api.put(`/persons/${personId}`, payload);
  return res.data;
};