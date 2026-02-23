// src/docs/cases/DhulBanaan.case.js
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
import numberToSomaliWords, { formatCurrency, formatDate } from "../components/numberToSomaliWords";

// helper: safe string
const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

// helper: signature lines (multi names)
const signatureLine = "__________________________";

const buildMultiNameSignatureBlock = (names = [], options = {}) => {
  const { upper = true } = options;

  const clean = (names || [])
    .map((n) => safe(n))
    .filter(Boolean)
    .map((n) => (upper ? n.toUpperCase() : n));

  if (clean.length === 0) {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "", size: 24 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: signatureLine, size: 24 })],
      }),
    ];
  }

  const children = [];
  clean.forEach((n) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: n, bold: true, size: 24 })],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: signatureLine, size: 24 })],
      })
    );
  });

  return children;
};

export const buildDhulBanaanCase = ({
  agreement,
  service,

  // ✅ WAXYAABAHA AAD HORE U HAYSAY (si content-ka u sii ahaado sida uu yahay)
  T,
  P,
  sellerNames,
  sellernationality,
  sellerMotherName,
  sellerBirthPlace,
  sellerBirthYear,
  sellerAddress,
  sellerdocumentType,
  sellerdocumentNumber,
  sellerPhone,

  buyerNames,
  buyernationality,
  buyerMotherName,
  buyerBirthPlace,
  buyerBirthYear,
  buyerAddress,
  buyerdocumentType,
  BuyerdocumentNumber,
  buyerPhone,

  // agents
  hasSellerAgent,
  sellerAgentDetails,
  wakaaladText,

  hasBuyerAgent,
  buyerAgentDetails,
}) => {
  /* ================================
     CABIR + MILKIYAD DETAILS (SIDAADA)
  ================================== */

  const cabirText =
    service?.cabirka === "Boosas"
      ? `${service?.cabirka} ${service?.tiradaBoosaska} (${numberToSomaliWords(service?.tiradaBoosaska) || ""} Boos ah)`
      : (service?.cabirka || "");

  const cabirFaahfaahin = service?.cabirFaahfaahin
    ? ` (${service.cabirFaahfaahin})`
    : "";

  let milkiyadDetails = "";
  if (service?.kuMilkiyay === "Aato") {
    milkiyadDetails =
      `Caddeyn Lambar: ${service?.aato?.cadeynLambar || ""}, ` +
      `kasoo baxday ${service?.aato?.kasooBaxday || ""}, ` +
      `ku saxiixan ${service?.aato?.kuSaxiixan || ""}.`;
  } else if (service?.kuMilkiyay === "Sabarloog") {
    milkiyadDetails =
      `Sabarloog No: ${service?.sabarloog?.sabarloogNo || ""}, ` +
      `Bollettario No: ${service?.sabarloog?.bollettarioNo1 || ""}` +
      `${service?.sabarloog?.bollettarioNo2 ? " / " + service.sabarloog.bollettarioNo2 : ""}, ` +
      `Rasiid Nambar: ${service?.sabarloog?.rasiidNambar || ""}, ` +
      `Tr. ${service?.sabarloog?.rasiidTaariikh ? formatDate(service.sabarloog.rasiidTaariikh) : ""}, ` +
      `D. Hoose ee: ${service?.sabarloog?.dHooseEe || ""}.`;
  } else if (service?.kuMilkiyay === "Maxkamad") {
    milkiyadDetails =
      `Warqad Lam: ${service?.maxkamad?.warqadLam || ""}, ` +
      `Maxkamada: ${service?.maxkamad?.maxkamada || ""}, ` +
      `Garsooraha: ${service?.maxkamad?.garsooraha || ""}, ` +
      `Ku saxiixan: ${service?.maxkamad?.kuSaxiixan || ""}.`;
  }

  /* ================================
   SIGNATURES (FIXED LOGIC)
   - haddii agent jiro → seller/buyer signatures ha soo bixin
   - agent signature = magaca kaliya (ma aha details text)
================================== */

const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

// ✅ ka saar details-ka, magac kaliya soo qaado
const pickName = (v) => {
  // haddii uu yahay object { fullName } ama string
  if (!v) return "";
  if (typeof v === "string") {
    // haddii aad mararka qaar ku hayso "NAME, SOMALI AH, ..." → ka qaado qaybta koowaad
    return safe(v.split(",")[0]);
  }
  return safe(v.fullName || "");
};

const sellersArr = agreement?.dhinac1?.sellers || [];
const buyersArr = agreement?.dhinac2?.buyers || [];

const sellerSigNames = sellersArr.map((p) => safe(p?.fullName)).filter(Boolean);
const buyerSigNames = buyersArr.map((p) => safe(p?.fullName)).filter(Boolean);

const isPluralSeller = sellerSigNames.length > 1;
const isPluralBuyer = buyerSigNames.length > 1;

const sellerGender = String(sellersArr?.[0]?.gender || "male").toLowerCase();
const buyerGender = String(buyersArr?.[0]?.gender || "male").toLowerCase();

const isFemaleSeller = sellerGender === "female";
const isFemaleBuyer = buyerGender === "female";

// titles
const leftTitle = isPluralSeller
  ? "SAXIIXA ISKA IIBIYAASHA"
  : isFemaleSeller
    ? "SAXIIXA ISKA IIBISADA"
    : "SAXIIXA ISKA IIBIYAHA";

const rightTitle = isPluralBuyer
  ? "SAXIIXA IIBSADAYAASHA"
  : isFemaleBuyer
    ? "SAXIIXA IIBSATO"
    : "SAXIIXA IIBSADE";

const sellerAgentTitle = "SAXIIXA WAKIILKA IIBIYAHA";
const buyerAgentTitle = "SAXIIXA WAKIILKA IIBSADAHA";

const signatureLine = "__________________________";

// ✅ haddii agent jiro, seller/buyer ha soo bixin
const showMainParties = !(hasSellerAgent || hasBuyerAgent);

// ✅ agent names (magac kaliya)
const sellerAgentName = hasSellerAgent ? pickName(sellerAgentDetails) : "";
const buyerAgentName = hasBuyerAgent ? pickName(buyerAgentDetails) : "";

/* ================================
   BUILD SIGNATURE TABLE ROWS
================================== */

// helper: multi names (MARYAMA... line, then signatureLine, etc)
const buildNameLines = (names = []) => {
  const clean = (names || []).map(safe).filter(Boolean).map((n) => n.toUpperCase());
  if (clean.length === 0) {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: signatureLine, size: 24 })],
      }),
    ];
  }

  const out = [];
  clean.forEach((n) => {
    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: n, bold: true, size: 24 })],
      })
    );
    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: signatureLine, size: 24 })],
      })
    );
  });
  return out;
};

// ✅ 1) MAIN SELLER/BUYER row (kaliya haddii showMainParties = true)
const mainRow = showMainParties
  ? [
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
                children: [new TextRun({ text: leftTitle, bold: true, underline: {}, size: 24 })],
              }),
              ...buildNameLines(sellerSigNames),
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
                children: [new TextRun({ text: rightTitle, bold: true, underline: {}, size: 24 })],
              }),
              ...buildNameLines(buyerSigNames),
            ],
          }),
        ],
      }),
    ]
  : [];

// ✅ 2) AGENTS row (kaliya haddii agent jiro) — MAGAC KALIYA
const agentRow =
  hasSellerAgent || hasBuyerAgent
    ? [
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
              children: hasSellerAgent
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [new TextRun({ text: sellerAgentTitle, bold: true, underline: {}, size: 24 })],
                    }),
                    ...buildNameLines([sellerAgentName]),
                  ]
                : [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [new TextRun({ text: "", size: 24 })],
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
              children: hasBuyerAgent
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [new TextRun({ text: buyerAgentTitle, bold: true, underline: {}, size: 24 })],
                    }),
                    ...buildNameLines([buyerAgentName]),
                  ]
                : [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [new TextRun({ text: "", size: 24 })],
                    }),
                  ],
            }),
          ],
        }),
      ]
    : [];

/* ================================
   Final: rows to use in Table
================================== */
const signatureRows = [...mainRow, ...agentRow];

// ⬇️ marka aad sameyneyso Table rows: signatureRows isticmaal
  /* ================================
     OUTPUT (CONTENT-KAAGA OO DHAN)
  ================================== */
  return [
    // QORAALKA BILOWGA HESHIISKA
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: T.seller.toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `${sellerNames} `,
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

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: T.buyer.toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `${buyerNames} `,
          font: "Times New Roman",
          size: 24,
          bold: true,
          color: "008000",
        }),
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
            new TextRun({ text: T.sellerAgent.toUpperCase(), size: 24, bold: true, underline: true }),
            new TextRun({ text: " Anigoo ah ", size: 24 }),
            new TextRun({ text: sellerAgentDetails, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, ${wakaaladText}, kana wakiil ah iska ${T.seller} Dhulka `, size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, ` +
                `waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan  ${P.actionVerb} ${P.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `,  ${cabirText} cabirkiisu yahay ${cabirFaahfaahin}, ` +
                `ku yaalla ${service?.kuYaallo?.gobol || ""} - ${service?.kuYaallo?.degmo || ""}, ` +
                `${service?.lottoLambar ? `Lotto Lambar: ${service.lottoLambar}, ` : ""}` +
                `Ku Milkiyay: ${service?.kuMilkiyay || ""}, ` +
                `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
                `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
              size: 24,
              bold: true,
            }),
            new TextRun({
              text:
                ` Soohdinta: Koonfur ${service?.soohdinta?.koonfur || ""}, ` +
                `Waqooyi ${service?.soohdinta?.waqooyi || ""}, ` +
                `Galbeed ${service?.soohdinta?.galbeed || ""}, ` +
                `Bari ${service?.soohdinta?.bari || ""}.`,
              size: 24,
              bold: true,
            }),
            ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${service.ahna}.`, size: 24 })] : []),
            ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${service.kaKooban}.`, size: 24 })] : []),
            ...(agreement?.sellingPrice
              ? [
                  new TextRun({
                    text:
                      ` Waxaan ku gaday anigoo ka wakiil ah ${T.seller} dhulka lacag dhan $${formatCurrency(agreement.sellingPrice)} ` +
                      `(${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,
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
                `waxa aan  ${P.actionVerb} ${P.actionVerb2} `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text:
                `,  ${cabirText} cabirkiisu yahay ${cabirFaahfaahin}, ` +
                `ku yaalla ${service?.kuYaallo?.gobol || ""} - ${service?.kuYaallo?.degmo || ""}, ` +
                `${service?.lottoLambar ? `Lotto Lambar: ${service.lottoLambar}, ` : ""}` +
                `Ku Milkiyay: ${service?.kuMilkiyay || ""}, ` +
                `${milkiyadDetails ? milkiyadDetails + " " : ""}` +
                `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
              size: 24,
            }),
            new TextRun({
              text:
                ` Soohdinta: Koonfur ${service?.soohdinta?.koonfur || ""}, ` +
                `Waqooyi ${service?.soohdinta?.waqooyi || ""}, ` +
                `Galbeed ${service?.soohdinta?.galbeed || ""}, ` +
                `Bari ${service?.soohdinta?.bari || ""}.`,
              size: 24,
            }),
            ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${service.ahna}.`, size: 24 })] : []),
            ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${service.kaKooban}.`, size: 24 })] : []),
            ...(agreement?.sellingPrice
              ? [
                  new TextRun({
                    text:
                      ` Waxaan ku gaday lacag dhan $${formatCurrency(agreement.sellingPrice)} ` +
                      `(${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,
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
      spacing: { after: 140 },
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
            new TextRun({ text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`, size: 24 }),
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
            new TextRun({ text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`, size: 24 }),
          ],
    }),

    /* =========================
       ✅ SIGNATURES (WAXA KA MAQAN)
    ========================== */
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
            // LEFT: SELLERS
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
                  children: [new TextRun({ text: leftTitle, bold: true, underline: {}, size: 24 })],
                }),
                ...buildMultiNameSignatureBlock(sellerSigNames, { upper: true }),
              ],
            }),

            // RIGHT: BUYERS
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
                  children: [new TextRun({ text: rightTitle, bold: true, underline: {}, size: 24 })],
                }),
                ...buildMultiNameSignatureBlock(buyerSigNames, { upper: true }),
              ],
            }),
          ],
        }),

        // OPTIONAL: AGENTS signatures row
        ...(hasSellerAgent || hasBuyerAgent
          ? [
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
                    children: hasSellerAgent
                      ? [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 120 },
                            children: [new TextRun({ text: sellerAgentTitle, bold: true, underline: {}, size: 24 })],
                          }),
                          ...buildMultiNameSignatureBlock([sellerAgentDetails], { upper: true }),
                        ]
                      : [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 120 },
                            children: [new TextRun({ text: "", size: 24 })],
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
                    children: hasBuyerAgent
                      ? [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 120 },
                            children: [new TextRun({ text: buyerAgentTitle, bold: true, underline: {}, size: 24 })],
                          }),
                          ...buildMultiNameSignatureBlock([buyerAgentDetails], { upper: true }),
                        ]
                      : [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 120 },
                            children: [new TextRun({ text: "", size: 24 })],
                          }),
                        ],
                  }),
                ],
              }),
            ]
          : []),
      ],
    }),
  ];
};