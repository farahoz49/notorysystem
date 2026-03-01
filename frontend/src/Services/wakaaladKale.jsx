// src/docTemplates/wakaaladKale.js
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
 * ✅ WAKAALAD KALE (Wakaalad Gaar ah) - gooni ah
 * - Multi grantors + multi agents
 * - Names bold only
 * - Hal paragraph dheer (sida code-kaaga)
 * - ✅ KU DARAY: Signatures + Witnesses + Sugitaanka Nootaayada (sida saami.js style)
 * - ✅ Local gender logic (GW global ma jiro)
 */
export const buildWakaaladKaleDoc = ({ agreement, service, formatDate }) => {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const joinUpperNames = (arr = []) =>
    (arr || [])
      .filter(Boolean)
      .map((p) => safe(p?.fullName).toUpperCase())
      .filter(Boolean)
      .join(" , ");

  const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

  const maleFemale = (gender, male, female) =>
    String(gender || "").toLowerCase() === "female" ? female : male;

  // ✅ LOCAL gender words
  const G = (gender) => {
    const g = String(gender || "").toLowerCase();
    const isF = g === "female";
    return {
      grantorMother: "hooyadayna la yiraahdo", // grantor always like this in your text
      agentMother: isF ? "hooyadeedna la yiraahdo" : "hooyadiisna la yiraahdo",
      born: isF ? "ku dhalatay" : "ku dhashay",
    };
  };

  // ✅ Grantor female single: uu/karo/siiyay -> ay/karto/siisay
  const toFemaleSingleGrantorText = (txt = "", grantorGender, isPluralGrantor) => {
    const isFSingle =
      !isPluralGrantor && String(grantorGender || "").toLowerCase() === "female";
    if (!isFSingle) return String(txt);

    return String(txt)
      .replaceAll("in uu", "in ay")
      .replaceAll(" uu ", " ay ")
      .replaceAll(" uuna ", " ayna ")
      .replaceAll("uuna", "ayna")
      .replace(/\bkaro\b/g, "karto")
      .replaceAll("siiyey", "siisay")
      .replaceAll("siiyay", "siisay");
  };

  // Qofka bixiyaha (grantor)
  const formatGrantor = (p) => {
    if (!p) return "";
    const W = G(p?.gender);

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    // grantor: hooyadayna ... + ku dhashay/ku dhalatay (haddii ay dumar tahay)
    return `${fullName}, ${nationality} ah, ${W.grantorMother} ${mother}, ${W.born} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Qofka la wakiilanayo (agent)
  const formatAgent = (p) => {
    if (!p) return "";
    const W = G(p?.gender);

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    // agent: hooyadiisna/hooyadeedna + ku dhashay/ku dhalatay
    return `${fullName}, ${nationality} ah, ${W.agentMother} ${mother}, ${W.born} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Bold names only
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
  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;
  const introWho = isPluralGrantor ? "anagoo kala ah " : "anigoo ah ";

  const healthText = isPluralGrantor
    ? " kana caafimaad qabaan dhanka maskaxda iyo jirkaba, xiskeenuna taam yahay, cid nagu qasbeysana aysan jirin wakaaladan, "
    : " kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // ✅ waxa gaar ahaan la wakiishanayo
  const propertyText = safe(service?.propertyText || service?.details);

  const ownershipWord = isPluralGrantor ? "hantideena" : "hantideyda";
  const gaveWord = isPluralGrantor ? "noo" : "ii";

  // ✅ gender (for signature titles + female conversion)
  const grantorGender = grantors?.[0]?.gender || "male";
  const agentGender = agents?.[0]?.gender || "male";

  // ================= SIGNATURES + WITNESSES + NOTARY =================
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // ✅ names
  const grantorSigName =
    grantors.length > 1 ? joinUpperNames(grantors) : safe(grantors?.[0]?.fullName).toUpperCase();

  const agentSigName =
    agents.length > 1 ? joinUpperNames(agents) : safe(agents?.[0]?.fullName).toUpperCase();

  // ✅ titles: single/plural + male/female
  const grantorSigTitle = singleOrPlural(
    grantors.length,
    `SAXIIXA ${maleFemale(grantorGender, "WAKAALAD BIXIYAHA", "WAKAALAD BIXISADA")}`,
    "SAXIIXA BIXIYEYAASHA WAKAALADDA"
  );

  const agentSigTitle = singleOrPlural(
    agents.length,
    `SAXIIXA ${maleFemale(agentGender, "LA WAKIISHA", "LA WAKIISHADA")}`,
    "SAXIIXA WAKIILLADA"
  );

  const signatureLine = "______________________________";

  // ✅ Witnesses
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
                    children: [new TextRun({ text: "__________________________", size: 22, font: "Times New Roman" })],
                  }),
                ],
              });

            return new TableRow({
              children: [cell(leftW), cell(rightW)],
            });
          }),
        })
      : null;

  // ✅ Notary
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
      children: [new TextRun({ text: "NOOTAAYAHA", bold: true, size: 24, font: "Times New Roman" })],
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
      children: [new TextRun({ text: "__________________________", size: 22, font: "Times New Roman" })],
    }),
  ];

  // ================= BODY POWER TEXT (rag -> dumar single) =================
  const rawPowerText =
    `, ${propertyText ? propertyText + ", " : ""}` +
    `in uu gadi karo, wareejin karo, hibeyn karo, waqfi karo, xafidi karo, dhisi karo, ijaari karo, ` +
    `rahan dhigi karo kana saari karo, iskuna dammiinan karo, maslaxane ka geli karo una qaadi karo, ` +
    `qareen u qaban karo kuna dacwoon karo, lacagna ka saari karo, uuna leeyahay maamulka ` +
    `${ownershipWord} si la mid ah maamulka sharcigu ${gaveWord} siiyay..`;

  const powerText = toFemaleSingleGrantorText(rawPowerText, grantorGender, isPluralGrantor);

  // ================= RETURN =================
  return [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "UJEEDO: WAKAALAD GAAR AH",
          bold: true,
          underline: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // MAIN PARAGRAPH
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement?.agreementDate)}, ${introWho}`,
          size: 24,
          font: "Times New Roman",
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24, font: "Times New Roman" }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({
          text: powerText,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // ✅ SIGNATURE TABLE (Grantor vs Agent)
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
            // LEFT (grantor)
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: hiddenBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [new TextRun({ text: grantorSigTitle, bold: true, size: 22, underline: {} })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(grantorSigName), bold: true, size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: signatureLine, size: 22 })],
                }),
              ],
            }),

            // RIGHT (agent)
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: hiddenBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [new TextRun({ text: agentSigTitle, bold: true, size: 22, underline: {} })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [new TextRun({ text: safe(agentSigName), bold: true, size: 22 })],
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