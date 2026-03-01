// src/service/Heshiis2daraf.jsx
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

import { GW } from "../helpers/genderWords";
import { formatDate } from "../helpers/formatDate";

export const Heshiis2daraf = ({ agreement }) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const grantors = agreement?.dhinac1?.sellers || []; // labada daraf 1aad
  const agents = agreement?.dhinac2?.buyers || [];    // labada daraf 2aad

  const isPluralGrantor = grantors.length > 1;
  const W0 = GW(grantors?.[0]?.gender || "male");

  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // ---- formatters (sida sawirka: name bold, rest normal) ----
  const formatPersonTextParts = (p) => {
    if (!p) return { name: "", rest: "" };
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

    // 👉 “, ” ka bilow si name-ka gooni u bold noqdo
    const rest =
      `, ${nationality} ah, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, ` +
      `${W.hooyo} la yiraahdo ${mother}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tel ${phone}.`;

    return { name: fullName, rest };
  };

  // ---- numbered paragraph: "1. NAME...." (NAME bold) ----
  const numberedPersonParagraph = (idx, p) => {
    const { name, rest } = formatPersonTextParts(p);
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 140 },
      children: [
        new TextRun({ text: `${idx}. `, size: 24, font: "Times New Roman" }),
        new TextRun({ text: name, bold: true, size: 24, font: "Times New Roman" }),
        new TextRun({ text: rest, size: 24, font: "Times New Roman" }),
      ],
    });
  };

  // ---- “qoraalka” dhexe (sida sawirka) ----
  const healthText = isPluralGrantor
    ? "Labada daraf ee magacyadooda kor ku xusan yihiin waxa ay iga codsadeen inaan qoraal u sameeyo heshiiskan dhex maray labada daraf oo ku heshiiseen sida soo socoto."
    : "Labada daraf ee magacyadooda kor ku xusan yihiin waxa ay iga codsadeen inaan qoraal u sameeyo heshiiskan dhex maray labada daraf oo ku heshiiseen sida soo socoto."

  // ---- signatures list under SAXIIXYADA ----
  const signatureLine = "______________________________";

  const signatureItem = (idx, fullName) =>
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `${idx}. `, size: 24, font: "Times New Roman" }),
        new TextRun({
          text: safe(fullName).toUpperCase(),
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
        new TextRun({ text: `  ${signatureLine}`, size: 24, font: "Times New Roman" }),
      ],
    });

  // ---- witnesses (magac + (ID) + line) ----
  const witnessItem = (idx, w) => {
    // w can be string OR object; handle both
    const name =
      typeof w === "string" ? w : safe(w?.fullName || w?.name || "");
    const wid =
      typeof w === "string" ? "" : safe(w?.idNumber || w?.nid || w?.phone || "");

    const label = wid ? `${name} (${wid})` : name;

    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `${idx}. `, size: 24, font: "Times New Roman" }),
        new TextRun({
          text: safe(label).toUpperCase(),
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
        new TextRun({ text: `  ${signatureLine}`, size: 24, font: "Times New Roman" }),
      ],
    });
  };

  const allParties = [...grantors, ...agents].filter(Boolean);

  // ---- NOTARY section ----
  const notaryName =
    safe(agreement?.notaryName) || "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed";
  const notaryOffice =
    safe(agreement?.notaryOffice) || "Nootaayo Boqole";

  return [
    // ===== TITLE =====
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: "UJEEDDO: HESHIIS DHEX MARAY LABA DARAF",
          bold: true,
          underline: {},
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // ===== INTRO (sida sawirka: “Maanta… anigoo ah Nootaayo… waxaan qoray…”) =====
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement?.agreementDate
          )}, anigoo ah ${notaryOffice}, `,
          size: 24,
          font: "Times New Roman",
        }),
        new TextRun({
          text: `${notaryName}, `,
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
        new TextRun({
          text:
            "waxaan halkan ku caddeynayaa in ay ii yimaadeen heshiiskan dhex maray laba daraf oo kala ah:",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    // ===== LIST: labada daraf (1,2,...) =====
    ...allParties.map((p, i) => numberedPersonParagraph(i + 1, p)),

    // ===== MID TEXT =====
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 60, after: 200 },
      children: [new TextRun({ text: healthText, size: 24, font: "Times New Roman" })],
    }),

    // ===== SAXIIXYADA =====
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 140 },
      children: [
        new TextRun({
          text: "SAXIIXYADA",
          bold: true,
          underline: {},
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    ...allParties.map((p, i) => signatureItem(i + 1, p?.fullName)),

    // ===== WITNESSES =====
    ...(agreement?.witnesses && agreement.witnesses.length > 0
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 140 },
            children: [
              new TextRun({
                text: "SAXIIXYADA  MARQAATIYAASHA",
                bold: true,
                underline: {},
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          ...agreement.witnesses.map((w, i) => witnessItem(i + 1, w)),
        ]
      : []),

    // ===== NOTARY CONFIRM =====
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 120 },
      children: [
        new TextRun({
          text: "SUGITAANKA NOOTAAYADA",
          bold: true,
          underline: {},
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: `REF: ${safe(agreement?.refNo)}, Tr. ${formatDate(
            agreement?.agreementDate
          )}, `,
          bold: true,
          underline: {},
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
            "waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka Soomaaliya.",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
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
};