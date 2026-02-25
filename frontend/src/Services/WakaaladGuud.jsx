// src/docTemplates/wakaaladGuud.js
import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

/**
 * ✅ WAKAALAD GUUD TEMPLATE (gooni ah)
 * - Multi grantors + multi agents
 * - Names bold only, rest normal
 * - Hal paragraph dheer (sida code-kaaga)
 * - ✅ WITH: Signature + Witnesses + Sugitaanka Nootaayada
 * - ✅ Keep all original content (qoraalka lama beddelin/laguma darin)
 */
export const buildWakaaladGuudDoc = ({ agreement, formatDate }) => {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  // Qofka bixiyaha (grantor)
  const formatGrantor = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadayna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Qofka la wakiilanayo (agent)
  const formatAgent = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadiisna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Bold names only
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = (people || [])
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName)
          ? fullText.slice(fullName.length)
          : `, ${fullText}`;
        return { fullName, rest };
      });

    if (items.length === 0) return [];

    if (items.length === 1) {
      return [
        new TextRun({ text: items[0].fullName, bold: true, size: 24, font: "Times New Roman" }),
        new TextRun({ text: items[0].rest, size: 24, font: "Times New Roman" }),
      ];
    }

    const runs = [];
    items.forEach((it, idx) => {
      if (idx > 0) {
        const isLast = idx === items.length - 1;
        runs.push(new TextRun({ text: isLast ? " iyo " : ", ", size: 24, font: "Times New Roman" }));
      }
      runs.push(new TextRun({ text: it.fullName, bold: true, size: 24, font: "Times New Roman" }));
      runs.push(new TextRun({ text: it.rest, size: 24, font: "Times New Roman" }));
    });

    return runs;
  };

  // ================= DATA =================
  const grantors = agreement?.dhinac1?.sellers || []; // bixiyeyaasha
  const agents = agreement?.dhinac2?.buyers || []; // la wakiishanayo

  const isPluralGrantor = grantors.length > 1;

  const introWho = isPluralGrantor ? "anagoo kala ah " : "anigoo ah ";

  const healthText = isPluralGrantor
    ? " kana caafimaad qabaan dhanka maskaxda iyo jirkaba, xiskeenuna taam yahay, cid nagu qasbeysana aysan jirin wakaaladan, "
    : " kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad guud u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad guud u siiyay ";

  const propertyText = isPluralGrantor
    ? "dhammaan hantideena guurtada iyo maguurtada ah (oo ay ku jiraan akoonada nooga furan bangiyada dalka iyo saamiyada aan ku leenahay shirkaddaha dalka), "
    : "dhammaan hantideyda guurtada iyo maguurtada ah (oo ay ku jiraan akoonada iiga furan bangiyada dalka iyo saamiyada aan ku leeyahay shirkaddaha dalka), ";

  const ownershipWord = isPluralGrantor ? "hantideena" : "hantideyda";
  const gaveWord = isPluralGrantor ? "noo" : "ii";

  // ================= STYLES =================
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const signatureLine = "______________________________";

  const joinUpperNames = (arr = []) =>
    (arr || [])
      .filter(Boolean)
      .map((p) => safe(p?.fullName).toUpperCase())
      .filter(Boolean)
      .join(" , ");

 // ✅ GENDER HELPERS (ku dhex qor buildWakaaladGuudDoc)
const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

const maleFemale = (gender, male, female) =>
  String(gender || "").toLowerCase() === "female" ? female : male;

// ✅ Grantor(s) gender (qofka bixiyaha)
const grantorGender = grantors?.[0]?.gender || "male";
// ✅ Agent(s) gender (qofka la wakiishanayo)
const agentGender = agents?.[0]?.gender || "male";

// ✅ Names (sidaad hore u haysatay)
const grantorSigName =
  grantors.length > 1
    ? joinUpperNames(grantors)
    : safe(grantors?.[0]?.fullName).toUpperCase();

const agentSigName =
  agents.length > 1
    ? joinUpperNames(agents)
    : safe(agents?.[0]?.fullName).toUpperCase();

// ✅ TITLES: Single/Plural + Male/Female
// Grantor: male = "WAKAALAD BIXIYAHA", female = "WAKAALAD BIXISADA"
const grantorSigTitle = singleOrPlural(
  grantors.length,
  `SAXIIXA ${maleFemale(grantorGender, "WAKAALAD BIXIYAHA", "WAKAALAD BIXISADA")}`,
  "SAXIIXA WAKAALADDA BIXIYEYAASHA"
);

// Agent: male = "LA WAKIISHA", female = "LA WAKIISHADA"
const agentSigTitle = singleOrPlural(
  agents.length,
  `SAXIIXA ${maleFemale(agentGender, "LA WAKIISHAHA", "LA WAKIISHADA")}`,
  "SAXIIXA WAKIILLADA"
);

  // ================= MARQAATIYAASHA =================
  const witnessesTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
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

  // ================= SUGITAANKA NOOTAAYADA =================
  const notarySection = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 200 },
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
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `REF: ${safe(agreement?.refNo)}, Tr. ${formatDate(agreement?.agreementDate)}`,
          size: 22,
          bold: true,
          underline: true,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 120 },
      children: [
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

  // ================= RETURN =================
  return [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100, before: 200 },
      children: [
        new TextRun({
          text: "UJEEDO: WAKAALAD GUUD",
          bold: true,
          underline: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // BODY (ORIGINAL TEXT — not changed, not added)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, ${introWho}`,
          size: 24,
          font: "Times New Roman",
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24, font: "Times New Roman" }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({
          text:
            `, ${propertyText}` +
            `in uu gadi karo, wareejin karo, hibeyn karo, waqfi karo, xafidi karo, dhisi karo, ijaari karo, ` +
            `rahan dhigi karo kana saari karo, iskuna dammiinan karo, maslaxane ka geli karo una qaadi karo, ` +
            `qareen u qaban karo kuna dacwoon karo, lacagna ka saari karo, uuna leeyahay maamulka ` +
            `${ownershipWord} si la mid ah maamulka sharcigu ${gaveWord} siiyay..`,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // ================= SIGNATURE TABLE =================
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
                      text: grantorSigTitle,
                      bold: true,
                      underline: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: safe(grantorSigName),
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
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
                      text: agentSigTitle,
                      bold: true,
                      underline: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: safe(agentSigName),
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
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
};