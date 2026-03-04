// src/services/daaminulMaal.js
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
 * buildDaaminulMaalDoc
 * - Qoraal + saxiixyo + marqaati + sugitaan nootaayo (SIDA SAWIRKA)
 * - Returns: docx children array (Paragraph/Table...)
 *
 * Inputs:
 * - agreement: { refNo, agreementDate, witnesses:[], ... }
 * - service: Murabaha/DaaminulMaal service object (bankName, sheyga, qiimaha, wadartaGuud, hormaris, haftadaBishi, lacagBixintaBilood, ... )
 * - sellers/buyers: waxaan u isticmaalay:
 *      sellers[0] = DAAMIINUL MAALKA (guarantor)
 *      buyers[0]  = LA DAAMIINTAHA (debtor)
 *
 * NOTE:
 * - Haddii aad leedahay notary + witnesses global, waxaad ka saari kartaa qeybaha hoose (witnessesTable + notarySection)
 */
export const buildDaaminulMaalDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,

  // people
  sellers = [], // ✅ guarantor
  buyers = [], // ✅ debtor

  // optional: notary name override
  notaryName = "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed",
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
  const upper = (v) => safe(v).toUpperCase();

  const toNum = (v) => Number(String(v ?? "").replace(/,/g, "")) || 0;

  const bank = upper(service?.bankName || "BANK");
  const refNo = safe(agreement?.refNo);
  const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";

  // ============ MONEY ============
  const qiimaha = toNum(service?.qiimaha);
  const wadartaGuud =
    service?.wadartaGuud != null ? toNum(service.wadartaGuud) : qiimaha;

  const hormaris = toNum(service?.hormaris);
  const haftadaBishi = toNum(service?.haftadaBishi);
  const bilood = toNum(service?.lacagBixintaBilood);

  const wadartaQoral =
    safe(service?.wadartaText) ||
    (wadartaGuud
      ? `${numberToSomaliWords(wadartaGuud)} Doolarka Mareykanka ah`
      : "");

  const hormarisQoral =
    safe(service?.hormarisText) ||
    (hormaris
      ? `${numberToSomaliWords(hormaris)} Doolarka Mareykanka ah`
      : "");

  const haftadaBishiQoral =
    safe(service?.faaidoText) ||
    (haftadaBishi
      ? `${numberToSomaliWords(haftadaBishi)} Doolarka Mareykanka ah`
      : "");

  // ============ PEOPLE ============
  const damiin = sellers?.[0] || {}; // guarantor
  const damiinta = buyers?.[0] || {}; // debtor

  const damiinName = upper(damiin?.fullName);
  const damiintaName = upper(damiinta?.fullName);

  // details (sida sawirka)
  const personDetails = (p) => {
    const nat = safe(p?.nationality);
    const mother = safe(p?.motherName);
    const birthPlace = safe(p?.birthPlace);
    const birthYear = safe(p?.birthYear);
    const address = safe(p?.address);
    const docType = safe(p?.documentType);
    const docNo = safe(p?.documentNumber);
    const phone = safe(p?.phone);

    // "Somali ah, hooyadiina la yiraahdo X, ku dhashay Mugdisho, sannadkii 1979, degan Mugdisho, lehna Basaboor No..., Tell: ..."
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
  const damiintaDetails = personDetails(damiinta);

  const sheyga = safe(service?.sheyga || "");

  // ============ STYLES ============
  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const signatureLine = "______________________________";

  // ============ HEADER (SIDA SAWIRKA) ============


  // ============ KU / UJEEDDO ============
  const kuLine = new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({ text: "KU: ", bold: true, size: 22, font: "Times New Roman" }),
      new TextRun({ text: bank, bold: true, size: 22, font: "Times New Roman" }),
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
        text: "DAAMIINUL MAAL",
        bold: true,
        underline: {},
        size: 22,
        font: "Times New Roman",
      }),
    ],
  });

  // ============ QORAALKA (SIDA SAWIRKA) ============
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
        text: `, ${damiinDetails ? damiinDetails + "," : ""} waxaan halkan ku caddeynayaa in aan daamiinul maal ka ahay lacag dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(wadartaGuud)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` (${wadartaQoral})`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, lacagtana oo ay ${bank} ugu muraabaxeyneysay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: sheyga ? `${sheyga} ` : "",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `magacaas oo ay ${bank} ugu muraabaxeyneysay `,
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
        text: `, ${damiintaDetails ? damiintaDetails + "." : ""}`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const p2 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140 },
    children: [
      new TextRun({
        text: `${damiintaName || "__________"} wuxuu/hay caddeeyey in uu hormariyey ${bank} lacag dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${formatCurrency(hormaris)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` (${hormarisQoral}), waxaana bil walba laga raba in uu bixiyo lacag dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(haftadaBishi)}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` (${haftadaBishiQoral}), muddo dhan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${bilood}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` bilood.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const p3 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 180 },
    children: [
      new TextRun({
        text:
          `Haddii ${damiintaName || "__________"} uu bixin waayo lacagtan soo hartay sabab kasta ha ku timaado bixin la'aanta, ` +
          `sida haddii uu geeriyoodo, musalofo, la waayo, caafimaad darro xagga xiska ah ku timaado, ` +
          `dood ka keeno, diido bixinta, aniga oo ah ${damiinName || "__________"} ayaa bixinaya haragga siida ay ku heshiiseyeen ` +
          `${damiintaName || "__________"} iyo ${bank}, mas'uuliyadana bixinta lacagtana aniga ayay igu wareegaysaa. ` +
          `Waxaan ku bixin doonaa haragga aan la bixin oo dhamaystiran marki bankiga uu i waydiisto bixinteeda.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // ============ SAXIIXYO (SIDA SAWIRKA) ============
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
                    text: "SAXIIXA DAAMIINUL MAALKA",
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
                    text: "SAXIIXA LA DAAMIINTAHA",
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

  // ============ MARQAATIYAASHA ============
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
          // witness can be string or object
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
                children: [new TextRun({ text: line || "__________", bold: true, size: 22, font: "Times New Roman" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "__________________________", size: 22, font: "Times New Roman" })],
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

  // ============ SUGITAANKA NOOTAAYADA ============
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
            "waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, laguna saxiixay horteyda, " +
            "waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka Soomaaliya.",
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

  // ============ RETURN ============
  return [
    // header center title (optional)
   


    kuLine,
    ujeeddoLine,
    p1,
    p2,
    p3,
    sigTable,
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
  ];
};