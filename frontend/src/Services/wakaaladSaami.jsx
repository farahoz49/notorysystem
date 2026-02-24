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

// Waxaad ka keenaysaa kuwaaga existing:
// import { GW } from "../wherever/genderWords";
//
// NOTE: formatDate waa adiga (existing).
// NOTE: GW waa adiga (existing).

export const buildWakaaladSaamiDoc = ({ agreement, service, formatDate, GW }) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  // Bold names only (FullName) rest normal
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

  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;
  const isPluralAgent = agents.length > 1;

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

    return `${fullName}, ${nationality} ah, ${W.hooyo} la yiraahdo ${mother}, ${W.dhalasho} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
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

  const reportDate = svc?.Date
    ? formatDate(svc.Date)
    : formatDate(agreement.agreementDate);

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

  // Signatures
  const signatureLine = "______________________________";

  const grantorGender = String(grantors?.[0]?.gender || "male").toLowerCase();
  const isFemaleGrantor = grantorGender === "female";

  const leftTitle = isPluralGrantor
    ? "SAXIIXA WAKAALAD BIXIYAASHA"
    : isFemaleGrantor
      ? "SAXIIXA WAKAALAD BIXISADA"
      : "SAXIIXA WAKAALAD BIXIYAHA";

  const rightTitle = isPluralAgent
    ? "SAXIIXA LA WAKIISHADDA"
    : "SAXIIXA LA WAKIISHADA";

  const buildSignatureChildren = (title, people = []) => {
    const children = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: title, bold: true, size: 24, underline: {} })],
      }),
    ];

    (people || []).filter(Boolean).forEach((p, idx) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: safe(p.fullName).toUpperCase(), bold: true, size: 24 })],
        })
      );

      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: idx === people.length - 1 ? 0 : 140 },
          children: [new TextRun({ text: signatureLine, size: 24 })],
        })
      );
    });

    return children;
  };

  const leftCellChildren = buildSignatureChildren(leftTitle, grantors);
  const rightCellChildren = buildSignatureChildren(rightTitle, agents);

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
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, ${introWho}`,
          size: 24,
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24 }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        ...(hasHormuud || hasSalaam
          ? [
              new TextRun({ text: ", ", size: 24 }),
              ...(hasHormuud ? [new TextRun({ text: hormuudText, size: 24 })] : []),
              ...(hasHormuud && hasSalaam ? [new TextRun({ text: "", size: 24, break: 1 })] : []),
              ...(hasSalaam ? [new TextRun({ text: salaamText, size: 24 })] : []),
            ]
          : []),

        new TextRun({ text: ".", size: 24 }),
      ],
    }),

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
              children: leftCellChildren,
            }),

            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              children: rightCellChildren,
            }),
          ],
        }),
      ],
    }),
  ];
};