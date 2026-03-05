// src/services/shaqaaleysiin.js
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
 * buildShaqaaleysiinDoc (DAMAANAD)
 * - Sida sawirka Word-ka: Ujeeddo + Ku + 3 paragraph + 2 saxiix + witnesses + sugitaan nootaayo
 *
 * people:
 *  - sellers[0] = DAMIINUL MAALKA (Damaanad bixiyaha)
 *  - buyers[0]  = LA DAAMIINTAHA (Shaqaalaha la damaanadayo)
 *
 * service:
 *  - employerName: "ISGAARSIINTA HORMUUD"
 *
 * agreement:
 *  - refNo, agreementDate, witnesses: [{name,phone} | string] (2)
 */
export const buildShaqaaleysiinDoc = ({
  agreement,
  service,
  formatDate,

  sellers = [], // ✅ DAMIINUL MAALKA
  buyers = [], // ✅ LA DAAMIINTAHA

  notaryName,
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
  const upper = (v) => safe(v).toUpperCase();

  const refNo = safe(agreement?.refNo);
  const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";

  const employerName = upper(service?.magac);

  const damiin = sellers?.[0] || {};
  const damiinta = buyers?.[0] || {};

  const damiinName = upper(damiin?.fullName);
  const damiintaName = upper(damiinta?.fullName);

  // details sida Word-ka (Somali ah, hooyadiina..., ku dhashay..., sannadkii..., degan..., lehna..., Tell: ...)
  const personDetails = (p) => {
    const nat = safe(p?.nationality);
    const mother = safe(p?.motherName);
    const birthPlace = safe(p?.birthPlace);
    const birthYear = safe(p?.birthYear);
    const address = safe(p?.address);
    const docType = safe(p?.documentType);
    const docNo = safe(p?.documentNumber);
    const phone = safe(p?.phone);

    const parts = [];
    if (nat) parts.push(`${nat} ah`);
    if (mother) parts.push(`hooyadiina la yiraahdo ${mother}`);
    if (birthPlace) parts.push(`ku dhashay ${birthPlace}`);
    if (birthYear) parts.push(`sannadkii ${birthYear}`);
    if (address) parts.push(`degan ${address}`);
    if (docType || docNo) parts.push(`lehna ${docType || "Document"} lambarkiisu yahay ${docNo}`);
    if (phone) parts.push(`Tell: ${phone}`);
    return parts.filter(Boolean).join(", ");
  };

  const damiinDetails = personDetails(damiin);
  const damiintaDetails = personDetails(damiinta);

  // ====== styles ======
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const tableNoBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const signatureLine = "______________________________";

  // ====== HEADERS (CENTER) ======
  const ujeeddoLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 50 },
    children: [
      new TextRun({
        text: "UJEEDDO: DAMAANAD",
        bold: true,
        underline: {},
        size: 26,
        font: "Times New Roman",
      }),
    ],
  });

  const kuLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 170 },
    children: [
      new TextRun({
        text: "KU: ",
        bold: true,
        underline: {},
        size: 26,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        underline: {},
        size: 26,
        font: "Times New Roman",
      }),
    ],
  });

  // ====== PARAGRAPHS (SIDA SAWIRKA) ======
  const p1 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: `Maanta oo ay taariikhdu tahay ${tr}, anigoo ah `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiinName || "__________",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, ${damiinDetails ? damiinDetails + "," : ""} `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text:
          `waxaan halkan ku cadeynayaa in aan damiinul-maal buuxa ka ahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiintaName || "__________",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, ${damiintaDetails ? damiintaDetails + "," : ""} `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `kana mid ah shaqaalaha shirkadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, wax waliba oo dhibaato ah uu u geysto hantida iyo sumcadda shirkadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const p2 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160 },
    children: [
      new TextRun({
        text:
          `Mar kale waxaan balan qaadaya in aan damiinul-maal iyo mas'uul ka ahay la damiintaha. `
          + `wax waliba oo dhibaato ah uu u geysto hantida iyo sumcadda shirkadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text:
          ` iyo dhibaato kasta ay ku qaamoobeyso shirkadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ee uu geysto.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // p3 waa hadalka LA DAAMIINTAHA (sida sawirka)
  const p3 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 210 },
    children: [
      new TextRun({
        text: `Aniga oo ah `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiintaName || "__________",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text:
          ` waxa aan balan qaadaya in aan ilaalin doono hantida iyo sumcadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: employerName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text:
          ` isla markaana an u gudan doono waajibadkeyga shaqo sida ugu haboon.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // ====== SIGNATURES (SIDA SAWIRKA) ======
  const sigTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableNoBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: hiddenBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "SAXIIXA DAMIINUL MAALKA",
                    bold: true,
                    underline: {},
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 70 },
                children: [
                  new TextRun({
                    text: damiinName || "________________",
                    bold: true,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
              }),
            ],
          }),

          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: hiddenBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "SAXIIXA LA DAMIINTAHA",
                    bold: true,
                    underline: {},
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 70 },
                children: [
                  new TextRun({
                    text: damiintaName || "________________",
                    bold: true,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // ====== WITNESSES (HA LAGA TAGIN) ======
  const witnessesTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 220, after: 110 },
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

  const witnesses = Array.isArray(agreement?.witnesses) ? agreement.witnesses : [];

  const toWitnessLine = (w) => {
    if (!w) return "";
    if (typeof w === "string") return upper(w);
    const name = safe(w?.name || w?.fullName);
    const phone = safe(w?.phone);
    return upper(phone ? `${name}(${phone})` : name);
  };

  const witnessCells =
    witnesses.length > 0
      ? witnesses.slice(0, 2).map((w) => {
          const line = toWitnessLine(w);
          return new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: hiddenBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: line || "__________",
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
        })
      : [];

  const witnessesTable =
    witnessCells.length > 0
      ? new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableNoBorders,
          rows: [new TableRow({ children: witnessCells })],
        })
      : null;

  // ====== NOTARY SECTION (SUGITAANKA NOOTAAYADA) ======
  const notarySection = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 260, after: 120 },
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
          text: `Ref: ${refNo || "____"}, Tr. ${tr || "____"}, `,
          bold: true,
          underline: true,
          size: 22,
          font: "Times New Roman",
        }),
        new TextRun({ text: "Anigoo ah ", size: 24, font: "Times New Roman" }),
        new TextRun({
          text: `${notaryName}, `,
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
        new TextRun({
          text:
            "waxaan sugayaa in saxiixyada kor ku xusan iyo kuwa ku keydsan diiwaankuba ay yihiin kuwo run ah " +
            "ee lagu saxiixay horteyda, waana sugitaan ansax ah, oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka Soomaaliya.",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 40 },
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
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: notaryName,
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

  return [
    ujeeddoLine,
    kuLine,
    p1,
    p2,
    p3,
    sigTable,
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
  ];
};