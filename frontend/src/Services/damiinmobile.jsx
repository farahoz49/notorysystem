// src/services/damiinMobile.js
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
 * buildDamiinMobileDoc
 *
 * sellers[0] = Damiinka / guarantor
 * buyers[0]  = Qofka loo damiinayo
 *
 * service:
 * - Name
 * - Type (Banki | Shirkad)
 * - mobileBrand
 * - mobileModel
 * - mobileMemory
 * - totalAmount
 * - downPayment
 * - dailyPayment
 * - startDate
 * - endDate
 * - months
 */
export const buildDamiinMobileDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,
  sellers = [],
  buyers = [],
  notaryName = "",
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
  const upper = (v) => safe(v).toUpperCase();
  const toNum = (v) => Number(String(v ?? "").replace(/,/g, "")) || 0;

  const refNo = safe(agreement?.refNo);
  const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";

  const companyName = upper(service?.Name || "SANABIL");
  const companyType = safe(service?.Type || "Shirkad");

  const mobileBrand = upper(service?.mobileBrand || "MOBILE");
  const mobileModel = upper(service?.mobileModel || "MODEL");
  const mobileMemory = upper(service?.mobileMemory || "MEMORY");

  const totalAmount = toNum(service?.totalAmount);
  const downPayment = toNum(service?.downPayment);
  const Payment = toNum(service?.Payment);
  const TypePayment = upper(service?.TypePayment);
  const months = toNum(service?.months);

  const remainingAmount = totalAmount - downPayment;

  const totalAmountText = totalAmount
    ? `${numberToSomaliWords(totalAmount)} Doolarka Mareykanka ah`
    : "";

  const downPaymentText = downPayment
    ? `${numberToSomaliWords(downPayment)} Doolarka Mareykanka ah`
    : "";

  const dailyPaymentText = Payment
    ? `${numberToSomaliWords(Payment)} Doolarka Mareykanka ah`
    : "";

const addMonths = (startDate, months) => {
  if (!startDate || !months) return "";
  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + parseInt(months, 10));
  d.setDate(d.getDate() - 1);
  return formatDate(d);
};

const startDate = service?.startDate ? formatDate(service.startDate) : "";
const endDate = addMonths(service?.startDate, service?.months);
  const damiin = sellers?.[0] || {};
  const damiinsane = buyers?.[0] || {};

  const damiinName = upper(damiin?.fullName);
  const damiinsaneName = upper(damiinsane?.fullName);

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
    if (docType || docNo) {
      parts.push(`lehna ${docType || "Document"} lambar kiisu yahay ${docNo}`);
    }
    if (phone) parts.push(`Tell: ${phone}`);
    return parts.filter(Boolean).join(", ");
  };

  const damiinDetails = personDetails(damiin);
  const damiinsaneDetails = personDetails(damiinsane);

  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const signatureLine = "______________________________";

  const kuLine = new Paragraph({
    spacing: { before: 120, after: 80 },
    children: [
      new TextRun({
        text: "KU: ",
        bold: true,
        size: 22,
        font: "Times New Roman",
      }),
      new TextRun({
        text: companyName,
        bold: true,
        size: 22,
        font: "Times New Roman",
      }),
    ],
  });

  const ujeeddoLine = new Paragraph({
    spacing: { after: 140 },
    children: [
      new TextRun({
        text: "UJEEDDO: ",
        bold: true,
        underline: {},
        size: 22,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "CADDEYN DAMIIN MOBILE",
        bold: true,
        underline: {},
        size: 22,
        font: "Times New Roman",
      }),
    ],
  });

  const p1 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140 },
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
        text: `, ${damiinDetails ? damiinDetails + "," : ""} waxaan halkan ku caddeynayaa in aan damiin ka ahay mobile noociisu yahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${mobileBrand} ${mobileModel}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, memory-giisuna yahay ${mobileMemory}, kaas oo ay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: companyName,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` (${companyType}) siisay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiinsaneName || "__________",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, ${damiinsaneDetails ? damiinsaneDetails + "." : ""}`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const mobileTableTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "XOGTA MOBILE-KA LOO DAMIINAYO",
        bold: true,
        size: 22,
        font: "Times New Roman",
      }),
    ],
  });

  const mobileTable = new Table({
    alignment: AlignmentType.CENTER,

    width: { size: 90, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 15, },
      bottom: { style: BorderStyle.SINGLE, size: 15,  },
      left: { style: BorderStyle.SINGLE, size: 15, },
      right: { style: BorderStyle.SINGLE, size:15, },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 15,  },
      insideVertical: { style: BorderStyle.SINGLE, size: 15,},
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "MOBILE",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 34, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "MODEL",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "MEMORY AND RAM",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: mobileBrand || "________",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: mobileModel || "________",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: mobileMemory || "________",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const p2 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `Waxaa lagu heshiiyey in qiimaha guud ee mobile-kan uu yahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(totalAmount)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: totalAmountText ? ` (${totalAmountText})` : "",
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `. Qofka la damiimay wuxuu hormaris ahaan u bixiyey `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(downPayment)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: downPaymentText ? ` (${downPaymentText})` : "",
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, waxaana ku hartay lacag dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(remainingAmount)}`,
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

  const p3 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140 },
    children: [
      new TextRun({
        text: `${damiinsaneName || "__________"} wuxuu/hay ballan qaaday in uu bixin doono lacagta hartay muddo dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${months}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` bilood, laga bilaabo ${startDate || "____"} ilaa ${endDate || "____"}, isaga/iyada oo ${TypePayment} walba bixinaya `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(Payment)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: dailyPaymentText ? ` (${dailyPaymentText})` : "",
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

  const p4 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 180 },
    children: [
      new TextRun({
        text:
          `Haddii ${damiinsaneName || "__________"} uu bixin waayo lacagtaas sabab kasta ha noqotee, ` +
          `aniga oo ah ${damiinName || "__________"} waxaan oggolahay in aan mas'uul ka noqdo bixinta lacagta soo hartay oo dhan. ` +
          `Waxaanan caddeynayaa in damiinkani yahay mid sax ah, sharci ah, isla markaana ku dhacay rabitaankeyga iyo oggolaanshaheyga.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const sigTable = new Table({
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
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "SAXIIXA DAMIINKA",
                    bold: true,
                    underline: {},
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
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
                children: [
                  new TextRun({
                    text: signatureLine,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
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
                    text: "SAXIIXA QOFKA LA DAMIIMAY",
                    bold: true,
                    underline: {},
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: damiinsaneName || "________________",
                    bold: true,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: signatureLine,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const witnessesTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 220, after: 120 },
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

  const witnessCells =
    witnesses.length > 0
      ? witnesses.slice(0, 2).map((w) => {
          const name = typeof w === "string" ? w : safe(w?.name || w?.fullName);
          const phone = typeof w === "string" ? "" : safe(w?.phone);
          const line = phone ? `${upper(name)} (${phone})` : upper(name);

          return new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: hiddenBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 90 },
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
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          },
          rows: [new TableRow({ children: witnessCells })],
        })
      : null;

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
        new TextRun({
          text: "Anigoo ah ",
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
            "waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo sax ah oo horteyda lagu kala saxiixday, " +
            "ayna labada dhinac si buuxda u fahmeen nuxurka caddeyntan damiinka mobile-ka.",
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
          text: "NOOTAAYAHA",
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
    kuLine,
    ujeeddoLine,
    p1,
    mobileTableTitle,
    mobileTable,
    p2,
    p3,
    p4,
    sigTable,
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
  ];
};