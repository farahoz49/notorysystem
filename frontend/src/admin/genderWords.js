const g = (gender = "male") => String(gender).toLowerCase() === "female";

export const GW = (gender) => ({
  // verbs
  born: g(gender) ? "ku dhalatay" : "ku dhashay",
  lived: "degan", // lab/dhedig isku mid
  said: g(gender) ? "tiri" : "yiri", // haddii aad u baahato

  // pronouns / relations
  motherOf: g(gender) ? "hooyadeed" : "hooyadiis",
  fatherOf: g(gender) ? "aabaheed" : "aabihiis",

  // “ah” label (badanaa isku mid)
  is: "ah",

  // role words (haddii aad rabto)
  buyer: g(gender) ? "iibsato" : "iibsade",
  seller: g(gender) ? "iska iibisato" : "iska iibiyaha",
});
