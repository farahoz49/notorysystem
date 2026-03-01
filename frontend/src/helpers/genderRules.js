const clean = (v = "") => String(v).trim().toLowerCase();

/** 1) Gender rules (male -> female) */
const genderRules = [
  ["iska iibiyaha", "iska iibisada"],
  ["iibsadaha", "iibsatada"],
  ["hibeyaha", "hibeyada"],
  ["loo hibeeyaha", "loo hibeeyada"],
  ["waqfaha", "waqfada"],
  ["loo waqfaha", "loo waqfada"],
  ["wakiilka", "wakiilada"], // haddii aad rabto female form
];

/** 2) applyGender: haddii female -> erayada beddel */
const applyGender = (title = "", gender = "male") => {
  const g = clean(gender);
  let out = clean(title);

  if (g !== "female") return out; // male -> sida uu yahay

  for (const [maleWord, femaleWord] of genderRules) {
    if (out.includes(maleWord)) {
      out = out.replaceAll(maleWord, femaleWord);
    }
  }
  return out;
};

// ✅ plural helper (1 qof -> singular, 2+ -> plural)
const pluralizeTitle = (title = "", count = 1) => {
  if (count <= 1) return title;

  const rules = [
    ["iska iibiyaha", "iska iibiyayaasha"],
    ["iska iibisada", "iska iibisadayaasha"],

    ["iibsadaha", "iibsadayaasha"],
    ["iibsadada", "iibsadayaasha"],

    ["hibeyaha", "hibeyayaasha"],
    ["hibeyada", "hibeyayaasha"],

    ["loo hibeeyaha", "loo hibeeyaasha"],
    ["loo hibeeyada", "loo hibeeyaasha"],

    ["waqfaha", "waqfayaasha"],
    ["waqfada", "waqfayaasha"],

    ["loo waqfaha", "loo waqfayaasha"],
    ["loo waqfada", "loo waqfayaasha"],

    ["wakiilka", "wakiillada"],
    ["wakiilada", "wakiillada"],
  ];

  let out = clean(title);
  for (const [sing, plur] of rules) {
    if (out.includes(sing)) out = out.replaceAll(sing, plur);
  }
  return out;
};

const titlesByService = {
  saami: {
    hibo: {
      seller: "hibeyaha saamiga",
      buyer: "loo hibeehaha saamiga",
      sellerAgent: "wakiilka hibeyaha saamiga:",
      buyerAgent: "hibo u aqbalaha loo hibeehaha saamiga",
    },
    beec: {
      seller: "iska iibiyaha saamiga",
      buyer: "iibsadaha saamiga",
      sellerAgent: "wakiilka iska iibiyaha saamiga:",
      buyerAgent: "beec u aqbalaha iibsadaha saamiga",
    },
    waqaf: {
      seller: "waqfaha saamiga",
      buyer: "loo waqfaha saamiga",
      sellerAgent: "wakiilka waqfaha saamiga:",
      buyerAgent: "waqaf u aqbalaha loo waqfaha saamiga",
    },
  },

  dhulbanaan: {
    hibo: {
      seller: "hibeyaha dhulka",
      buyer: "loo hibeehaha dhulka",
      sellerAgent: "wakiilka hibeyaha dhulka:",
      buyerAgent: "hibo u aqbalaha loo hibeehaha dhulka",
    },
    beec: {
      seller: "iska iibiyaha dhulka",
      buyer: "iibsadaha dhulka",
      sellerAgent: "wakiilka iska iibiyaha dhulka:",
      buyerAgent: "beec u aqbalaha iibsadaha dhulka",
    },
    waqaf: {
      seller: "waqfaha dhulka",
      buyer: "loo waqfaha dhulka",
      sellerAgent: "wakiilka waqfaha dhulka:",
      buyerAgent: "waqaf u aqbalaha loo waqfaha dhulka",
    },
  },

  mooto: {
    hibo: {
      seller: "hibeyaha mootada",
      buyer: "loo hibeeyaha mootada",
      sellerAgent: "wakiilka hibeyaha mootada:",
      buyerAgent: "hibo u aqbalaha loo hibeehaha mootada",
    },
    beec: {
      seller: "iska iibiyaha mootada",
      buyer: "iibsadaha mootada",
      sellerAgent: "wakiilka iska iibiyaha mootada:",
      buyerAgent: "beec u aqbalaha iibsadaha mootada",
    },
    waqaf: {
      seller: "waqfaha mootada",
      buyer: "loo waqfaha mootada",
      sellerAgent: "wakiilka waqfaha mootada:",
      buyerAgent: "waqaf u aqbalaha loo waqfaha mootada",
    },
  },

  baabuur: {
    hibo: {
      seller: "hibeyaha baabuurka",
      buyer: "loo hibeehaha baabuurka",
      sellerAgent: "wakiilka hibeyaha baabuurka:",
      buyerAgent: "hibo u aqbalaha loo hibeehaha baabuurka",
    },
    beec: {
      seller: "iska iibiyaha baabuurka",
      buyer: "iibsadaha baabuurka",
      sellerAgent: "wakiilka iska iibiyaha baabuurka:",
      buyerAgent: "beec u aqbalaha iibsadaha baabuurka",
    },
    waqaf: {
      seller: "waqfaha baabuurka",
      buyer: "loo waqfaha baabuurka",
      sellerAgent: "wakiilka waqfaha baabuurka:",
      buyerAgent: "waqaf u aqbalaha loo waqfaha baabuurka",
    },
  },
  Wakaalad_Gaar_ah: {
  bixisada: {
    // qofka bixinaya wakaaladda
    seller: "wakaalad bixiyaha",
    // qofka la wakiilanayo
    buyer: "la wakiishaha",

    // wakiillo (haddii dhinacyada ay wakiillo kale ku saxiixayaan)
    sellerAgent: "wakiilka wakaalad bixiyaha:",
    buyerAgent: "wakiilka la wakiishaha",
  },

  // haddii aad leedahay nooc kale (optional)
  la_wakiishaha: {
    seller: "wakaalad bixiyaha",
    buyer: "la wakiishaha",
    sellerAgent: "wakiilka wakaalad bixiyaha:",
    buyerAgent: "wakiilka la wakiishaha",
  },
},
};

/**
 * ✅ getTitles: counts + genders (optional)
 * genders = { sellerGender, buyerGender, sellerAgentGender, buyerAgentGender }
 */
export const getTitles = (serviceType, agreementType, opts = {}) => {
  const s = clean(serviceType);
  const a = clean(agreementType);

  const serviceMap = titlesByService[s];
  const base = serviceMap ? serviceMap[a] || serviceMap.beec : titlesByService.saami.beec;

  const { counts = {}, genders = {} } = opts;

  const {
    sellerCount = 1,
    buyerCount = 1,
    sellerAgentCount = 1,
    buyerAgentCount = 1,
  } = counts;

  const {
    sellerGender = "male",
    buyerGender = "male",
    sellerAgentGender = "male",
    buyerAgentGender = "male",
  } = genders;

  // 1) gender -> 2) plural
  const seller = pluralizeTitle(applyGender(base.seller, sellerGender), sellerCount);
  const buyer = pluralizeTitle(applyGender(base.buyer, buyerGender), buyerCount);
  const sellerAgent = pluralizeTitle(applyGender(base.sellerAgent, sellerGender), sellerAgentCount);
  const buyerAgent = pluralizeTitle(applyGender(base.buyerAgent, buyerGender), buyerAgentCount);

  return { ...base, seller, buyer, sellerAgent, buyerAgent };
};

