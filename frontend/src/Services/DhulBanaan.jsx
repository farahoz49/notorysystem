// src/abservices/dhulBanaan.jsx
import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";

/**
 * buildDhulBanaanDoc
 * - Waxaa loogu talagalay in lagu waco gudaha serviceIntroParagraphs(...)
 * - Waxay return-gareysaa Paragraph[] / Table[] (docx children array)
 *
 * NOTE:
 * - signatureTable / witnesses / notarySection ha ku jirin halkan,
 *   sababtoo ah AgreementInfo.jsx hore ayuu u sameeyaa (global).
 * - Halkan waxaan ku haynay “content-ka DhulBanaan case” + optional local signatures haddii aad rabto
 *   (laakiin haddii aad hore u leedahay signatureTable global, ka tag includeLocalSignatures=false).
 */
export const buildDhulBanaanDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,
  getTitles,
  getPhrases,
  GW,

  // people / agents
  sellers = [],
  buyers = [],
  sellerAgents = [],
  buyerAgents = [],

  // flags + strings prepared in AgreementInfo (serviceIntroParagraphs)
  hasSellerAgent = false,
  hasBuyerAgent = false,
  sellerNames = "",
  buyerNames = "",
  sellerAgentDetails = "",
  buyerAgentDetails = "",
  wakaaladText = "",

  // ✅ optional: haddii aad rabto in halkan lagu daro saxiixyo (local)
  includeLocalSignatures = false,
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  // ========= TITLES / PHRASES =========
  const sellerList = (agreement?.dhinac1?.sellers || []).filter((p) => p?.fullName);
  const buyerList = (agreement?.dhinac2?.buyers || []).filter((p) => p?.fullName);

  const sellerAgentList = (agreement?.dhinac1?.agents || []).filter((p) => p?.fullName);
  const buyerAgentList = (agreement?.dhinac2?.agents || []).filter((p) => p?.fullName);

  const seller0 = sellerList?.[0] || {};
  const buyer0 = buyerList?.[0] || {};

  const T = getTitles(agreement.serviceType, agreement.agreementType, {
    counts: {
      sellerCount: sellerList.length,
      buyerCount: buyerList.length,
      sellerAgentCount: sellerAgentList.length,
      buyerAgentCount: buyerAgentList.length,
    },
    genders: {
      sellerGender: seller0.gender,
      buyerGender: buyer0.gender,
      sellerAgentGender: sellerAgentList?.[0]?.gender,
      buyerAgentGender: buyerAgentList?.[0]?.gender,
    },
  });

  const P = getPhrases(agreement.serviceType, agreement.agreementType);

  // ========= SELLER/BUYER PERSON DATA (old style, 1st seller/buyer) =========
  const sellernationality = safe(seller0.nationality);
  const sellerMotherName = safe(seller0.motherName);
  const sellerBirthPlace = safe(seller0.birthPlace);
  const sellerBirthYear = safe(seller0.birthYear);
  const sellerAddress = safe(seller0.address);
  const sellerdocumentType = safe(seller0.documentType);
  const sellerdocumentNumber = safe(seller0.documentNumber);
  const sellerPhone = safe(seller0.phone);

  const buyernationality = safe(buyer0.nationality);
  const buyerMotherName = safe(buyer0.motherName);
  const buyerBirthPlace = safe(buyer0.birthPlace);
  const buyerBirthYear = safe(buyer0.birthYear);
  const buyerAddress = safe(buyer0.address);
  const buyerdocumentType = safe(buyer0.documentType);
  const BuyerdocumentNumber = safe(buyer0.documentNumber);
  const buyerPhone = safe(buyer0.phone);

  // ========= DHULBANAAN SPECIFIC HELPERS =========
  const cabirText =
    service?.cabirka === "Boosas"
      ? `${safe(service?.cabirka)} ${safe(service?.tiradaBoosaska)} (${numberToSomaliWords(service?.tiradaBoosaska) || ""} Boos ah)`
      : safe(service?.cabirka || "");

  const cabirFaahfaahin = service?.cabirFaahfaahin ? ` (${service.cabirFaahfaahin})` : "";

  // Ku Milkiyay details (schema cusub)
  let milkiyadDetails = "";
  if (service?.kuMilkiyay === "Aato") {
    milkiyadDetails =
      `Caddeyn Lambar: ${safe(service?.aato?.cadeynLambar)}, ` +
      `kasoo baxday ${safe(service?.aato?.kasooBaxday)}, ` +
      `ku saxiixan ${safe(service?.aato?.kuSaxiixan)}.`;
  } else if (service?.kuMilkiyay === "Sabarloog") {
    milkiyadDetails =
      `Sabarloog No: ${safe(service?.sabarloog?.sabarloogNo)}, ` +
      `Bollettario No: ${safe(service?.sabarloog?.bollettarioNo1)}` +
      `${service?.sabarloog?.bollettarioNo2 ? " / " + safe(service.sabarloog.bollettarioNo2) : ""}, ` +
      `Rasiid Nambar: ${safe(service?.sabarloog?.rasiidNambar)}, ` +
      `Tr. ${service?.sabarloog?.rasiidTaariikh ? formatDate(service.sabarloog.rasiidTaariikh) : ""}, ` +
      `D. Hoose ee: ${safe(service?.sabarloog?.dHooseEe)}.`;
  } else if (service?.kuMilkiyay === "Maxkamad") {
    milkiyadDetails =
      `Warqad Lam: ${safe(service?.maxkamad?.warqadLam)}, ` +
      `Maxkamada: ${safe(service?.maxkamad?.maxkamada)}, ` +
      `Garsooraha: ${safe(service?.maxkamad?.garsooraha)}, ` +
      `Ku saxiixan: ${safe(service?.maxkamad?.kuSaxiixan)}.`;
  }

  // ========= OPTIONAL LOCAL SIGNATURES (haddii aad rabto) =========
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

 // ================= SIGNATURES (SAAMI ONLY + GENDER) =================
const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

const maleFemale = (gender, male, female) =>
  String(gender || "").toLowerCase() === "female" ? female : male;

const joinSigNames = (arr = []) =>
  (arr || [])
    .filter(Boolean)
    .map((p) => safe(p?.fullName))
    .filter(Boolean)
    .join(" , ");

const agreementType = String(agreement?.agreementType || "").trim(); // Beec | Hibo | Waqaf

const sellersArr = sellers || [];
const buyersArr = buyers || [];

const sellerAgentsArr = sellerAgents || [];
const buyerAgentsArr = buyerAgents || [];

const hasSellerSigAgent = sellerAgentsArr.length > 0;
const hasBuyerSigAgent = buyerAgentsArr.length > 0;

// ✅ haddii wakiil jiro, wakiilka ayaa saxiixaya
const leftPeople = hasSellerSigAgent ? sellerAgentsArr : sellersArr;
const rightPeople = hasBuyerSigAgent ? buyerAgentsArr : buyersArr;

const leftGender = leftPeople?.[0]?.gender || "male";
const rightGender = rightPeople?.[0]?.gender || "male";

const leftName =
  leftPeople.length > 1 ? joinSigNames(leftPeople) : safe(leftPeople?.[0]?.fullName.toUpperCase());

const rightName =
  rightPeople.length > 1 ? joinSigNames(rightPeople) : safe(rightPeople?.[0]?.fullName.toUpperCase());

// -------- TITLES (Beec / Hibo / Waqaf) --------
let leftTitle = "";
let rightTitle = "";

/* =========================
   B E E C
========================= */
if (agreementType === "Beec") {
  // SELLER (main vs agent)
  leftTitle = hasSellerSigAgent
    ? singleOrPlural(
        sellerAgentsArr.length,
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} DHULKA`,
        `SAXIIXA WAKIILLADA ISKA IIBIYAASHA DHULKA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} DHULKA `,
        `SAXIIXA ISKA IIBIYAASHA DHULKA`
      );

  // BUYER (main vs agent)
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA BEEC U AQBALAHA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} DHULKA`,
        `SAXIIXA BEEC U AQBALAHA IIBSADAYAASHA DHULKA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} DHULKA`,
        `SAXIIXA IIBSADAYAASHA DHULKA`
      );
}

/* =========================
   H I B O
========================= */
else if (agreementType === "Hibo") {
  // SELLER = HIBEYE
  leftTitle = hasSellerSigAgent
    ? singleOrPlural(
        sellerAgentsArr.length,
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} DHULKA`,
        `SAXIIXA WAKIILLADA HIBEYAASHA DHULKA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} DHULKA`,
        `SAXIIXA HIBEYAASHA DHULKA`
      );

  // BUYER = QAATAHA
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA HIBEYN U AQBALAHA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} DHULKA`,
        `SAXIIXA HIBEYN U AQBALAHA QAATAYAASHA DHULKA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} DHULKA`,
        `SAXIIXA QAATAYAASHA DHULKA`
      );
}

/* =========================
   W A Q A F
========================= */
else if (agreementType === "Waqaf") {
  // SELLER = WAAQIF
  leftTitle = hasSellerSigAgent
    ? singleOrPlural(
        sellerAgentsArr.length,
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} DHULKA`,
        `SAXIIXA WAKIILLADA WAAQIFAYAASHA DHULKA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} DHULKA`,
        `SAXIIXA WAAQIFAYAASHA DHULKA`
      );

  // BUYER = QOFKA LOO WAQFAY
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA WAQAF U AQBALAHA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} DHULKA`,
        `SAXIIXA WAQAF U AQBALAHA DADKA LOO WAQFAY DHULKA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} DHULKA`,
        `SAXIIXA DADKA LOO WAQFAY DHULKA`
      );
}

const signatureLine = "______________________________";

// ================= MARQAATIYAASHA =================
const witnessesTitle = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 120 },
  children: [
    new TextRun({
      text: "SAXIIXA MARQAATIYAASHA",
      bold: true,
      underline: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
});

const witnessesTable =
  agreement?.witnesses && agreement.witnesses.length > 0
    ? new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: agreement.witnesses.map((w) =>
              new TableCell({
                borders: hiddenBorders,
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [
                      new TextRun({
                        text: (w || "").toUpperCase(),
                        bold: true,
                        size: 22,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "__________________________",
                        size: 22,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              })
            ),
          }),
        ],
      })
    : null;

// ================= SUGITAANKA NOOTAAYADA =================
const notarySection = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: "SUGITAANKA NOOTAAYADA",
        bold: true,
        underline: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),

  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: `REF: ${safe(agreement?.refNo)}, Tr. ${formatDate(agreement?.agreementDate)} `,
        size: 22,
        bold: true,
        underline: true,
        font: "Times New Roman",
      }),
        new TextRun({ text: "Anigoo ah ", size: 24, font: "Times New Roman" }),
      new TextRun({
        text: "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, ",
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text:
          "Nootaayaha Xafiiska Nootaayaha Boqole, waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, laguna saxiixay horteyda, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka.",
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),



  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "NOOTAAYAHA",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),

  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),

  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: "__________________________",
        size: 22,
        font: "Times New Roman",
      }),
    ],
  }),
];
  // ========= RETURN (DhulBanaan main content) =========
  const content = [
      // TITLE
 new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text:
        agreement.agreementType === "Beec"
          ? "UJEEDDO: KALA GADASHO DHUL BANAAN"
          : agreement.agreementType === "Hibo"
          ? "UJEEDDO: HIBEYN DHUL BANAAN"
          : agreement.agreementType === "Waqaf"
          ? "UJEEDDO: WAQFID DHUL BANAAN"
          : "",
      bold: true,
      underline: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
}),
    // QORAALKA BILOWGA HESHIISKA
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),

    // SELLER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: String(T?.seller || "").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // SELLER INFO
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${sellerNames} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `${sellernationality} `, font: "Times New Roman", size: 24, color: "FF0000" }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${sellerMotherName} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${sellerBirthPlace} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({ text: `${sellerBirthYear} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({ text: `${sellerAddress} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({ text: `${sellerdocumentType} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({ text: `${sellerdocumentNumber} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({ text: `${sellerPhone}`, size: 24, bold: true, color: "FF0000" }),
      ],
    }),

    // BUYER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: String(T?.buyer || "").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // BUYER INFO
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${buyerNames} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `${buyernationality} `, font: "Times New Roman", size: 24, color: "008000" }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${buyerMotherName} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${buyerBirthPlace} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({ text: `${buyerBirthYear} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({ text: `${buyerAddress} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({ text: `${buyerdocumentType} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({ text: `${BuyerdocumentNumber} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({ text: `${buyerPhone}`, size: 24, bold: true, color: "008000" }),
      ],
    }),

    // =========================
    // SELLER SECTION
    // =========================
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasSellerAgent
        ? [
            new TextRun({ text: String(T?.sellerAgent || "").toUpperCase(), size: 24, bold: true, underline: true }),
            new TextRun({ text: " Anigoo ah ", size: 24 }),
            new TextRun({ text: sellerAgentDetails, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, ${wakaaladText}, kana wakiil ah iska ${T?.seller} Dhulka `, size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),

            new TextRun({
              text:
                `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
                `waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan  ${P?.actionVerb} ${P?.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),

            new TextRun({
              text:
                `,  ${cabirText} cabirkiisu yahay${cabirFaahfaahin}, ` +
                `ku yaalla ${safe(service?.kuYaallo?.gobol)} - ${safe(service?.kuYaallo?.degmo)}, ` +
                `${service?.lottoLambar ? `Lotto Lambar: ${safe(service.lottoLambar)}, ` : ""}` +
                `Ku Milkiyay: ${safe(service?.kuMilkiyay)}, ` +
                `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
                `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
              size: 24,
              bold: true,
            }),

            new TextRun({
              text:
                ` Soohdinta: Koonfur ${safe(service?.soohdinta?.koonfur)}, ` +
                `Waqooyi ${safe(service?.soohdinta?.waqooyi)}, ` +
                `Galbeed ${safe(service?.soohdinta?.galbeed)}, ` +
                `Bari ${safe(service?.soohdinta?.bari)}.`,
              size: 24,
              bold: true,
            }),

            ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${safe(service.ahna)}.`, size: 24 })] : []),
            ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${safe(service.kaKooban)}.`, size: 24 })] : []),

            ...(agreement?.sellingPrice
              ? [
                  new TextRun({
                    text: ` Waxaan ku gaday anigoo ka wakiil ah ${T?.seller} dhulka lacag dhan $${formatCurrency(
                      agreement.sellingPrice
                    )} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,
                    size: 24,
                  }),
                ]
              : []),
          ]
        : [
            new TextRun({ text: "Ugu horeyn anigoo ah ", size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
                `waxa aan  ${P?.actionVerb} ${P?.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),

            new TextRun({
              text:
                `,  ${cabirText} cabirkiisu yahay${cabirFaahfaahin}, ` +
                `ku yaalla ${safe(service?.kuYaallo?.gobol)} - ${safe(service?.kuYaallo?.degmo)}, ` +
                `${service?.lottoLambar ? `Lotto Lambar: ${safe(service.lottoLambar)}, ` : ""}` +
                `Ku Milkiyay: ${safe(service?.kuMilkiyay)}, ` +
                `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
                `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
              size: 24,
            }),

            new TextRun({
              text:
                ` Soohdinta: Koonfur ${safe(service?.soohdinta?.koonfur)}, ` +
                `Waqooyi ${safe(service?.soohdinta?.waqooyi)}, ` +
                `Galbeed ${safe(service?.soohdinta?.galbeed)}, ` +
                `Bari ${safe(service?.soohdinta?.bari)}.`,
              size: 24,
            }),

            ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${safe(service.ahna)}.`, size: 24 })] : []),
            ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${safe(service.kaKooban)}.`, size: 24 })] : []),

            ...(agreement?.sellingPrice
              ? [
                  new TextRun({
                    text: ` Waxaan ku gaday lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(
                      agreement.sellingPrice
                    )} Doolarka Mareykanka ah).`,
                    size: 24,
                  }),
                ]
              : []),
          ],
    }),

    // =========================
    // BUYER SECTION
    // =========================
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasBuyerAgent
        ? [
            new TextRun({ text: "BEEC U AQBALAHA IIBSADAHA DHULKA", size: 24, underline: true, bold: true }),
            new TextRun({ text: " Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerAgentDetails, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
                `waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. ` +
                `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas ` +
                `waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ]
        : [
            new TextRun({ text: "Anigoo ah iibsadaha ", size: 24 }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
                `waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. ` +
                `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas ` +
                `waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ],
    }),
      // SIGNATURE TABLE
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [
                    new TextRun({ text: leftTitle, bold: true, size: 22, underline: {} }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(leftName), bold: true, size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 22 })],
                }),
              ],
            }),

            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [
                    new TextRun({ text: rightTitle, bold: true, size: 22, underline: {} }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(rightName), bold: true, size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 22 })],
                }),
              ],
            }),
          ],
        }),
        
      ],
    }),
        // ✅ MARQAATIYAASHA
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),

    // ✅ SUGITAANKA NOOTAAYADA
    ...notarySection,
    
  
    
  ];

 

  return content;
  
};