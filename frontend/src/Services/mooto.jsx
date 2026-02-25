// src/docTemplates/mooto.js
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
 * buildMootoDoc (SIDA SAAMI.JS OO KALE)
 * - Includes: personLine + buildPeopleRuns + agents + wakaalad + signatures + witnesses + notary
 * - Keeps ALL mooto contents (type, chassis, model, color, cylinder, plate, ownership, price)
 */
export const buildMootoDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,
  getTitles,
  getPhrases, // optional (not required but kept)
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

  // ✅ PERSON LINE (SIDA SAAMI.JS)
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

  // ✅ BUILD PEOPLE RUNS (SIDA SAAMI.JS)
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

  // (optional, if you want verbs later)
  const P = typeof getPhrases === "function"
    ? getPhrases(agreement.serviceType, agreement.agreementType)
    : null;

  // ================== borders ==================
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // ================= SIGNATURES (MOOTO + GENDER) =================
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
    leftPeople.length > 1
      ? joinSigNames(leftPeople)
      : safe(leftPeople?.[0]?.fullName || "").toUpperCase();

  const rightName =
    rightPeople.length > 1
      ? joinSigNames(rightPeople)
      : safe(rightPeople?.[0]?.fullName || "").toUpperCase();

  let leftTitle = "";
  let rightTitle = "";

  if (agreementType === "Beec") {
    leftTitle = hasSellerSigAgent
      ? singleOrPlural(
          sellerAgentsArr.length,
          `SAXIIXA WAKIILKA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} MOOTADA`,
          `SAXIIXA WAKIILLADA ISKA IIBIYAASHA MOOTADA`
        )
      : singleOrPlural(
          sellersArr.length,
          `SAXIIXA ${maleFemale(leftGender, "ISKA IIBIYAHA", "ISKA IIBISADA")} MOOTADA`,
          `SAXIIXA ISKA IIBIYAASHA MOOTADA`
        );

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
          buyerAgentsArr.length,
          `SAXIIXA BEEC U AQBALAHA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} MOOTADA`,
          `SAXIIXA BEEC U AQBALAHA IIBSADAYAASHA MOOTADA`
        )
      : singleOrPlural(
          buyersArr.length,
          `SAXIIXA ${maleFemale(rightGender, "IIBSADAHA", "IIBSATADA")} MOOTADA`,
          `SAXIIXA IIBSADAYAASHA MOOTADA`
        );
  } else if (agreementType === "Hibo") {
    leftTitle = hasSellerSigAgent
      ? singleOrPlural(
          sellerAgentsArr.length,
          `SAXIIXA WAKIILKA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} MOOTADA`,
          `SAXIIXA WAKIILLADA HIBEYAASHA MOOTADA`
        )
      : singleOrPlural(
          sellersArr.length,
          `SAXIIXA ${maleFemale(leftGender, "HIBEYAHA", "HIBEYSADA")} MOOTADA`,
          `SAXIIXA HIBEYAASHA MOOTADA`
        );

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
          buyerAgentsArr.length,
          `SAXIIXA HIBEYN U AQBALAHA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} MOOTADA`,
          `SAXIIXA HIBEYN U AQBALAHA QAATAYAASHA MOOTADA`
        )
      : singleOrPlural(
          buyersArr.length,
          `SAXIIXA ${maleFemale(rightGender, "QAATAHA", "QAATADA")} MOOTADA`,
          `SAXIIXA QAATAYAASHA MOOTADA`
        );
  } else if (agreementType === "Waqaf") {
    leftTitle = hasSellerSigAgent
      ? singleOrPlural(
          sellerAgentsArr.length,
          `SAXIIXA WAKIILKA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} MOOTADA`,
          `SAXIIXA WAKIILLADA WAAQIFAYAASHA MOOTADA`
        )
      : singleOrPlural(
          sellersArr.length,
          `SAXIIXA ${maleFemale(leftGender, "WAAQIFAHA", "WAAQIFADA")} MOOTADA`,
          `SAXIIXA WAAQIFAYAASHA MOOTADA`
        );

    rightTitle = hasBuyerSigAgent
      ? singleOrPlural(
          buyerAgentsArr.length,
          `SAXIIXA WAQAF U AQBALAHA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} MOOTADA`,
          `SAXIIXA WAQAF U AQBALAHA DADKA LOO WAQFAY MOOTADA`
        )
      : singleOrPlural(
          buyersArr.length,
          `SAXIIXA ${maleFemale(rightGender, "QOFKA LOO WAQFAY", "QOFTA LOO WAQFAY")} MOOTADA`,
          `SAXIIXA DADKA LOO WAQFAY MOOTADA`
        );
  }

  const signatureLine = "______________________________";

  // ================= MARQAATIYAASHA (SIDA SAAMI.JS) =================
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

  const witnessNames = (agreement?.witnesses || []).filter(Boolean);

  const witnessesTable =
    witnessNames.length > 0
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
          rows: Array.from({ length: Math.ceil(witnessNames.length / 2) }).map((_, i) => {
            const leftW = witnessNames[i * 2];
            const rightW = witnessNames[i * 2 + 1];

            const cell = (name) =>
              new TableCell({
                borders: hiddenBorders,
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [
                      new TextRun({
                        text: (name || "").toUpperCase(),
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
              });

            return new TableRow({
              children: [cell(leftW), cell(rightW)],
            });
          }),
        })
      : null;

  // ================= SUGITAANKA NOOTAAYADA (SIDA SAAMI.JS) =================
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

  // ================== RETURN ==================
  return [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text:
            agreement?.agreementType === "Beec"
              ? "UJEEDDO: KALA GADASHO MOOTO"
              : agreement?.agreementType === "Hibo"
              ? "UJEEDDO: HIBEYN MOOTO"
              : agreement?.agreementType === "Waqaf"
              ? "UJEEDDO: WAQFID MOOTO"
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
            agreement?.agreementDate
          )}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),

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

    // sellers details (FULL)
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

    // buyers details (FULL)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: buildPeopleRuns(buyers, "008000", true),
    }),

    // Seller section (KEEP ALL CONTENT)
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
            new TextRun({ text: `, ${wakaaladText}, kana wakiil ah ${T?.seller || ""} `, size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: sellersPlural
                ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid nagu qasabtayna aysan jirin, waxaan ka cadeyneynaa nootaayaha iyo marqaatiyaasha hortooda in aan ka iibinay kuna wareejinay `
                : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxaan ka cadeynayaa nootaayaha iyo marqaatiyaasha hortooda in aan ka iibiyey kuna wareejiyey `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, mooto nooceedu yahay `, size: 24 }),
            new TextRun({ text: `${safe(service?.type)} `, size: 24 }),
            new TextRun({ text: `Chassis No. ${safe(service?.chassisNo)} `, size: 24 }),
            new TextRun({ text: `modelkeedu yahay ${safe(service?.modelYear)} `, size: 24 }),
            new TextRun({ text: `midabkeedu yahay ${safe(service?.color)} `, size: 24 }),
            new TextRun({ text: `Cylinder ${safe(service?.cylinder)} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${safe(service?.plateNo)} `, size: 24 }),
            new TextRun({ text: `kana soo baxday ${safe(service?.issuedByPlate)} `, size: 24 }),
            new TextRun({ text: `Tr. ${formatDate(service?.plateIssueDate)} `, size: 24 }),
            new TextRun({ text: ` wuxuu ${T?.seller || ""} mootadaas ku milkiyay `, size: 24 }),
            new TextRun({
              text: `${safe(service?.ownershipType)} lahaanshaha mootada lambarkiisu yahay `,
              size: 24,
            }),
            new TextRun({ text: `${safe(service?.ownershipBookNo)} `, size: 24 }),
            new TextRun({ text: `kana soo baxday ${safe(service?.issuedByPlate)} `, size: 24 }),
            new TextRun({ text: `Tr. ${formatDate(service?.ownershipIssueDate)} `, size: 24 }),
            new TextRun({
              text: ` waxaan ku gaday anigoo ka wakiil ah ${T?.seller || ""} mootada lacag dhan $${formatCurrency(
                agreement?.sellingPrice
              )} (${numberToSomaliWords(agreement?.sellingPrice)} Doolarka Mareykanka ah).`,
              size: 24,
            }),
          ]
        : [
            new TextRun({ text: sellersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: sellersPlural
                ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid nagu qasabtayna aysan jirin, waxaan ka iibinay kuna wareejinay `
                : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxaan ka iibiyey kuna wareejiyey `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, mooto nooceedu yahay `, size: 24 }),
            new TextRun({ text: `${safe(service?.type)} `, size: 24 }),
            new TextRun({ text: `Chassis No. ${safe(service?.chassisNo)} `, size: 24 }),
            new TextRun({ text: `modelkeedu yahay ${safe(service?.modelYear)} `, size: 24 }),
            new TextRun({ text: `midabkeedu yahay ${safe(service?.color)} `, size: 24 }),
            new TextRun({ text: `Cylinder ${safe(service?.cylinder)} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${safe(service?.plateNo)} `, size: 24 }),
            new TextRun({ text: `kana soo baxday ${safe(service?.issuedByPlate)} `, size: 24 }),
            new TextRun({ text: `Tr. ${formatDate(service?.plateIssueDate)} `, size: 24 }),
            new TextRun({ text: ` wuxuu ${T?.seller || ""} mootadaas ku milkiyay `, size: 24 }),
            new TextRun({
              text: `${safe(service?.ownershipType)}a lahaanshaha mootada lambarkiisu yahay `,
              size: 24,
            }),
            new TextRun({ text: `${safe(service?.ownershipBookNo)} `, size: 24 }),
            new TextRun({ text: `kana soo baxday ${safe(service?.issuedByPlate)} `, size: 24 }),
            new TextRun({ text: `Tr. ${formatDate(service?.ownershipIssueDate)} `, size: 24 }),
            new TextRun({
              text: ` waxaan ku gaday lacag dhan $${formatCurrency(agreement?.sellingPrice)} (${numberToSomaliWords(
                agreement?.sellingPrice
              )} Doolarka Mareykanka ah).`,
              size: 24,
            }),
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
                ? `, ahna ${T?.buyerAgent || ""}, kana caafimaad qabna dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid nagu qasabtayna aysan jirin, waxa aan aqbalnay iibkaan anagoo ku qanacsan raalina ka ah. Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen `
                : `, ahna ${T?.buyerAgent || ""}, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ]
        : [
            new TextRun({ text: buyersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: buyersPlural
                ? `, ahna ${T?.buyer || ""}, kana caafimaad qabna dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid nagu qasabtayna aysan jirin, waxa aan aqbalnay iibkaan anagoo ku qanacsan raalina ka ah. Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen `
                : `, ahna ${T?.buyer || ""}, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid i qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ],
    }),

    // SIGNATURE TABLE (SIDA SAAMI.JS)
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
                  children: [new TextRun({ text: leftTitle, bold: true, size: 22, underline: {} })],
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
              borders: hiddenBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [new TextRun({ text: rightTitle, bold: true, size: 22, underline: {} })],
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

    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),

    ...notarySection,
  ];
};