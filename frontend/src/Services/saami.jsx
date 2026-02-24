// src/docTemplates/saami.js
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
 * buildSaamiDoc
 * - Returns array of docx elements (Paragraph/Table...)
 * - Signature / witnesses / notary remain in main AgreementInfo.jsx (global)
 */
export const buildSaamiDoc = ({
  agreement,
  service,
  formatDate,
  numberToSomaliWords,
  formatCurrency,
  getTitles,
  getPhrases,
  GW,
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  // ================== helpers ==================
  const joinNames = (people = []) => {
    const names = (people || []).map((p) => p?.fullName).filter(Boolean);
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} iyo ${names[1]}`;
    return `${names.slice(0, -1).join(", ")} iyo ${names[names.length - 1]}`;
  };

  const personLine = (p, roleColor, isBuyer = false) => {
    const W = GW(p?.gender || "male");

    return [
      new TextRun({
        text: `${safe(p?.fullName)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${safe(p?.nationality)} `,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `ah, `, size: 24, font: "Times New Roman" }),
      new TextRun({ text: W.childOfMaleFemale, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.motherName)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `${W.dhalasho} `, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.birthPlace)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `sannadkii `, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.birthYear)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `${W.lived} `, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.address)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `lehna `, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.documentType)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({ text: `NO `, size: 24, font: "Times New Roman" }),
      new TextRun({
        text: `${safe(p?.documentNumber)} `,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: `ee ku lifaaqan warqadaan, Tell `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${safe(p?.phone)}`,
        bold: true,
        color: roleColor,
        size: 24,
        font: "Times New Roman",
      }),
    ];
  };

  const buildPeopleRuns = (people = [], roleColor, isBuyer = false) => {
    const arr = (people || []).filter(Boolean);
    const runs = [];
    arr.forEach((p, idx) => {
      if (idx > 0) {
        const isLast = idx === arr.length - 1;
        runs.push(
          new TextRun({
            text: isLast ? " iyo " : ", ",
            size: 24,
            font: "Times New Roman",
          })
        );
      }
      runs.push(...personLine(p, roleColor, isBuyer));
    });
    return runs;
  };

  // ================== data ==================
  const sellers = agreement?.dhinac1?.sellers || [];
  const buyers = agreement?.dhinac2?.buyers || [];

  const sellerNames = joinNames(sellers);
  const buyerNames = joinNames(buyers);

  const sellersPlural = sellers.length > 1;
  const buyersPlural = buyers.length > 1;

  const sellerAgents = agreement?.dhinac1?.agents || [];
  const buyerAgents = agreement?.dhinac2?.agents || [];
  const hasSellerAgent = sellerAgents.length > 0;
  const hasBuyerAgent = buyerAgents.length > 0;

  const sellerDocsMap = agreement?.dhinac1?.agentDocuments || {};

  const wakaaladText = (sellerAgents || [])
    .map((agent) => {
      const agentId = agent?._id?.toString();
      const agentDocs = sellerDocsMap?.[agentId];
      if (!agentDocs) return "";

      const { wakaalad, tasdiiq } = agentDocs;
      const parts = [];

      if (wakaalad) {
        parts.push(
          `haystana ${safe(wakaalad.wakaladType)} lambarkeedu yahay ${safe(
            wakaalad.refNo
          )}, Tr. ${safe(wakaalad.date)?.split("T")?.[0] || ""}, kana soo baxday Xafiiska Nootaayaha iyo Latalinta Sharciga ah ee ${safe(
            wakaalad.kasooBaxday
          )}, uuna saxiixay Dr.${safe(wakaalad.saxiix1)}`
        );
      }

      if (tasdiiq) {
        parts.push(
          `waxaa kale oo jira Tasdiiq lambarkiisu yahay ${safe(
            tasdiiq.refNo
          )}, Tr. ${safe(tasdiiq.date)?.split("T")?.[0] || ""}`
        );
      }

      return parts.join(", ");
    })
    .filter(Boolean)
    .join(" | ");

  const sellerAgentDetails = (sellerAgents || [])
    .map(
      (a) =>
        `${safe(a.fullName)}, ${safe(a.nationality)} ah, ina ${safe(
          a.motherName
        )}, ku dhashay ${safe(a.birthPlace)}, sannadkii ${safe(
          a.birthYear
        )}, degan ${safe(a.address)}, Tell: ${safe(a.phone)}`
    )
    .join(" | ");

  const buyerAgentDetails = (buyerAgents || [])
    .map(
      (a) =>
        `${safe(a.fullName)}, ${safe(a.nationality)} ah, ina ${safe(
          a.motherName
        )}, ku dhashay ${safe(a.birthPlace)}, sannadkii ${safe(
          a.birthYear
        )}, degan ${safe(a.address)}, Tell: ${safe(a.phone)}`
    )
    .join(" | ");

  const T = getTitles(agreement.serviceType, agreement.agreementType, {
    counts: {
      sellerCount: sellers.length,
      buyerCount: buyers.length,
      sellerAgentCount: sellerAgents.length,
      buyerAgentCount: buyerAgents.length,
    },
    genders: {
      sellerGender: sellers?.[0]?.gender,
      buyerGender: buyers?.[0]?.gender,
      sellerAgentGender: sellerAgents?.[0]?.gender,
      buyerAgentGender: buyerAgents?.[0]?.gender,
    },
  });

  const P = getPhrases(agreement.serviceType, agreement.agreementType);

  // ================== SAAMI header table (account + shares + usd) ==================
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
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} SAAMIGA`,
        `SAXIIXA WAKIILLADA ISKA IIBIYAASHA SAAMIGA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} `,
        `SAXIIXA ISKA IIBIYAASHA SAAMIGA`
      );

  // BUYER (main vs agent)
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA BEEC U AQBALAHA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} SAAMIGA`,
        `SAXIIXA BEEC U AQBALAHA IIBSADAYAASHA SAAMIGA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} SAAMIGA`,
        `SAXIIXA IIBSADAYAASHA SAAMIGA`
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
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} SAAMIGA`,
        `SAXIIXA WAKIILLADA HIBEYAASHA SAAMIGA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} SAAMIGA`,
        `SAXIIXA HIBEYAASHA SAAMIGA`
      );

  // BUYER = QAATAHA
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA HIBEYN U AQBALAHA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} SAAMIGA`,
        `SAXIIXA HIBEYN U AQBALAHA QAATAYAASHA SAAMIGA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} SAAMIGA`,
        `SAXIIXA QAATAYAASHA SAAMIGA`
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
        `SAXIIXA WAKIILKA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} SAAMIGA`,
        `SAXIIXA WAKIILLADA WAAQIFAYAASHA SAAMIGA`
      )
    : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} SAAMIGA`,
        `SAXIIXA WAAQIFAYAASHA SAAMIGA`
      );

  // BUYER = QOFKA LOO WAQFAY
  rightTitle = hasBuyerSigAgent
    ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA WAQAF U AQBALAHA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} SAAMIGA`,
        `SAXIIXA WAQAF U AQBALAHA DADKA LOO WAQFAY SAAMIGA`
      )
    : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} SAAMIGA`,
        `SAXIIXA DADKA LOO WAQFAY SAAMIGA`
      );
}

const signatureLine = "______________________________";

  const sharesCount = Number(service?.amount || 0) / 10;

  const saamiHeaderSection = () => [
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: safe(P?.shareDescTitle) || "SAAMI",
          bold: true,
          size: 24,
          underline: {},
          font: "Times New Roman",
        }),
      ],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: hiddenBorders,
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "ACCOUNT NO:", bold: true, size: 24, font: "Times New Roman" })],
                }),
              ],
            }),
            new TableCell({
              borders: hiddenBorders,
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${safe(service?.accountNumber)}`,
                      bold: true,
                      color: "FF0000",
                      size: 28,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new TableRow({
          children: [
            new TableCell({
              borders: hiddenBorders,
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "TIRADA SAAMIGA:", bold: true, size: 24, font: "Times New Roman" })],
                }),
              ],
            }),
            new TableCell({
              borders: hiddenBorders,
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${formatCurrency(sharesCount)}`,
                      bold: true,
                      color: "FF0000",
                      size: 28,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: ` (${numberToSomaliWords(sharesCount)} saami)`,
                      size: 24,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new TableRow({
          children: [
            new TableCell({
              borders: hiddenBorders,
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "UNA DHIGANTA:", bold: true, size: 24, font: "Times New Roman" })],
                }),
              ],
            }),
            new TableCell({
              borders: hiddenBorders,
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `USD ${formatCurrency(service?.amount)}`,
                      bold: true,
                      color: "FF0000",
                      size: 28,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: ` (${numberToSomaliWords(service?.amount)} Doolarka Mareykanka ah)`,
                      size: 24,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  // ================== RETURN ==================
  return [
    // TITLE
 new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text:
        agreement.agreementType === "Beec"
          ? "UJEEDDO: KALA GADASHO SAAMI"
          : agreement.agreementType === "Hibo"
          ? "UJEEDDO: HIBEYN SAAMI"
          : agreement.agreementType === "Waqaf"
          ? "UJEEDDO: WAQFID SAAMI"
          : "",
      bold: true,
      underline: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
}),
    // Start paragraph
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

    ...(agreement?.serviceType === "Saami" ? saamiHeaderSection() : []),

    // Title Seller
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: String(T?.seller || "Dhinaca 1aad").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: {},
        }),
      ],
    }),

    // sellers details
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: buildPeopleRuns(sellers, "FF0000", false),
    }),

    // Title Buyer
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: String(T?.buyer || "Dhinaca 2aad").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: {},
        }),
      ],
    }),

    // buyers details
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: buildPeopleRuns(buyers, "008000", true),
    }),

    // Seller section
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100, before: 100 },
      children: hasSellerAgent
        ? [
            new TextRun({
              text: String(T?.sellerAgent || "WAKIIL").toUpperCase(),
              size: 24,
              bold: true,
              underline: {},
            }),
            new TextRun({ text: sellersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: sellerAgentDetails, bold: true, size: 24 }),
            new TextRun({ text: `, ${wakaaladText}, kana wakiil ah ${T.seller} `, size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: sellersPlural
                ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan ka qireynaa markhaatiyaasha iyo nootaayaha hortooda, in aan ${P.actionVerb} ${P.actionVerb2} `
                : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin, waxaan ka qirayaa markhaatiyaasha iyo nootaayaha hortooda, in aan ${P.actionVerb} ${P.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, saami ka mid ah saamiyada ${sellersPlural ? "aan ku leenahay" : "aan ku leeyahay"} shirkadda ${safe(
                service?.companyName
              )}, oo ah sida kor ku xusan, kuna cad Activity Report-ga, Tr ${formatDate(service?.SaamiDate)}.`,
              size: 24,
            }),
            new TextRun({
              text: ` Sidaa darteed laga bilaabo 01/01/2026 faa'iidada iyo manfaca saamigaan si sharci ah ugu wareegtay `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: ".", size: 24 }),
          ]
        : [
            new TextRun({ text: sellersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: sellersPlural
                ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan ka qireynaa markhaatiyaasha iyo nootaayaha hortooda in aan ${P.actionVerb} ${P.actionVerb2} `
                : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin, waxaan ka qirayaa markhaatiyaasha iyo nootaayaha hortooda in aan ${P.actionVerb} ${P.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, saami ka mid ah saamiyada ${sellersPlural ? "aan ku leenahay" : "aan ku leeyahay"} Shirkada `,
              size: 24,
            }),
            new TextRun({ text: `${safe(service?.companyName)}`, size: 24, bold: true }),
            new TextRun({ text: ` kuna cad Activity Report-ga Tr `, size: 24 }),
            new TextRun({ text: `${formatDate(service?.SaamiDate)}`, size: 24, bold: true }),
            new TextRun({
              text: ` Sidaa darteed laga bilaabo 01/01/2026 faa'iidada iyo manfaca saamigaan si sharci ah ugu wareegtay `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: ".", size: 24 }),
          ],
    }),

    // Buyer section
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasBuyerAgent
        ? [
            new TextRun({
              text: String(T?.buyerAgent || "WAKIIL").toUpperCase(),
              size: 24,
              underline: {},
              bold: true,
            }),
            new TextRun({ text: buyersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerAgentDetails, bold: true, size: 24 }),
            new TextRun({
              text: buyersPlural
                ? `, ahna ${T.buyerAgent}, kana caafimaad qabna maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin waxaan ku qancay ${P.actionVerb3}, una aqbalnay `
                : `, ahna ${T.buyerAgent}, kana caafimaad qaba maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin waxaan ku qancay ${P.actionVerb3}, una aqbalay `,
              size: 24,
            }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: ".", size: 24 }),
          ]
        : [
            new TextRun({ text: buyersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: buyersPlural
                ? `, ahna ${T.buyer}, kana caafimaad qabna maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan cadeynaynaa in aan ku qancay ${P.actionVerb3} aqbalnay. Wixii aan ku xusneyn halkaan waxaa loo raacayaa sida uu qabo sharciga islaamka iyo qaanuunka dalka.`
                : `, ahna ${T.buyer}, kana caafimaad qaba maskaxda iyo jirkaba, cid i qasabtayna aysan jirin, waxaan cadeynayaa in aan ku qancay ${P.actionVerb3} aqbalayna. Wixii aan ku xusneyn halkaan waxaa loo raacayaa sida uu qabo sharciga islaamka iyo qaanuunka dalka.`,
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
  ];
};