// src/services/dhulBanaan.js

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
 * - signatureTable / witnesses / notarySection waxaa optional ka dhigeynaa
 *   iyadoo la adeegsanayo includeLocalSignatures
 * - Halkan waxaan ku haynay content-ka DhulBanaan case + optional local signatures
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

  // flags + strings prepared in AgreementInfo (optional fallback)
  hasSellerAgent = false,
  hasBuyerAgent = false,
  sellerNames = "",
  buyerNames = "",
  sellerAgentDetails = "",
  buyerAgentDetails = "",
  wakaaladText = "",

  // optional: haddii aad rabto in halkan lagu daro saxiixyo / marqaati / notary
  includeLocalSignatures = false,
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const formatDocDate = (date) => {
    if (!date) return "";
    try {
      return formatDate(date);
    } catch {
      return String(date).split("T")[0] || "";
    }
  };

  const upper = (v) => safe(v).toUpperCase();

  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // ========= AGREEMENT DATA =========
  const agreementType = safe(agreement?.agreementType); // Beec | Hibo | Waqaf
  const sellingPrice = agreement?.sellingPrice;

  // ========= PARTY LISTS =========
  const sellerList = (agreement?.dhinac1?.sellers || sellers || []).filter((p) => p?.fullName);
  const buyerList = (agreement?.dhinac2?.buyers || buyers || []).filter((p) => p?.fullName);

  const sellerAgentList = (agreement?.dhinac1?.agents || sellerAgents || []).filter((p) => p?.fullName);
  const buyerAgentList = (agreement?.dhinac2?.agents || buyerAgents || []).filter((p) => p?.fullName);

  const resolvedHasSellerAgent =
    typeof hasSellerAgent === "boolean" ? hasSellerAgent : sellerAgentList.length > 0;
  const resolvedHasBuyerAgent =
    typeof hasBuyerAgent === "boolean" ? hasBuyerAgent : buyerAgentList.length > 0;

  const seller0 = sellerList?.[0] || {};
  const buyer0 = buyerList?.[0] || {};

  // ========= TITLES / PHRASES =========
  const T = getTitles?.(agreement?.serviceType, agreementType, {
    counts: {
      sellerCount: sellerList.length,
      buyerCount: buyerList.length,
      sellerAgentCount: sellerAgentList.length,
      buyerAgentCount: buyerAgentList.length,
    },
    genders: {
      sellerGender: seller0?.gender,
      buyerGender: buyer0?.gender,
      sellerAgentGender: sellerAgentList?.[0]?.gender,
      buyerAgentGender: buyerAgentList?.[0]?.gender,
    },
  }) || {};

  const P = getPhrases?.(agreement?.serviceType, agreementType) || {};

  // ========= PERSON DATA =========
  const sellernationality = safe(seller0?.nationality);
  const sellerMotherName = safe(seller0?.motherName);
  const sellerBirthPlace = safe(seller0?.birthPlace);
  const sellerBirthYear = safe(seller0?.birthYear);
  const sellerAddress = safe(seller0?.address);
  const sellerdocumentType = safe(seller0?.documentType);
  const sellerdocumentNumber = safe(seller0?.documentNumber);
  const sellerPhone = safe(seller0?.phone);

  const buyernationality = safe(buyer0?.nationality);
  const buyerMotherName = safe(buyer0?.motherName);
  const buyerBirthPlace = safe(buyer0?.birthPlace);
  const buyerBirthYear = safe(buyer0?.birthYear);
  const buyerAddress = safe(buyer0?.address);
  const buyerdocumentType = safe(buyer0?.documentType);
  const buyerdocumentNumber = safe(buyer0?.documentNumber);
  const buyerPhone = safe(buyer0?.phone);

  // ========= NAMES / DETAILS FALLBACK =========
  const joinNames = (arr = []) =>
    (arr || [])
      .map((p) => safe(p?.fullName))
      .filter(Boolean)
      .join(" , ");

  const resolvedSellerNames = sellerNames || joinNames(sellerList);
  const resolvedBuyerNames = buyerNames || joinNames(buyerList);

  const buildAgentIdentityDetails = (agent) => {
    if (!agent) return "";
    const nationality = safe(agent?.nationality);
    const motherName = safe(agent?.motherName);
    const birthPlace = safe(agent?.birthPlace);
    const birthYear = safe(agent?.birthYear);
    const address = safe(agent?.address);
    const documentType = safe(agent?.documentType);
    const documentNumber = safe(agent?.documentNumber);
    const phone = safe(agent?.phone);

    return [
      safe(agent?.fullName),
      nationality,
      nationality ? "ah" : "",
      ", ina",
      motherName,
      "ku dhashay",
      birthPlace,
      "sannadkii",
      birthYear,
      "degan",
      address,
      "lehna",
      documentType,
      "NO",
      documentNumber,
      "ee ku lifaaqan warqadaan, Tell",
      phone,
    ]
      .filter((x) => String(x).trim() !== "")
      .join(" ");
  };

  const resolvedSellerAgentDetails =
    sellerAgentDetails || buildAgentIdentityDetails(sellerAgentList?.[0]);

  const resolvedBuyerAgentDetails =
    buyerAgentDetails || buildAgentIdentityDetails(buyerAgentList?.[0]);

  // ========= AGENT DOCUMENTS (WAKAALAD / TASDIIQ) =========
  const sellerDocsMap = agreement?.dhinac1?.agentDocuments || {};
  const buyerDocsMap = agreement?.dhinac2?.agentDocuments || {};

  const buildAgentWakaaladText = (agents = [], docsMap = {}) =>
    (agents || [])
      .map((agent) => {
        const agentId = agent?._id?.toString?.() || agent?.id?.toString?.();
        const agentDocs = docsMap?.[agentId];
        if (!agentDocs) return "";

        const { wakaalad, tasdiiq } = agentDocs;
        const parts = [];

        if (wakaalad) {
          parts.push(
            `haystana ${safe(
              wakaalad?.wakaladType || wakaalad?.wakaladType || wakaalad?.type
            )} lambarkeedu yahay ${safe(wakaalad?.refNo)}, Tr. ${formatDocDate(
              wakaalad?.date
            )}, kana soo baxday ${safe(wakaalad?.kasooBaxday)}, uuna saxiixay ${safe(
              wakaalad?.saxiix1
            )} ${safe(wakaalad?.ahna0)}`
          );
        }

        if (tasdiiq) {
          parts.push(
            `lehna Tasdiiqa lambarkiisu yahay ${safe(
              tasdiiq?.refNo
            )}, Tr. ${formatDocDate(
              tasdiiq?.date
            )} kana soo baxday Maxkamadda Rafcaanka Gobolka Banaadir soona martay Wasaaradda Arimaha Dibedda`
          );
        }

        return parts.join(", ");
      })
      .filter(Boolean)
      .join(" ; ");

  const resolvedSellerWakaaladText =
    wakaaladText || buildAgentWakaaladText(sellerAgentList, sellerDocsMap);

  const resolvedBuyerWakaaladText = buildAgentWakaaladText(
    buyerAgentList,
    buyerDocsMap
  );

  // ========= DHULBANAAN SPECIFIC =========
  const cabirText =
    service?.cabirka === "Boosas"
      ? `${safe(service?.cabirka)} ${safe(service?.tiradaBoosaska)} (${numberToSomaliWords?.(service?.tiradaBoosaska) || ""
      } Boos ah)`
      : safe(service?.cabirka || "");

  const cabirFaahfaahin = service?.cabirFaahfaahin
    ? ` (${service.cabirFaahfaahin})`
    : "";

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
      `${service?.sabarloog?.bollettarioNo2
        ? " / " + safe(service?.sabarloog?.bollettarioNo2)
        : ""
      }, ` +
      `Rasiid Nambar: ${safe(service?.sabarloog?.rasiidNambar)}, ` +
      `Tr. ${service?.sabarloog?.rasiidTaariikh
        ? formatDate(service?.sabarloog?.rasiidTaariikh)
        : ""
      }, ` +
      `D. Hoose ee: ${safe(service?.sabarloog?.dHooseEe)}.`;
  } else if (service?.kuMilkiyay === "Maxkamad") {
    milkiyadDetails =
      `Warqad Lam: ${safe(service?.maxkamad?.warqadLam)}, ` +
      `Maxkamada: ${safe(service?.maxkamad?.maxkamada)}, ` +
      `Garsooraha: ${safe(service?.maxkamad?.garsooraha)}, ` +
      `Ku saxiixan: ${safe(service?.maxkamad?.kuSaxiixan)}.`;
  }

  // ========= TEXT HELPERS =========
  const getPurposeTitle = () => {
    if (agreementType === "Beec") return "UJEEDDO: KALA GADASHO DHUL BANAAN";
    if (agreementType === "Hibo") return "UJEEDDO: HIBEYN DHUL BANAAN";
    if (agreementType === "Waqaf") return "UJEEDDO: WAQFID DHUL BANAAN";
    return "";
  };

  const getBuyerAcceptTitle = () => {
    if (agreementType === "Beec") return "BEEC U AQBALAHA IIBSADAHA DHULKA";
    if (agreementType === "Hibo") return "HIBEYN U AQBALAHA QAATAHA DHULKA";
    if (agreementType === "Waqaf") return "WAQAF U AQBALAHA QOFKA LOO WAQFAY DHULKA";
    return "AQBALAHA DHULKA";
  };

  const getBuyerAcceptanceText = () => {
    if (agreementType === "Beec") {
      return (
        `waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. ` +
        `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas ` +
        `waxay si sharci ah ugu wareegeen iibsade `
      );
    }

    if (agreementType === "Hibo") {
      return (
        `waxa aan aqbalay hibeyntaan anigoo ku qanacsan raalina ka ah. ` +
        `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas ` +
        `waxay si sharci ah ugu wareegeen qaataha `
      );
    }

    if (agreementType === "Waqaf") {
      return (
        `waxa aan aqbalay waqafkaan anigoo ku qanacsan raalina ka ah. ` +
        `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas ` +
        `waxay si sharci ah ugu wareegeen qofka loo waqfay `
      );
    }

    return `waxa aan aqbalay heshiiskaan anigoo ku qanacsan raalina ka ah. `;
  };

  const getBuyerClosingText = () => {
    if (agreementType === "Beec") {
      return `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`;
    }

    if (agreementType === "Hibo") {
      return `, waana hibo sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`;
    }

    if (agreementType === "Waqaf") {
      return `, waana waqaf sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`;
    }

    return `, waana heshiis sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`;
  };

  const getPriceSentence = () => {
    if (!sellingPrice) return "";

    if (agreementType === "Beec") {
      return ` Waxaan ku gaday lacag dhan $${formatCurrency?.(
        sellingPrice
      )} (${numberToSomaliWords?.(sellingPrice)} Doolarka Mareykanka ah).`;
    }

    return "";
  };

  const getAgentPriceSentence = () => {
    if (!sellingPrice) return "";

    if (agreementType === "Beec") {
      return ` Waxaan ku gaday anigoo ka wakiil ah ${T?.seller} dhulka lacag dhan $${formatCurrency?.(
        sellingPrice
      )} (${numberToSomaliWords?.(sellingPrice)} Doolarka Mareykanka ah).`;
    }

    return "";
  };

  // ========= SIGNATURE LOGIC (SAAMI STYLE) =========
  const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

  const maleFemale = (gender, male, female) =>
    String(gender || "").toLowerCase() === "female" ? female : male;

  const joinSigNames = (arr = []) =>
    (arr || [])
      .filter(Boolean)
      .map((p) => safe(p?.fullName))
      .filter(Boolean)
      .join(" , ");

  const sellersArr = sellerList || [];
  const buyersArr = buyerList || [];
  const sellerAgentsArr = sellerAgentList || [];
  const buyerAgentsArr = buyerAgentList || [];

  const hasSellerSigAgent = sellerAgentsArr.length > 0;
  const hasBuyerSigAgent = buyerAgentsArr.length > 0;

  const leftPeople = hasSellerSigAgent ? sellerAgentsArr : sellersArr;
  const rightPeople = hasBuyerSigAgent ? buyerAgentsArr : buyersArr;

  const leftGender = sellersArr?.[0]?.gender || "male";
  const rightGender = buyersArr?.[0]?.gender || "male";
  const leftGender0 = sellersArr?.[0]?.gender || "male";
  const rightGender0 = rightPeople?.[0]?.gender || "male";
  const acceptorWord = (gender) =>
    String(gender || "").toLowerCase() === "female"
      ? "U AQBASHADA"
      : "U AQBALAHA";
  const leftName =
    leftPeople.length > 1
      ? joinSigNames(leftPeople)
      : upper(leftPeople?.[0]?.fullName);

  const rightName =
    rightPeople.length > 1
      ? joinSigNames(rightPeople)
      : upper(rightPeople?.[0]?.fullName);

  let leftTitle = "";
  let rightTitle = "";

  if (agreementType === "Beec") {
    leftTitle = hasSellerSigAgent
      ? singleOrPlural(
        sellerAgentsArr.length,
        `SAXIIXA WAKIILKA ${maleFemale(
          leftGender,
          "ISKA IIBIYAHA",
          "ISKA IIBISADA"
        )} DHULKA`,
        `SAXIIXA WAKIILLADA ISKA IIBIYAASHA DHULKA`
      )
      : singleOrPlural(
        sellersArr.length,
        `SAXIIXA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} DHULKA`,
        `SAXIIXA ISKA IIBIYAASHA DHULKA`
      );

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA BEEC ${acceptorWord(rightGender0)} ${maleFemale(
          rightGender,
          "IIBSADAHA",
          "IIBSATADA"
        )} DHULKA`,
        `SAXIIXA BEEC ${acceptorWord(rightGender0)} IIBSADAYAASHA DHULKA`
      )
      : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} DHULKA`,
        `SAXIIXA IIBSADAYAASHA DHULKA`
      );
  } else if (agreementType === "Hibo") {
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

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA HIBEYN ${acceptorWord(rightGender0)} ${maleFemale(
          rightGender,
          "QAATAHA",
          "QAATADA"
        )} DHULKA`,
        `SAXIIXA HIBEYN${acceptorWord(rightGender0)} QAATAYAASHA DHULKA`
      )
      : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} DHULKA`,
        `SAXIIXA QAATAYAASHA DHULKA`
      );
  } else if (agreementType === "Waqaf") {
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

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
        buyerAgentsArr.length,
        `SAXIIXA WAQAF ${acceptorWord(rightGender0)} ${maleFemale(
          rightGender,
          "QOFKA LOO WAQFAY",
          "QOFTA LOO WAQFAY"
        )} DHULKA`,
        `SAXIIXA WAQAF ${acceptorWord(rightGender0)} DADKA LOO WAQFAY DHULKA`
      )
      : singleOrPlural(
        buyersArr.length,
        `SAXIIXA ${maleFemale(
          rightGender,
          "QOFKA LOO WAQFAY",
          "QOFTA LOO WAQFAY"
        )} DHULKA`,
        `SAXIIXA DADKA LOO WAQFAY DHULKA`
      );
  }

  const signatureLine = "______________________________";

  // ========= WITNESSES =========
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
    agreement?.witnesses && agreement?.witnesses.length > 0
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
                        text: upper(w),
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

  // ========= NOTARY =========
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
          text: `REF: ${safe(agreement?.refNo)}, Tr. ${formatDate(
            agreement?.agreementDate
          )} `,
          size: 22,
          bold: true,
          underline: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: "Anigoo ah ",
          size: 24,
          font: "Times New Roman",
        }),
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

  // ========= MAIN CONTENT =========
  const content = [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: getPurposeTitle(),
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
            agreement?.agreementDate
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
          text: upper(T?.seller),
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
        new TextRun({
          text: `${resolvedSellerNames} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({
          text: `${sellernationality} `,
          font: "Times New Roman",
          size: 24,
          color: "FF0000",
        }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({
          text: `${sellerMotherName} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({
          text: `${sellerBirthPlace} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({
          text: `${sellerBirthYear} `,
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({
          text: `${sellerAddress} `,
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({
          text: `${sellerdocumentType} `,
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({
          text: `${sellerdocumentNumber} `,
          size: 24,
          bold: true,
          color: "FF0000",
        }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({
          text: `${sellerPhone}`,
          size: 24,
          bold: true,
          color: "FF0000",
        }),
      ],
    }),

    // BUYER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: upper(T?.buyer),
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
        new TextRun({
          text: `${resolvedBuyerNames} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({
          text: `${buyernationality} `,
          font: "Times New Roman",
          size: 24,
          color: "008000",
        }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({
          text: `${buyerMotherName} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({
          text: `${buyerBirthPlace} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({
          text: `${buyerBirthYear} `,
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({
          text: `${buyerAddress} `,
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({
          text: `${buyerdocumentType} `,
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({
          text: `${buyerdocumentNumber} `,
          size: 24,
          bold: true,
          color: "008000",
        }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({
          text: `${buyerPhone}`,
          size: 24,
          bold: true,
          color: "008000",
        }),
      ],
    }),

    // SELLER SECTION
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: resolvedHasSellerAgent
        ? [
          new TextRun({
            text: upper(T?.sellerAgent),
            size: 24,
            bold: true,
            underline: true,
          }),
          new TextRun({ text: " Anigoo ah ", size: 24 }),
          new TextRun({
            text: resolvedSellerAgentDetails,
            bold: true,
            color: "FF0000",
            size: 24,
          }),

          ...(resolvedSellerWakaaladText
            ? [new TextRun({ text: `, ${resolvedSellerWakaaladText}, `, size: 24 })]
            : []),

          new TextRun({
            text: `kana wakiil ah ${safe(T?.seller)} `,
            size: 24,
          }),
          new TextRun({
            text: resolvedSellerNames,
            bold: true,
            color: "FF0000",
            size: 24,
          }),

          new TextRun({
            text:
              `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
              `waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan ${safe(
                P?.actionVerb
              )} ${safe(P?.actionVerb2)} `,
            size: 24,
          }),
          new TextRun({
            text: resolvedBuyerNames,
            bold: true,
            color: "FF0000",
            size: 24,
          }),

          new TextRun({
            text:
              `, ${cabirText} cabirkiisu yahay${cabirFaahfaahin}, ` +
              `ku yaalla ${safe(service?.kuYaallo?.gobol)} - ${safe(
                service?.kuYaallo?.degmo
              )}, ` +
              `${service?.lottoLambar
                ? `Lotto Lambar: ${safe(service?.lottoLambar)}, `
                : ""
              }` +
              `Ku Milkiyay: ${safe(service?.kuMilkiyay)}, ` +
              `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
              `Tr. ${service?.taariikh ? formatDate(service?.taariikh) : ""}.`,
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

          ...(service?.ahna
            ? [new TextRun({ text: ` Ahna: ${safe(service?.ahna)}.`, size: 24 })]
            : []),

          ...(service?.kaKooban
            ? [new TextRun({ text: ` Ka kooban: ${safe(service?.kaKooban)}.`, size: 24 })]
            : []),

          ...(getAgentPriceSentence()
            ? [new TextRun({ text: getAgentPriceSentence(), size: 24 })]
            : []),
        ]
        : [
          new TextRun({ text: "Ugu horeyn anigoo ah ", size: 24 }),
          new TextRun({
            text: resolvedSellerNames,
            bold: true,
            color: "FF0000",
            size: 24,
          }),
          new TextRun({
            text:
              `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
              `waxa aan ${safe(P?.actionVerb)} ${safe(P?.actionVerb2)} `,
            size: 24,
          }),
          new TextRun({
            text: resolvedBuyerNames,
            bold: true,
            color: "FF0000",
            size: 24,
          }),

          new TextRun({
            text:
              `, ${cabirText} cabirkiisu yahay${cabirFaahfaahin}, ` +
              `ku yaalla ${safe(service?.kuYaallo?.gobol)} - ${safe(
                service?.kuYaallo?.degmo
              )}, ` +
              `${service?.lottoLambar
                ? `Lotto Lambar: ${safe(service?.lottoLambar)}, `
                : ""
              }` +
              `Ku Milkiyay: ${safe(service?.kuMilkiyay)}, ` +
              `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
              `Tr. ${service?.taariikh ? formatDate(service?.taariikh) : ""}.`,
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

          ...(service?.ahna
            ? [new TextRun({ text: ` Ahna: ${safe(service?.ahna)}.`, size: 24 })]
            : []),

          ...(service?.kaKooban
            ? [new TextRun({ text: ` Ka kooban: ${safe(service?.kaKooban)}.`, size: 24 })]
            : []),

          ...(getPriceSentence()
            ? [new TextRun({ text: getPriceSentence(), size: 24 })]
            : []),
        ],
    }),

    // BUYER SECTION
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: resolvedHasBuyerAgent
        ? [
          new TextRun({
            text: getBuyerAcceptTitle(),
            size: 24,
            underline: true,
            bold: true,
          }),
          new TextRun({ text: " Anigoo ah ", size: 24 }),
          new TextRun({
            text: resolvedBuyerAgentDetails,
            bold: true,
            color: "008000",
            size: 24,
          }),

          ...(resolvedBuyerWakaaladText
            ? [new TextRun({ text: `, ${resolvedBuyerWakaaladText}, `, size: 24 })]
            : []),

          new TextRun({
            text:
              `kana wakiil ah ${resolvedBuyerNames}, kana caafimaad qaba dhanka maskaxda iyo jirkaba, ` +
              `xiskayguna taam yahay, cid igu qasabtayna aysan jirin, `,
            size: 24,
          }),

          new TextRun({
            text: getBuyerAcceptanceText(),
            size: 24,
          }),

          new TextRun({
            text: resolvedBuyerNames,
            bold: true,
            color: "008000",
            size: 24,
          }),

          new TextRun({
            text: getBuyerClosingText(),
            size: 24,
          }),
        ]
        : [
          new TextRun({
            text:
              agreementType === "Beec"
                ? "Anigoo ah iibsadaha "
                : agreementType === "Hibo"
                  ? "Anigoo ah qaataha "
                  : agreementType === "Waqaf"
                    ? "Anigoo ah qofka loo waqfay "
                    : "Anigoo ah ",
            size: 24,
          }),
          new TextRun({
            text: resolvedBuyerNames,
            bold: true,
            color: "008000",
            size: 24,
          }),
          new TextRun({
            text:
              `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
              getBuyerAcceptanceText(),
            size: 24,
          }),
          new TextRun({
            text: resolvedBuyerNames,
            bold: true,
            color: "008000",
            size: 24,
          }),
          new TextRun({
            text: getBuyerClosingText(),
            size: 24,
          }),
        ],
    }),

    // OPTIONAL LOCAL SIGNATURES
    ...(includeLocalSignatures
      ? [
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
                  borders: hiddenBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [
                        new TextRun({
                          text: leftTitle,
                          bold: true,
                          size: 22,
                          underline: {},
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: safe(leftName),
                          bold: true,
                          size: 22,
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: signatureLine, size: 22 })],
                    }),
                  ],
                }),

                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: hiddenBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [
                        new TextRun({
                          text: rightTitle,
                          bold: true,
                          size: 22,
                          underline: {},
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: safe(rightName),
                          bold: true,
                          size: 22,
                        }),
                      ],
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

        ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
        ...notarySection,
      ]
      : []),
  ];

  return content;
};