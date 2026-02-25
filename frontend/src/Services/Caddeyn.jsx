// src/docs/cases/Caddeyn.case.js
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

import { GW } from "../helpers/genderWords"; // path-kaaga sax
import { formatDate } from "../helpers/formatDate";

export const buildCaddeynCase = ({ agreement }) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;

  // ✅ W0: qofka grantor-ka 1aad
  const W0 = GW(grantors?.[0]?.gender || "male");

  const formatGrantor = (p) => {
    if (!p) return "";
    const W = GW(p.gender || "male");

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, ${W.hooyo} la yiraahdossss ${mother}, ${W.dhalasho} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  const formatAgent = (p) => {
    if (!p) return "";
    const W = GW(p.gender || "male");

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, ${W.hooyo} la yiraahdo ${mother}, ${W.dhalasho} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // ✅ magac bold + rest normal
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = (people || [])
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p);
        const rest = fullText.startsWith(fullName)
          ? fullText.slice(fullName.length)
          : `, ${fullText}`;
        return { fullName, rest };
      });

    if (items.length === 0) return [];

    if (items.length === 1) {
      return [
        new TextRun({ text: items[0].fullName, bold: true, size: 24 }),
        new TextRun({ text: items[0].rest, size: 24 }),
      ];
    }

    const runs = [];
    items.forEach((it, idx) => {
      if (idx > 0) {
        const isLast = idx === items.length - 1;
        runs.push(new TextRun({ text: isLast ? " iyo " : ", ", size: 24 }));
      }
      runs.push(new TextRun({ text: it.fullName, bold: true, size: 24 }));
      runs.push(new TextRun({ text: it.rest, size: 24 }));
    });

    return runs;
  };
 const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };
  // ✅ hal qof -> gender words; dad badan -> “qabtaan”
  const healthText = isPluralGrantor
    ? " kana caafimaad qabaan dhanka maskaxda iyo jirkaba, xiskeennuna taam yahay, cid nagu qasbeysana aysan jirin Caddeyntan, waxaan qoralkan ugu caddeynaynaa "
    : ` kana caafimaad ${W0.camifaad} dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasbeysana aysan jirin Caddeyntan, waxaan qoralkan ugu caddeynayaa `;

  // signatures
  const leftTitle = "SAXIIXA CADDEEYAHA";
  const rightTitle = "SAXIIXA LOO CADDEEYAHA";

  const joinNames = (arr = []) =>
    (arr || []).filter(Boolean).map((p) => safe(p.fullName)).filter(Boolean).join(" , ");

  const leftName = isPluralGrantor ? joinNames(grantors) : safe(grantors?.[0]?.fullName);
  const rightName = agents.length > 1 ? joinNames(agents) : safe(agents?.[0]?.fullName);

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

  return [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200},
      children: [
        new TextRun({
          text: "UJEEDDO: CADDEYN",
          bold: true,
          underline: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // BODY
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 320 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, ${isPluralGrantor ? "anagoo kala ah " : "anigoo ah "
            }`,
          size: 24,
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: healthText, size: 24 }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({ text: ".", size: 24 }),
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
                    new TextRun({ text: leftTitle, bold: true, size: 24, underline: {} }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(leftName), bold: true, size: 24 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 24 })],
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
                    new TextRun({ text: rightTitle, bold: true, size: 24, underline: {} }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(rightName), bold: true, size: 24 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 24 })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
      ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),

    // ✅ SUGITAANKA NOOTAAYADA
    ...notarySection,
    
  ];
};