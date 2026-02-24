// src/docTemplates/baabuur.js
import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * buildBaabuurDoc
 * - same style as mooto.jsx (separate template file)
 * - returns array of Paragraphs
 * - signatures/witness/notary -> keep in parent (AgreementInfo.jsx) if global
 */
export const buildBaabuurDoc = ({
  agreement,
  service,
  formatDate,
  formatCurrency,
  numberToSomaliWords,
  getTitles,
  getPhrases,
  // data prepared in parent (like your current code)
  sellerNames,
  buyerNames,
  sellernationality,
  buyernationality,
  sellerMotherName,
  buyerMotherName,
  sellerBirthPlace,
  buyerBirthPlace,
  sellerBirthYear,
  buyerBirthYear,
  sellerAddress,
  buyerAddress,
  sellerdocumentType,
  buyerdocumentType,
  sellerdocumentNumber,
  BuyerdocumentNumber,
  sellerPhone,
  buyerPhone,
  hasSellerAgent,
  hasBuyerAgent,
  sellerAgentDetails,
  buyerAgentDetails,
  wakaaladText,
}) => {
  const T = getTitles(agreement.serviceType, agreement.agreementType);
  const P = getPhrases(agreement.serviceType, agreement.agreementType);

  const carType = service?.type || "";
  const chassisNo = service?.chassisNo || "";
  const modelYear = service?.modelYear || "";
  const color = service?.color || "";
  const cylinder = service?.cylinder || "";
  const plateNo = service?.plateNo || "";
  const issuedByPlate = service?.issuedByPlate || "";
  const plateIssueDate = service?.plateIssueDate ? formatDate(service.plateIssueDate) : "";
  const ownershipType = service?.ownershipType || "";
  const ownershipBookNo = service?.ownershipBookNo || "";
  const ownershipIssueDate = service?.ownershipIssueDate ? formatDate(service.ownershipIssueDate) : "";

  const price = agreement?.sellingPrice;
  const priceText =
    price !== undefined && price !== null && String(price) !== ""
      ? `$${formatCurrency(price)} (${numberToSomaliWords(price)} Doolarka Mareykanka ah)`
      : "";

  return [
      // TITLE
 new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text:
        agreement.agreementType === "Beec"
          ? "UJEEDDO: KALA GADASHO Baabuur"
          : agreement.agreementType === "Hibo"
          ? "UJEEDDO: HIBEYN Baabuur"
          : agreement.agreementType === "Waqaf"
          ? "UJEEDDO: WAQFID Baabuur"
          : "",
      bold: true,
      underline: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
}),
    // QORAALKA BILOWGA
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
          text: (T?.seller || "IIBIYAHA").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // SELLER DETAILS
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${sellerNames} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `${sellernationality} `, font: "Times New Roman", size: 24, color: "FF0000" }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${sellerMotherName} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${sellerBirthPlace} `, font: "Times New Roman", size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({ text: `${sellerBirthYear} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({ text: `${sellerAddress} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({ text: `${sellerdocumentType} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({ text: `${sellerdocumentNumber} `, size: 24, bold: true, color: "FF0000" }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({ text: `${sellerPhone}`, size: 24, bold: true, color: "FF0000" }),
      ],
    }),

    // BUYER TITLE
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: (T?.buyer || "IIBSADAHA").toUpperCase(),
          font: "Times New Roman",
          size: 24,
          bold: true,
          underline: true,
        }),
      ],
    }),

    // BUYER DETAILS
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${buyerNames} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `${buyernationality} `, font: "Times New Roman", size: 24, color: "008000" }),
        new TextRun({ text: `ah , ina `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${buyerMotherName} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `ku dhashay `, font: "Times New Roman", size: 24 }),
        new TextRun({ text: `${buyerBirthPlace} `, font: "Times New Roman", size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` sannadkii `, size: 24 }),
        new TextRun({ text: `${buyerBirthYear} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` degan `, size: 24 }),
        new TextRun({ text: `${buyerAddress} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` lehna `, size: 24 }),
        new TextRun({ text: `${buyerdocumentType} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: ` NO `, size: 24 }),
        new TextRun({ text: `${BuyerdocumentNumber} `, size: 24, bold: true, color: "008000" }),
        new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24 }),
        new TextRun({ text: `${buyerPhone}`, size: 24, bold: true, color: "008000" }),
      ],
    }),

    // =========================
    // SELLER SECTION
    // =========================
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: hasSellerAgent
        ? [
            new TextRun({ text: (T?.sellerAgent || "WAKIIL").toUpperCase(), size: 24, bold: true, underline: true }),
            new TextRun({ text: `Anigoo ah `, size: 24, font: "Times New Roman" }),
            new TextRun({ text: sellerAgentDetails, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, ${wakaaladText},kana wakiil ah ${T.seller} baabuurka `, size: 24 }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),

            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan ka iibiyey kuna wareejiyey  `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({ text: `, baabuur noociisu  yahay `, size: 24 }),
            new TextRun({ text: `${carType} `, size: 24 }),

            new TextRun({ text: `Chassis No. ${chassisNo} `, size: 24 }),
            new TextRun({ text: `modelkiisu yahay ${modelYear} `, size: 24 }),
            new TextRun({ text: `midabkiisuna yahay ${color} `, size: 24 }),
            new TextRun({ text: `Cylinder ${cylinder} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${plateNo} `, size: 24 }),

            new TextRun({ text: `kana soo baxday  ${issuedByPlate} `, size: 24 }),
            new TextRun({ text: `Tr. ${plateIssueDate} `, size: 24 }),

            new TextRun({ text: ` wuxuu ${T.seller} baabuurkaas ku milkiyay `, size: 24 }),
            new TextRun({ text: `${ownershipType} lahaanshaha baabuurka lambarkiisu yahay `, size: 24 }),
            new TextRun({ text: `${ownershipBookNo} `, size: 24 }),

            new TextRun({ text: `kana soo baxday ${issuedByPlate} `, size: 24 }),
            new TextRun({ text: `Tr. ${ownershipIssueDate} `, size: 24 }),

            ...(priceText
              ? [
                  new TextRun({
                    text: ` waxaan ku gaday anigoo ka wakiil ah  ${T.seller} baabuurka lacag dhan ${priceText}.`,
                    size: 24,
                  }),
                ]
              : []),
          ]
        : [
            new TextRun({ text: `Ugu horeyn anigoo ah `, size: 24, font: "Times New Roman" }),
            new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan ka iibiyey kuna wareejiyey `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),

            new TextRun({ text: `, baabuur noociisu yahay `, size: 24 }),
            new TextRun({ text: `${carType} `, size: 24 }),

            new TextRun({ text: `Chassis No. ${chassisNo} `, size: 24 }),
            new TextRun({ text: `modelkiisu yahay ${modelYear} `, size: 24 }),
            new TextRun({ text: `midabkiisuna yahay ${color} `, size: 24 }),
            new TextRun({ text: `Cylinder ${cylinder} `, size: 24 }),
            new TextRun({ text: `Taargo No. ${plateNo} `, size: 24 }),

            new TextRun({ text: `kana soo baxday ${issuedByPlate} `, size: 24 }),
            new TextRun({ text: `Tr. ${plateIssueDate} `, size: 24 }),

            new TextRun({ text: ` wuxuu ${T.seller} baabuurkaas ku milkiyay `, size: 24 }),
            new TextRun({ text: `${ownershipType}a lahaanshaha baabuurka lambarkiisu yahay `, size: 24 }),
            new TextRun({ text: `${ownershipBookNo} `, size: 24 }),

            new TextRun({ text: `kana soo baxday ${issuedByPlate} `, size: 24 }),
            new TextRun({ text: `Tr. ${ownershipIssueDate} `, size: 24 }),

            ...(priceText
              ? [
                  new TextRun({
                    text: ` waxaan ku gaday lacag dhan ${priceText}.`,
                    size: 24,
                  }),
                ]
              : []),
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
            new TextRun({ text: (T?.buyerAgent || "WAKIIL").toUpperCase(), size: 24, underline: true, bold: true }),
            new TextRun({ text: "Anigoo ah ", size: 24 }),
            new TextRun({ text: buyerAgentDetails, bold: true, size: 24 }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii baabuurkaas waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ]
        : [
            new TextRun({ text: `Anigoo ah iibsadaha `, size: 24, font: "Times New Roman" }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii baabuurkaas waxay si sharci ah ugu wareegeen iibsade `,
              size: 24,
            }),
            new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
            new TextRun({
              text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
              size: 24,
            }),
          ],
    }),
  ];
};