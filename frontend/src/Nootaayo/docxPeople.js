import { TextRun } from "docx";

// normalizer
const clean = (v = "") => String(v || "").trim().toLowerCase();
const isFemale = (g) => clean(g) === "female";

/** Somali gender words */
export const GW = (gender = "male") => ({
  born: isFemale(gender) ? "ku dhalatay" : "ku dhashay",
  childOf: isFemale(gender) ? "gabar ay hooyadeed la yiraahdo " : "ina ",
  motherLabel: isFemale(gender) ? "hooyadeed" : "hooyadiis",
  heShe: isFemale(gender) ? "waxay" : "wuxuu",
});

/** "Ali", "Ali iyo Ahmed", "Ali, Ahmed iyo Hassan" */
export const joinNames = (people = []) => {
  const names = (people || []).map((p) => p?.fullName).filter(Boolean);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} iyo ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} iyo ${names[names.length - 1]}`;
};

/** Hal qof details -> TextRuns[] */
export const personRuns = (p = {}, roleColor = "000000") => {
  const W = GW(p?.gender);

  return [
    new TextRun({ text: `${p?.fullName || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.nationality || ""} `, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `ah, `, size: 24, font: "Times New Roman" }),

    // ✅ male/female: "ina" vs "gabar ay hooyadeed la yiraahdo"
    ...(isFemale(p?.gender)
      ? [
          new TextRun({ text: W.childOf, size: 24, font: "Times New Roman" }),
          new TextRun({ text: `${p?.motherName || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
        ]
      : [
          new TextRun({ text: W.childOf, size: 24, font: "Times New Roman" }), // "ina "
          new TextRun({ text: `${p?.motherName || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
        ]),

    new TextRun({ text: `${W.born} `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.birthPlace || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `sannadkii `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.birthYear || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `degan `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.address || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `lehna `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.documentType || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `NO `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.documentNumber || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p?.phone || ""}`, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
  ];
};

/** Dad badan -> TextRuns[] oo kala xiran ", " iyo " iyo " */
export const buildPeopleRuns = (people = [], roleColor = "000000") => {
  const arr = (people || []).filter((p) => p?.fullName);
  const runs = [];

  arr.forEach((p, idx) => {
    if (idx > 0) {
      const isLast = idx === arr.length - 1;
      runs.push(new TextRun({ text: isLast ? " iyo " : ", ", size: 24, font: "Times New Roman" }));
    }
    runs.push(...personRuns(p, roleColor));
  });

  return runs;
};
import { TextRun } from "docx";
import { buildPeopleRuns, joinNames } from "./docxPeople"; // ❌ HA SAMEYN (recursive)
// ✅ Halkan ha import-gareynin isla file-ka. Ku dar kaliya function-ka hoose gudaha file-ka.

export const buildRoleBlock = ({
  title = "",
  people = [],
  color = "000000",
  underline = true,
  bold = true,
  spacingAfterTitle = 50,
  AlignmentType, // ✅ ka soo gudbi AgreementInfo.jsx (docx AlignmentType)
  Paragraph,      // ✅ ka soo gudbi AgreementInfo.jsx (docx Paragraph)
  TextRun,        // ✅ ka soo gudbi AgreementInfo.jsx (docx TextRun)
}) => {
  const arr = (people || []).filter((p) => p?.fullName);

  // haddii aysan jirin dad, waxba ha soo celin
  if (arr.length === 0) return [];

  return [
    // TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: spacingAfterTitle },
      children: [
        new TextRun({
          text: String(title || "").toUpperCase(),
          size: 24,
          font: "Times New Roman",
          bold,
          underline,
        }),
      ],
    }),

    // PEOPLE DETAILS
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: buildPeopleRuns(arr, color),
    }),
  ];
};
