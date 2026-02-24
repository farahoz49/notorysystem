// src/utils/GW.js

const isF = (gender = "male") =>
  String(gender).toLowerCase() === "female";

export const GW = (gender = "male") => {
  const female = isF(gender);

  return {
    // ================= VERBS =================
    dhalasho: female ? "ku dhalatay" : "ku dhashay",
    lived: "degan",
    said: female ? "tiri" : "yiri",

    // ================= RELATIONS =================
    hooyo: female ? "hooyadeedna" : "hooyadiisna",
    caafimaad: female ? "qabta" : "qaba",

    // ================= ROLES =================
    buyer: female ? "iibsato" : "iibsade",
    seller: female ? "iska iibisato" : "iska iibiyaha",
  };
};