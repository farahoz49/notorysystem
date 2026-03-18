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
  notaryName = "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed",
}) => {
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
  const upper = (v) => safe(v).toUpperCase();
  const toNum = (v) => Number(String(v ?? "").replace(/,/g, "")) || 0;
  const getGenderText = (gender) => {
    const g = String(gender || "").toUpperCase();

    if (g === "FEMALE") {
      return {
        pronoun: "ay",
        sanad: "dhalatay",
        tilmaan: "timaado",
        musalaf: "musalafto",
        ks: "waydo",
        deathText: "geeriyooto",
      };
    }

    return {
      pronoun: "uu",
      sanad: "dhashay",
      tilmaan: "yimaado",
      musalaf: "musalafo",
      ks: "waayo",
      deathText: "geeriyoodo",
    };
  };
  const refNo = safe(agreement?.refNo);
  const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";

  const companyName = upper(service?.Name || "SANABIL");
  const companyType = safe(service?.Type || "Shirkad");

  const deviceType = upper(service?.deviceType || "MOBILE");
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
  const RamainAmountText = remainingAmount
    ? `${numberToSomaliWords(remainingAmount)} Doolarka Mareykanka ah`
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
  const damiinGenderText = getGenderText(damiin?.gender);
  const buyerGenderText = getGenderText(damiinsane?.gender);
  const personDetails = (p) => {
    const nat = safe(p?.nationality);
    const mother = safe(p?.motherName);
    const birthPlace = safe(p?.birthPlace);
    const birthYear = safe(p?.birthYear);
    const address = safe(p?.address);
    const docType = safe(p?.documentType);
    const docNo = safe(p?.documentNumber);
    const phone = safe(p?.phone);

    const genderText = getGenderText(p?.gender);

    const parts = [];
    if (phone) parts.push(`Tel ${phone}`);
    if (birthYear) parts.push(`${genderText.sanad} ${birthYear}`);
    if (nat) parts.push(`${nat} ah`);
    if (mother) parts.push(`hooyadiina la yiraahdo ${mother}`);
    if (birthPlace) parts.push(`ku dhashay ${birthPlace}`);
    if (address) parts.push(`degan ${address}`);
    if (docType) parts.push(`lehna ${docType}`);
    if (docNo) parts.push(`No: ${docNo}`);

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

  // const kuLine = new Paragraph({
  //   spacing: { before: 120, after: 80 },
  //   children: [
  //     new TextRun({
  //       text: "KU: ",
  //       bold: true,
  //       size: 22,
  //       font: "Times New Roman",
  //     }),
  //     new TextRun({
  //       text: companyName,
  //       bold: true,
  //       size: 22,
  //       font: "Times New Roman",
  //     }),
  //   ],
  // });

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
        text: "CADDEYN DAMIINUL MAAL IYO BALAN QAAD LACAGEED OO MUDDO LEH",
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
        text: `Maanta oo ay taariikhdu tahay ${tr}, Aniga oo ah `,
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
        text: `, ${damiinDetails ? damiinDetails + "," : ""} waxa aan halkaan ku caddeynayaa in aan Damiinul maal ka ahay lacag dhan`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` $${formatCurrency(totalAmount)}`,
        bold: true,
        color: "FF0000",

        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: totalAmountText ? ` (${totalAmountText})` : "",
        size: 24,
        bold: true,

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` isla markaana wuxuu macaamilku hormaris u bixiyey`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` $${formatCurrency(downPayment)}`,
        bold: true,
        size: 24,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: downPaymentText ? ` (${downPaymentText})` : "",
        size: 24,
        bold: true,

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` Kuna bixin doona haraaga oo ah`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` $${formatCurrency(remainingAmount)}`,
        bold: true,
        color: "FF0000",

        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: RamainAmountText ? ` (${RamainAmountText})` : "",
        size: 24,
        bold: true,

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` mudo 6(lix) bil ah, lacagtaas oo ay SANABIL ugu muraabaxeysay`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` SANABIL `,
        size: 24,
        bold: true,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ugu muraabaxeysay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `${deviceType}-${mobileBrand} `,
        size: 24,
        bold: true,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: damiinsaneName || "__________",
        bold: true,
        size: 24,


        font: "Times New Roman",
      }),
      new TextRun({
        text: `, ${damiinsaneDetails ? damiinsaneDetails + "," : ""}`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` Haddii `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiinsaneName || "__________",
        bold: true,
        size: 24,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${buyerGenderText.pronoun} bixin ${buyerGenderText.ks} lacagta laga rabo`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${TypePayment}`,
        size: 24,
        bold: true,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` walba oo ah `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `$${formatCurrency(Payment)}`,
        bold: true,
        color: "FF0000",

        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: dailyPaymentText ? ` (${dailyPaymentText})` : "",
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, si walba haku timaadee, sida haddii ${buyerGenderText.pronoun} ${buyerGenderText.deathText}, ${buyerGenderText.musalaf}, la waayo ama caafimaad darro xagga maskaxda iyo jirka ah ku ${buyerGenderText.tilmaan}, aniga ayaa bixinaayo sida ay ku heshiiyeen `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` SANABIL `,
        size: 24,
        bold: true,
        color: "FF0000",

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` iyo `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: damiinsaneName || "__________",
        bold: true,
        color: "FF0000",

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
        text: "XOGTA MOBILE-KA LA DAMIINANAYO",
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
      top: { style: BorderStyle.SINGLE, size: 7, },
      bottom: { style: BorderStyle.SINGLE, size: 7, },
      left: { style: BorderStyle.SINGLE, size: 7, },
      right: { style: BorderStyle.SINGLE, size: 7, },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 7, },
      insideVertical: { style: BorderStyle.SINGLE, size: 7, },
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
                    text: `${deviceType}`,
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
        text: `Aniga oo ah `,
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
        text: ` kana caafimaad qaba maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin,waxaan caddeynayaa in:`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });
  const p3 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `aan Ku bixin doono lacagtaas kor ku xusan muddo 6 (lix) bilood ah, oo ka bilaabaneysa`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${startDate || "____"}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` kuna eg`,

        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${endDate || "____"}`,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });
  const p4 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `Aan awood u siiyey `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` SANABIL`,
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` in ay xayirto`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType} ka`,
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ay ii muraabaxeysay ee faahfaahintiisu kor ku cadahay,`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const p5 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140 },
    children: [
      new TextRun({
        text: `haddii aan`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType} kaas`,
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` lacagtiisa bixin waayo ama aan ku wareejiyo gacan saddexaad (Third Party) anigoo aan bixin lacagtaas. `,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });
  const p6 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `aan`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType} kaas`,
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` cusub ee kor ku xusan iska hubiyay, ku qancay, raallina ka ahay.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  const p7 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 180 },
    children: [
      // p4
      new TextRun({
        text: `aan`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType} kaas`,
        size: 24,
        bold: true,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` marka aan qaato oo aan ka qaato xafiiska SANABIL in aanan dib u soo celin doonin.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });
  const p8 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `Aysan jirin wax dammaanad (Warranty) ah oo ay SANABIL ka tahay`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType} kaas`,
        size: 24,
        bold: true,

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` haba yaraatee.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });
  const p9 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 140, after: 140 },
    children: [
      new TextRun({
        text: `Haddii`,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${deviceType}kaas`,
        size: 24,
        bold: true,

        font: "Times New Roman",
      }),
      new TextRun({
        text: ` wax dhaawac ah soo gaaro, halaabo (Damage), la xado ama uu lumo aniga ayaa mas’uul ka ah. `,
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
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "SAXIIXA DAMIINUL MAALAHA ",
                    bold: true,
                    underline: {},
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
                    text: damiinName || "________________",
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
                alignment: AlignmentType.CENTER,
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
                alignment: AlignmentType.CENTER,
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
                alignment: AlignmentType.CENTER,
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
          text: `Ref: ${refNo || "____"}, Tr. ${tr || "____"}`,
          bold: true,
          underline: true,
          size: 22,
          font: "Times New Roman",
        }),
        new TextRun({
          text: ", Anigoo ah ",
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
            "waxaan sugayaa in saxiixyada kor ku xusan iyo kuwa ku keydsan diiwaankuba ay yihiin kuwii runta ahaa ee lagu saxiixay horteyda, waana sugitaan ansax ah, waafaqsan Shareecada Islaamka iyo qaanuunka dalka.",
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
    // kuLine,
    ujeeddoLine,
    p1,
    mobileTableTitle,
    mobileTable,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
    p9,
    sigTable,
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
  ];
};