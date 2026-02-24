const clean = (v = "") => v.trim().toLowerCase();

const phraseMap = {
  saami: {
    beec: {
      actionVerb: "ka iibiyey",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "iibkaan",
      shareDescTitle: "SIFADA SAAMIGA LA IIBINAAYO:",
    },
    hibo: {
      actionVerb: "u hibeyey",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "hibadaan",
      shareDescTitle: "SIFADA SAAMIGA LA HIBEYNAYO:",
    },
    waqaf: {
      actionVerb: "u waqfay",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "waqaf kan",

      shareDescTitle: "SIFADA SAAMIGA LA WAQFAAYO:",
    },
  },

  dhulbanaan: {
    beec: {
      actionVerb: "ka iibiyey",
      actionVerb2: "kuna wareejiyey",
      shareDescTitle: "SIFADA DHULKA LA IIBINAAYO:",
    },
    hibo: {
      actionVerb: "u hibeyey",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "hibadaan",

      shareDescTitle: "SIFADA DHULKA LA HIBEYNAYO:",
    },
    waqaf: {
      actionVerb: "u waqfay",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "waqaf kan",

      shareDescTitle: "SIFADA DHULKA LA WAQFAAYO:",
    },
  },

  mooto: {
    beec: {
      actionVerb: "ka iibiyey",
      actionVerb2: "kuna wareejiyey",
      
      shareDescTitle: "SIFADA MOOTADA LA IIBINAAYO:",
    },
    hibo: {
      actionVerb: "u hibeyey",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "hibadaan",

      shareDescTitle: "SIFADA MOOTADA LA HIBEYNAYO:",
    },
    waqaf: {
      actionVerb: "u waqfay",
      actionVerb2: "kuna wareejiyey",
      actionVerb3: "waqaf kan",

      shareDescTitle: "SIFADA MOOTADA LA WAQFAAYO:",
    },
  },

  baabuur: {
    beec: {
      actionVerb: "ka iibiyey",
      actionVerb2: "kuna wareejiyey",
      shareDescTitle: "SIFADA baabuurKA LA IIBINAAYO:",
    },
    hibo: {
      actionVerb: "u hibeyey",
      actionVerb2: "kuna wareejiyey",
      shareDescTitle: "SIFADA baabuurKA LA HIBEYNAYO:",
    },
    waqaf: {
      actionVerb: "u waqfay",
      actionVerb2: "kuna wareejiyey",
      shareDescTitle: "SIFADA baabuurKA LA WAQFAAYO:",
    },
  },
};

export const getPhrases = (serviceType, agreementType) => {
  const s = clean(serviceType);
  const a = clean(agreementType);

  const serviceMap = phraseMap[s];
  if (!serviceMap) return phraseMap.saami.beec; // fallback

  return serviceMap[a] || serviceMap.beec;
};







// PersonCard / PersonModal (wax axios ah ma leh—UI-only)