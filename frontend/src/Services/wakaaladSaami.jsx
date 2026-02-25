// src/docTemplates/wakaaladSaami.js
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
 * ✅ WAKAALAD SAAMI (Gaar ah) - gooni ah
 * - Multi grantors + multi agents
 * - Names bold only (qoraalka dheer)
 * - ✅ KU DARAY: Signature table + Witnesses + Sugitaanka Nootaayada
 * - ✅ Titles: single/plural + male/female (sida aad sheegtay)
 *   - Grantor single: male=WAKAALAD BIXIYAHA, female=WAKAALAD BIXISADA
 *   - Agent single: male=LA WAKIISHA, female=LA WAKIISHADA
 *   - Plural: Grantors="SAXIIXA WAKAALAD BIXIYAASHA", Agents="SAXIIXA WAKIILLADA"
 */
export const buildWakaaladSaamiDoc = ({ agreement, service, formatDate, GW }) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

  const maleFemale = (gender, male, female) =>
    String(gender || "").toLowerCase() === "female" ? female : male;

  // Bold names only (FullName) rest normal
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = (people || [])
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName) ? fullText.slice(fullName.length) : `, ${fullText}`;
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

  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;
  const isPluralAgent = agents.length > 1;

  const formatGrantor = (p) => {
    if (!p) return "";
    const W = GW(p?.gender || "male");

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

  const formatAgent = (p) => {
    if (!p) return "";
    const W = GW(p?.gender || "male");

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

  const introWho = isPluralGrantor ? "anagoo kala ah " : "anigoo ah ";

  const healthText = isPluralGrantor
    ? ", xiskeennuna taam yahay, cid nagu qasbeysana aysan jirin wakaaladdan, "
    : ", xiskeygana taam yahay, cid igu qasbeysana aysan jirin wakaaladdan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkan ku caddeynaynaa in aan wakaalad gaar ah u siinnay "
    : "waxaan qoraalkan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // Accounts
  const svc = service || {};
  const hormuudAcc = safe(svc.accountHormuud);
  const salaamAcc = safe(svc.accountSalaam);

  const reportDate = svc?.Date ? formatDate(svc.Date) : formatDate(agreement?.agreementDate);

  const hasHormuud = !!hormuudAcc;
  const hasSalaam = !!salaamAcc;

  const hormuudText =
    `Saamiyada aan ku leeyahay Shirkadda Hormuud Telecom Somalia inc (HorTel). ` +
    `Accounka numbarkiisu yahay ${hormuudAcc}, sida ku cad activity report-ga ka soo baxay Hormuud ` +
    `kuna taariikhaysan ${reportDate}. ` +
    `in uu gadi karo, hibayn karo, rahmi karo, waqfi karo, iskuna damiinan karo, una xayiri karo naftiisa, ` +
    `rahan dhigi karo kana saari karo, qareen u qaban karo, u dacwoon karo, isla markaasna uu leeyahay maamul ` +
    `la mid ah midka sharcigu ii siiyey oo kale. Sidoo kalena uu maamuli karo faa'idada uu soo saaro saamigaas.`;

  const salaamText =
    `Sidoo kale accounkayga bankiga Salaam Somali Bank, ee numbarkiisuna yahay ${salaamAcc}, ` +
    `in uu maamuli karo, lacag ka saari karo, lacag dhigi karo, u dacwoon karo, u doodi karo, qareenna u qaban karo, ` +
    `isla markaasna uu leeyahay maamul la mid ah midka sharcigu i siiyey oo kale.`;

  // ================= SIGNATURES (single/plural + male/female) =================
  const signatureLine = "______________________________";

  const grantorGender = grantors?.[0]?.gender || "male";
  const agentGender = agents?.[0]?.gender || "male";

  const leftTitle = singleOrPlural(
    grantors.length,
    `SAXIIXA ${maleFemale(grantorGender, "WAKAALAD BIXIYAHA", "WAKAALAD BIXISADA")}`,
    "SAXIIXA WAKAALAD BIXIYAASHA"
  );

  const rightTitle = singleOrPlural(
    agents.length,
    `SAXIIXA ${maleFemale(agentGender, "LA WAKIISHA", "LA WAKIISHADA")}`,
    "SAXIIXA WAKIILLADA"
  );

  const buildSignatureChildren = (title, people = []) => {
    const children = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: title, bold: true, size: 24, underline: {}, font: "Times New Roman" })],
      }),
    ];

    (people || [])
      .filter(Boolean)
      .forEach((p, idx) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: safe(p?.fullName).toUpperCase(), bold: true, size: 24, font: "Times New Roman" })],
          })
        );

        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: idx === people.length - 1 ? 0 : 140 },
            children: [new TextRun({ text: signatureLine, size: 24, font: "Times New Roman" })],
          })
        );
      });

    return children;
  };

  const leftCellChildren = buildSignatureChildren(leftTitle, grantors);
  const rightCellChildren = buildSignatureChildren(rightTitle, agents);

  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

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

  // ✅ return paragraphs/tables array
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

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 320 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement?.agreementDate)}, ${introWho}`,
          size: 24,
          font: "Times New Roman",
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24, font: "Times New Roman" }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        ...(hasHormuud || hasSalaam
          ? [
              new TextRun({ text: ", ", size: 24, font: "Times New Roman" }),
              ...(hasHormuud ? [new TextRun({ text: hormuudText, size: 24, font: "Times New Roman" })] : []),
              ...(hasHormuud && hasSalaam ? [new TextRun({ text: "", size: 24, break: 1, font: "Times New Roman" })] : []),
              ...(hasSalaam ? [new TextRun({ text: salaamText, size: 24, font: "Times New Roman" })] : []),
            ]
          : []),

        new TextRun({ text: ".", size: 24, font: "Times New Roman" }),
      ],
    }),

    // SIGNATURES TABLE
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
              children: leftCellChildren,
            }),

            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: hiddenBorders,
              children: rightCellChildren,
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