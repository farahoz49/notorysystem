// src/docTemplates/mooto.js
import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * ✅ MOOTO TEMPLATE (gooni ah)
 * - Waa isla content-kii aad soo dirtay
 * - Uses personInfoRuns(seller0/buyer0) sida code-kaaga
 * - Signatures/witness/notary haddii aad global ku haysato -> ha ku darin halkan
 */
export const buildMootoDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,
  getTitles,

  // prepared outside (AgreementInfo.jsx)
  personInfoRuns,
  seller0,
  buyer0,

  hasSellerAgent,
  hasBuyerAgent,
  sellerAgentDetails,
  buyerAgentDetails,
  wakaaladText,
  sellerNames,
  buyerNames,
}) => {
  const T = getTitles(agreement.serviceType, agreement.agreementType);

  return [
      // TITLE
 new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text:
        agreement.agreementType === "Beec"
          ? "UJEEDDO: KALA GADASHO MOOTO"
          : agreement.agreementType === "Hibo"
          ? "UJEEDDO: HIBEYN MOOTO"
          : agreement.agreementType === "Waqaf"
          ? "UJEEDDO: WAQFID MOOTO"
          : "",
      bold: true,
      underline: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
}),
    // QORAALKA BILOWGA HESHIISKA
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),

    // SELLER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: T.seller.toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // SELLER DETAILS (seller0)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: personInfoRuns(seller0, "FF0000"),
    }),

    // BUYER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: T.buyer.toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // BUYER DETAILS (buyer0)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: personInfoRuns(buyer0, "008000"),
    }),

    // =========================
    // SELLER SECTION
    // =========================
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasSellerAgent
        ? [
            // wakiil
            new TextRun({
              text: T.sellerAgent.toUpperCase(),
              size: 24,
              bold: true,
              underline: true,
            }),
            new TextRun({
              text: `Anigoo ah `,
              size: 24,
              font: "Times New Roman",
            }),
            new TextRun({
              text: sellerAgentDetails,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, ${wakaaladText},kana wakiil ah ${T.seller} Mootada `,
              size: 24,
            }),
            new TextRun({
              text: sellerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan ka iibiyey kuna wareejiyey  `,
              size: 24,
            }),
            new TextRun({
              text: buyerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({ text: `, mooto nooceedu yahay `, size: 24 }),
            new TextRun({ text: `${service.type} `, size: 24 }),
            new TextRun({ text: `Chassis No. ${service.chassisNo} `, size: 24 }),
            new TextRun({ text: `modelkeedu yahay ${service.modelYear} `, size: 24 }),
            new TextRun({ text: `midabkeedu yahay ${service.color} `, size: 24 }),
            new TextRun({ text: `Cylinder ${service.cylinder} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${service.plateNo} `, size: 24 }),
            new TextRun({
              text: `kana soo baxday  ${service.issuedByPlate} `,
              size: 24,
            }),
            new TextRun({
              text: `Tr. ${formatDate(service.plateIssueDate)} `,
              size: 24,
            }),
            new TextRun({
              text: ` wuxuu  ${T.seller} mootadaas ku milkiyay `,
              size: 24,
            }),
            new TextRun({
              text: `${service.ownershipType} lahaanshaha mootada lambarkiisu yahay `,
              size: 24,
            }),
            new TextRun({ text: `${service.ownershipBookNo} `, size: 24 }),
            new TextRun({
              text: `kana soo baxday ${service.issuedByPlate} `,
              size: 24,
            }),
            new TextRun({
              text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
              size: 24,
            }),
            new TextRun({
              text: ` waxaan ku gaday anigoo ka wakiil ah  ${T.seller} mootada lacag dhan $${formatCurrency(
                agreement.sellingPrice
              )} (${numberToSomaliWords(
                agreement.sellingPrice
              )} Doolarka Mareykanka ah).`,
              size: 24,
            }),
          ]
        : [
            // seller direct
            new TextRun({
              text: `Ugu horeyn anigoo ah `,
              size: 24,
              font: "Times New Roman",
            }),
            new TextRun({
              text: sellerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan ka iibiyey kuna wareejiyey `,
              size: 24,
            }),
            new TextRun({
              text: buyerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({ text: `, mooto nooceedu yahay `, size: 24 }),
            new TextRun({ text: `${service.type} `, size: 24 }),
            new TextRun({ text: `Chassis No. ${service.chassisNo} `, size: 24 }),
            new TextRun({ text: `modelkeedu yahay ${service.modelYear} `, size: 24 }),
            new TextRun({ text: `midabkeedu yahay ${service.color} `, size: 24 }),
            new TextRun({ text: `Cylinder ${service.cylinder} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${service.plateNo} `, size: 24 }),
            new TextRun({
              text: `kana soo baxday ${service.issuedByPlate} `,
              size: 24,
            }),
            new TextRun({
              text: `Tr. ${formatDate(service.plateIssueDate)} `,
              size: 24,
            }),
            new TextRun({
              text: ` wuxuu ${T.seller} mootadaas ku milkiyay `,
              size: 24,
            }),
            new TextRun({
              text: `${service.ownershipType}a lahaanshaha mootada lambarkiisu yahay `,
              size: 24,
            }),
            new TextRun({ text: `${service.ownershipBookNo} `, size: 24 }),
            new TextRun({
              text: `kana soo baxday ${service.issuedByPlate} `,
              size: 24,
            }),
            new TextRun({
              text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
              size: 24,
            }),
            new TextRun({
              text: ` waxaan ku gaday lacag dhan $${formatCurrency(
                agreement.sellingPrice
              )} (${numberToSomaliWords(
                agreement.sellingPrice
              )} Doolarka Mareykanka ah).`,
              size: 24,
            }),
          ],
    }),

    // =========================
    // BUYER SECTION
    // =========================
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasBuyerAgent
        ? [
            new TextRun({
              text: T.buyerAgent.toUpperCase(),
              size: 24,
              underline: true,
              bold: true,
            }),
            new TextRun({ text: "Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerAgentDetails, bold: true, size: 24 }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({
              text: buyerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ]
        : [
            new TextRun({
              text: `Anigoo ah iibsadaha `,
              size: 24,
              font: "Times New Roman",
            }),
            new TextRun({
              text: buyerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({
              text: buyerNames,
              bold: true,
              color: "FF0000",
              size: 24,
            }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ],
    }),
  ];
};