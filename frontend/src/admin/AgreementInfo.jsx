import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Footer,
  PageNumber,
  Header,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
} from "docx";
import { saveAs } from "file-saver";
import numberToSomaliWords, { formatCurrency, formatDate } from '../components/numberToSomaliWords.jsx'
import logo from '../assets/Logo1.jpg'
import footerLogo from '../assets/footer.png'
import { getTitles } from "./sample.js";
import { getPhrases } from "./sample2.js";
import { GW } from "./genderWords.js";
import { updateAgreement } from "../api/agreements.api.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

const AgreementInfo = ({ agreement, fetchData }) => {
  const [formData, setFormData] = useState({
    agreementDate: agreement.agreementDate?.split("T")[0] || "",
    officeFee: agreement.officeFee || "",
    sellingPrice: agreement.sellingPrice || "",
  });
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const base64ToUint8Array = (base64) => {
    const binary = atob(base64.split(",")[1]);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  // ================= UPDATE AGREEMENT =================
  const handleUpdate = async () => {
  try {
    await updateAgreement(agreement._id, formData);
    toast.success("Agreement updated");
    fetchData();
    setShowAgreementModal(false);
  } catch {
    toast.error("Error updating agreement");
  }
};

 const serviceHelper = (agreement) => {
  const service = (agreement.service || "").toLowerCase();
  const isWareejin = service === "wareejin";

  const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);
  const maleFemale = (gender, male, female) =>
    String(gender || "").toLowerCase() === "female" ? female : male;

  return {
    isWareejin,

    ujeeddo: isWareejin
      ? `KALA GADASHO ${(agreement.serviceType || "").toUpperCase()}`
      : (agreement.serviceType || "").toUpperCase(),

    // SELLER/BIXIYE
    sellerMain: (gender, count) =>
      isWareejin
        ? singleOrPlural(
            count,
            maleFemale(gender, "ISKA IIBIYAHA", "ISKA IIBISADA"),
            "ISKA IIBIYAASHA"
          )
        : singleOrPlural(
            count,
            maleFemale(gender, "WAKAALAD BIXIYAHA", "WAKAALAD BIXISADA"),
            "WAKAALAD BIXIYAASHA"
          ),

    sellerAgent: (gender, count) =>
      singleOrPlural(
        count,
        maleFemale(gender, "LA WAKIISHAHA", "LA WAKIISHADA"),
        "LA WAKIISHAYAASHA"
      ),

    // BUYER/QOFKA LA SIIYO
    buyerMain: (gender, count) =>
      isWareejin
        ? singleOrPlural(
            count,
            maleFemale(gender, "IIBSADAHA", "IIBSATADA"),
            "IIBSADAYAASHA"
          )
        : singleOrPlural(
            count,
            maleFemale(gender, "LA WAKIISHAHA", "LA WAKIISHADA"),
            "LA WAKIISHAYAASHA"
          ),

    buyerAgent: (gender, count) =>
      singleOrPlural(
        count,
        maleFemale(gender, "LA WAKIISHAHA", "LA WAKIISHADA"),
        "LA WAKIISHAYAASHA"
      ),
  };
};



  // ================= DOWNLOAD WORD =================
  const downloadWord = async () => {
    const svc = serviceHelper(agreement);

    const sellers = agreement.dhinac1?.sellers || [];
    const buyers = agreement.dhinac2?.buyers || [];

const normalizeGender = (g) =>
  String(g || "male").toLowerCase() === "female" ? "female" : "male";

const sellerGender = normalizeGender(sellers?.[0]?.gender);
const buyerGender  = normalizeGender(buyers?.[0]?.gender);

    const service = agreement.serviceRef || {};

    const sellerAgents = agreement.dhinac1?.agents || [];

    const buyerAgents = agreement.dhinac2?.agents || [];
    const docs = agreement?.dhinac1?.agentDocuments || {};

    console.log(agreement.dhinac1.agentDocuments)


    const hasSellerAgent = sellerAgents.length > 0;
    const hasBuyerAgent = buyerAgents.length > 0;

    // 🔹 HEADER / BODY LOGO
    const headerImgRes = await fetch(logo);
    const headerBlob = await headerImgRes.blob();


    // 🔹 FOOTER LOGO (KALE)
    const footerImgRes = await fetch(footerLogo);
    const footerBlob = await footerImgRes.blob();

    const readAsBase64 = (blob) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });

    const headerBase64 = await readAsBase64(headerBlob);
    const footerBase64 = await readAsBase64(footerBlob);

    const headerImageBuffer = base64ToUint8Array(headerBase64);
    const footerImageBuffer = base64ToUint8Array(footerBase64);
    const hiddenBorders = {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };



    const P = getPhrases(agreement.serviceType, agreement.agreementType);

    const sharesCount = Number(service.amount || 0) / 10;

    const saamiHeaderSection = (agreement, service) => [
      // TITLE
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: P.shareDescTitle,
            bold: true,
            size: 24,
            underline: true,
            font: "Times New Roman",
          }),
        ],
      }),

      // TABLE
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          // ROW 1 – ACCOUNT NO
          new TableRow({
            children: [
              new TableCell({
                borders: hiddenBorders,
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "ACCOUNT NO:",
                        bold: true,
                        size: 24,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: hiddenBorders,
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${service.accountNumber || ""}`,
                        bold: true,
                        color: "FF0000",
                        size: 28,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // ROW 2 – TIRADA SAAMIGA
          new TableRow({
            children: [
              new TableCell({
                borders: hiddenBorders,
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "TIRADA SAAMIGA:",
                        bold: true,
                        size: 24,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: hiddenBorders,
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${formatCurrency(sharesCount)}`,
                        bold: true,
                        color: "FF0000",
                        size: 28,
                        font: "Times New Roman",
                      }),
                      new TextRun({
                        text: `(${numberToSomaliWords(sharesCount)} saami)`,
                        size: 24,
                        font: "Times New Roman",
                      }),

                    ],
                  }),
                ],
              }),
            ],
          }),

          // ROW 3 – UNA DHIGANTA
          new TableRow({
            children: [
              new TableCell({
                borders: hiddenBorders,
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "UNA DHIGANTA:",
                        bold: true,
                        size: 24,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: hiddenBorders,
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `USD ${formatCurrency(service.amount)}`,
                        bold: true,
                        color: "FF0000",
                        size: 28,
                        font: "Times New Roman",
                      }),
                      new TextRun({
                        text: `(${numberToSomaliWords(service.amount)} Doolarka Mareykanka ah)`,
                        size: 24,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];

    const serviceIntroParagraphs = (
      serviceType,
      sellers,
      buyers,
      service,
      sellerAgents,
      buyerAgents,
      agreement,

    ) => {
      const sellerDocsMap = agreement?.dhinac1?.agentDocuments || {};

      const wakaaladText = sellerAgents
        .map(agent => {

          const agentId = agent._id?.toString();
          const agentDocs = sellerDocsMap?.[agentId];

          if (!agentDocs) return "";

          const { wakaalad, tasdiiq } = agentDocs;

          let textParts = [];

          // ✅ Haddii Wakaalad jirto
          if (wakaalad) {
            textParts.push(
              `haystana ${wakaalad.wakaladType || ""} lambarkeedu yahay ${wakaalad.refNo || ""},Tr. ${wakaalad.date?.split("T")[0] || ""},kana soo baxday Xafiiska Nootaayaha iyo Latalinta Sharciga ah ee ${wakaalad.kasooBaxday || ""},uuna saxiixay Dr.${wakaalad.saxiix1 || ""}`
            );
          }

          // ✅ Haddii Tasdiiq jirto (OPTIONAL)
          if (tasdiiq) {
            textParts.push(
              `waxaa kale oo jira Tasdiiq lambarkiisu yahay ${tasdiiq.refNo || ""}, 
        Tr. ${tasdiiq.date?.split("T")[0] || ""}`
            );
          }

          return textParts.join(", ");

        })
        .filter(Boolean)
        .join(" | ");


      const sellerNames = sellers.map(s => s.fullName).join(", ");
      const buyerNames = buyers.map(b => b.fullName).join(", ");
      const sellerAgentDetails = sellerAgents
        .map(a =>
          `${a.fullName}, ${a.nationality || ""} ah, ina ${a.motherName || ""}, ku dhashay ${a.birthPlace || ""}, sannadkii ${a.birthYear || ""}, degan ${a.address || ""}, Tell: ${a.phone || ""}`
        )
        .join(" | ");
      const buyerAgentDetails = buyerAgents
        .map(a =>
          `${a.fullName}, ${a.nationality || ""} ah, ina ${a.motherName || ""}, ku dhashay ${a.birthPlace || ""}, sannadkii ${a.birthYear || ""}, degan ${a.address || ""}, Tell: ${a.phone || ""}`
        )
        .join(" | ");

   
const sellerList = (agreement?.dhinac1?.sellers || []).filter(p => p?.fullName);
const buyerList  = (agreement?.dhinac2?.buyers  || []).filter(p => p?.fullName);

const sellerAgentList = (agreement?.dhinac1?.agents || []).filter(p => p?.fullName);
const buyerAgentList  = (agreement?.dhinac2?.agents || []).filter(p => p?.fullName);

// ✅ waa in ay kor joogaan
const seller0 = sellerList?.[0] || {};
const buyer0  = buyerList?.[0]  || {};

// hadda ka dib isticmaal
const sellernationality = seller0.nationality || "";
const sellerMotherName  = seller0.motherName  || "";
const sellerBirthPlace  = seller0.birthPlace  || "";
const sellerBirthYear   = seller0.birthYear   || "";
const sellerAddress     = seller0.address     || "";
const sellerdocumentType   = seller0.documentType   || "";   // ✅ (hoos eeg #2)
const sellerdocumentNumber = seller0.documentNumber || "";   // ✅
const sellerPhone = seller0.phone || "";

const buyernationality = buyer0.nationality || "";
const buyerMotherName  = buyer0.motherName  || "";
const buyerBirthPlace  = buyer0.birthPlace  || "";
const buyerBirthYear   = buyer0.birthYear   || "";
const buyerAddress     = buyer0.address     || "";
const buyerdocumentType   = buyer0.documentType   || "";
const BuyerdocumentNumber = buyer0.documentNumber || "";
const buyerPhone = buyer0.phone || "";

const T = getTitles(agreement.serviceType, agreement.agreementType, {
  counts: {
    sellerCount: sellerList.length,
    buyerCount: buyerList.length,
    sellerAgentCount: sellerAgentList.length,
    buyerAgentCount: buyerAgentList.length,
  },
  genders: {
    sellerGender: seller0.gender,
    buyerGender: buyer0.gender,
    sellerAgentGender: sellerAgentList?.[0]?.gender,
    buyerAgentGender: buyerAgentList?.[0]?.gender,
  },
});


const W = (person) => GW(person?.gender || "male");
const personInfoRuns = (p, color) => {
  const w = W(p);

  return [
    new TextRun({ text: `${p.fullName || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.nationality || ""} `, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `ah, `, size: 24, font: "Times New Roman" }),

    // ✅ "ina" vs "gabar"
    new TextRun({ text: w.childOfMaleFemale, size: 24, font: "Times New Roman" }), // hoos ka eeg GW

    new TextRun({ text: `${p.motherName || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `${w.born} `, size: 24, font: "Times New Roman" }), // ku dhashay/ku dhalatay
    new TextRun({ text: `${p.birthPlace || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `sannadkii `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.birthYear || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `${w.lived} `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.address || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `lehna `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.documentType || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `NO `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.documentNumber || ""} `, bold: true, color, size: 24, font: "Times New Roman" }),

    new TextRun({ text: `ee ku lifaaqan warqadaan, Tell `, size: 24, font: "Times New Roman" }),
    new TextRun({ text: `${p.phone || ""}`, bold: true, color, size: 24, font: "Times New Roman" }),
  ];
};


      switch (serviceType) {
        case "Mooto":
          return [
            // QORAALKA BILOWGA HESHIISKA
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.seller.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),

              ],
            }),
                   new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 50 },
  children: personInfoRuns(seller0, "FF0000"),
}),

            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.buyer.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),
              ],
            }),
            new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 50 },
  children: personInfoRuns(buyer0, "008000"),
}),

           
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              children: hasSellerAgent ?
                [
                  // wakiilka iska ii biyaha
                  new TextRun({ text: T.sellerAgent.toUpperCase(), size: 24, bold: true, underline: true }),
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
                  new TextRun({
                    text: `, mooto nooceedu yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.type} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Chassis No. ${service.chassisNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `modelkeedu yahay ${service.modelYear} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `midabkeedu yahay ${service.color} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Cylinder ${service.cylinder} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Taargo No. ${service.plateNo} `,


                    size: 24,
                  }),
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
                  new TextRun({
                    text: `${service.ownershipBookNo} `,
                    size: 24,
                  }),

                  new TextRun({
                    text: `kana soo baxday ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` waxaan ku gaday anigoo ka wakiil ah  ${T.seller} mootada lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,


                    size: 24,
                  }),
                ] : [
                  // iska ${T.seller} kaligiis

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
                  new TextRun({
                    text: `, mooto nooceedu yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.type} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Chassis No. ${service.chassisNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `modelkeedu yahay ${service.modelYear} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `midabkeedu yahay ${service.color} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Cylinder ${service.cylinder} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Taargo No. ${service.plateNo} `,


                    size: 24,
                  }),
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
                  new TextRun({
                    text: `${service.ownershipBookNo} `,
                    size: 24,
                  }),

                  new TextRun({
                    text: `kana soo baxday ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` waxaan ku gaday lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,


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
                  new TextRun({ text: T.buyerAgent.toUpperCase(), size: 24, underline: true, bold: true }),

                  new TextRun({ text: "Anigoo ah ", size: 24 }),
                  new TextRun({
                    text: buyerAgentDetails,
                    bold: true,

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
                ] : [
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


        case "baabuur":
          return [
            // QORAALKA BILOWGA HESHIISKA
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.seller.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),

              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `${sellerNames} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `${sellernationality} `,
                  font: "Times New Roman",
                  size: 24,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ah , ina `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerMotherName} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ku dhashay `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerBirthPlace} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` sannadkii `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerBirthYear} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` degan `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerAddress} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` lehna `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerdocumentType} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` NO `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerdocumentNumber} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ee ku lifaaqan warqadaan, Tell `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerPhone}`,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.buyer.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `${buyerNames} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `${buyernationality} `,
                  font: "Times New Roman",
                  size: 24,
                  color: "008000",
                }),
                new TextRun({
                  text: `ah , ina `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerMotherName} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `ku dhashay `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerBirthPlace} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` sannadkii `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerBirthYear} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` degan `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerAddress} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` lehna `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerdocumentType} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` NO `,
                  size: 24,
                }),
                new TextRun({
                  text: `${BuyerdocumentNumber} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `ee ku lifaaqan warqadaan, Tell `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerPhone}`,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              children: hasSellerAgent ?
                [
                  // wakiilka iska ii biyaha
                  new TextRun({ text: T.sellerAgent.toUpperCase(), size: 24, bold: true, underline: true }),
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
                    text: `, ${wakaaladText},kana wakiil ah ${T.seller} baabuurka `,
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
                  new TextRun({
                    text: `, baabuur noociisu  yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.type} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Chassis No. ${service.chassisNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `modelkiisu yahay ${service.modelYear} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `midabkiisuna yahay ${service.color} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Cylinder ${service.cylinder} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Taargo No. ${service.plateNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `kana soo baxday  ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.plateIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` wuxuu ${T.seller} baabuurkaas ku milkiyay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.ownershipType} lahaanshaha baabuurka lambarkiisu yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.ownershipBookNo} `,
                    size: 24,
                  }),

                  new TextRun({
                    text: `kana soo baxday ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` waxaan ku gaday anigoo ka wakiil ah  ${T.seller} baabuurka lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,


                    size: 24,
                  }),
                ] : [
                  // iska ${T.seller} kaligiis

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
                  new TextRun({
                    text: `, baabuur noociisu yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.type} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Chassis No. ${service.chassisNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `modelkiisu yahay ${service.modelYear} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `midabkiisuna yahay ${service.color} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Cylinder ${service.cylinder} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `Taargo No. ${service.plateNo} `,


                    size: 24,
                  }),
                  new TextRun({
                    text: `kana soo baxday ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.plateIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` wuxuu ${T.seller} baabuurkaas ku milkiyay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.ownershipType}a lahaanshaha baabuurka lambarkiisu yahay `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `${service.ownershipBookNo} `,
                    size: 24,
                  }),

                  new TextRun({
                    text: `kana soo baxday ${service.issuedByPlate} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: `Tr. ${formatDate(service.ownershipIssueDate)} `,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` waxaan ku gaday lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,


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
                  new TextRun({ text: T.buyerAgent.toUpperCase(), size: 24, underline: true, bold: true }),

                  new TextRun({ text: "Anigoo ah ", size: 24 }),
                  new TextRun({
                    text: buyerAgentDetails,
                    bold: true,

                    size: 24,
                  }),
                  new TextRun({
                    text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii baabuurkaas waxay si sharci ah ugu wareegeen iibsade `,
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
                ] : [
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
                    text: `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii baabuurkaas waxay si sharci ah ugu wareegeen iibsade `,
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

        case "DhulBanaan": {

          const cabirText =
            service?.cabirka === "Boosas"
              ? `${service?.cabirka} ${service?.tiradaBoosaska} (${numberToSomaliWords(service?.tiradaBoosaska) || ""} Boos ah)`
              : (service?.cabirka || "");


          const cabirFaahfaahin = service?.cabirFaahfaahin
            ? ` (${service.cabirFaahfaahin})`
            : "";

          // Ku Milkiyay details text (schema cusub)
          let milkiyadDetails = "";
          if (service?.kuMilkiyay === "Aato") {
            milkiyadDetails =
              `Caddeyn Lambar: ${service?.aato?.cadeynLambar || ""}, ` +
              `kasoo baxday ${service?.aato?.kasooBaxday || ""}, ` +
              `ku saxiixan ${service?.aato?.kuSaxiixan || ""}.`;
          } else if (service?.kuMilkiyay === "Sabarloog") {
            milkiyadDetails =
              `Sabarloog No: ${service?.sabarloog?.sabarloogNo || ""}, ` +
              `Bollettario No: ${service?.sabarloog?.bollettarioNo1 || ""}` +
              `${service?.sabarloog?.bollettarioNo2 ? " / " + service.sabarloog.bollettarioNo2 : ""}, ` +
              `Rasiid Nambar: ${service?.sabarloog?.rasiidNambar || ""}, ` +
              `Tr. ${service?.sabarloog?.rasiidTaariikh ? formatDate(service.sabarloog.rasiidTaariikh) : ""}, ` +
              `D. Hoose ee: ${service?.sabarloog?.dHooseEe || ""}.`;
          } else if (service?.kuMilkiyay === "Maxkamad") {
            milkiyadDetails =
              `Warqad Lam: ${service?.maxkamad?.warqadLam || ""}, ` +
              `Maxkamada: ${service?.maxkamad?.maxkamada || ""}, ` +
              `Garsooraha: ${service?.maxkamad?.garsooraha || ""}, ` +
              `Ku saxiixan: ${service?.maxkamad?.kuSaxiixan || ""}.`;
          }

          return [
            // QORAALKA BILOWGA HESHIISKA
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.seller.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),

              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `${sellerNames} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `${sellernationality} `,
                  font: "Times New Roman",
                  size: 24,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ah , ina `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerMotherName} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ku dhashay `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerBirthPlace} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` sannadkii `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerBirthYear} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` degan `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerAddress} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` lehna `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerdocumentType} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: ` NO `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerdocumentNumber} `,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
                new TextRun({
                  text: `ee ku lifaaqan warqadaan, Tell `,
                  size: 24,
                }),
                new TextRun({
                  text: `${sellerPhone}`,
                  size: 24,
                  bold: true,
                  color: "FF0000",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: T.buyer.toUpperCase(),
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  underline: true
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `${buyerNames} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `${buyernationality} `,
                  font: "Times New Roman",
                  size: 24,
                  color: "008000",
                }),
                new TextRun({
                  text: `ah , ina `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerMotherName} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `ku dhashay `,
                  font: "Times New Roman",
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerBirthPlace} `,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` sannadkii `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerBirthYear} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` degan `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerAddress} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` lehna `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerdocumentType} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: ` NO `,
                  size: 24,
                }),
                new TextRun({
                  text: `${BuyerdocumentNumber} `,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
                new TextRun({
                  text: `ee ku lifaaqan warqadaan, Tell `,
                  size: 24,
                }),
                new TextRun({
                  text: `${buyerPhone}`,
                  size: 24,
                  bold: true,
                  color: "008000",
                }),
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
                  new TextRun({
                    text: T.sellerAgent.toUpperCase(),
                    size: 24,
                    bold: true,
                    underline: true,
                  }),
                  new TextRun({ text: " Anigoo ah ", size: 24 }),
                  new TextRun({ text: sellerAgentDetails, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({ text: `, ${wakaaladText}, kana wakiil ah iska ${T.seller} Dhulka `, size: 24 }),
                  new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),

                  new TextRun({
                    text: `, kana caafimaad qaba dhanka maskaxda, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, `
                      + `waxaa aan nootaayada iyo marqaatiyaasha hortooda ka cadeynayaa in aan  ${P.actionVerb} ${P.actionVerb2} `,
                    size: 24,
                  }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),

                  new TextRun({
                    text:
                      `,  ${cabirText} cabirkiisu yahay ${cabirFaahfaahin}, `
                      + `ku yaalla ${service?.kuYaallo?.gobol || ""} - ${service?.kuYaallo?.degmo || ""}, `
                      + `${service?.lottoLambar ? `Lotto Lambar: ${service.lottoLambar}, ` : ""}`
                      + `Ku Milkiyay: ${service?.kuMilkiyay || ""}, `
                      + `${milkiyadDetails ? milkiyadDetails + " " : ""}`
                      + `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
                    size: 24,
                    bold: true
                  }),

                  new TextRun({
                    text:
                      ` Soohdinta: Koonfur ${service?.soohdinta?.koonfur || ""}, `
                      + `Waqooyi ${service?.soohdinta?.waqooyi || ""}, `
                      + `Galbeed ${service?.soohdinta?.galbeed || ""}, `
                      + `Bari ${service?.soohdinta?.bari || ""}.`,
                    size: 24,
                    bold: true
                  }),

                  ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${service.ahna}.`, size: 24 })] : []),
                  ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${service.kaKooban}.`, size: 24 })] : []),

                  // qiimaha (haddii Wareejin/Beec)
                  ...(agreement?.sellingPrice
                    ? [
                      new TextRun({
                        text: ` Waxaan ku gaday anigoo ka wakiil ah ${T.seller} dhulka lacag dhan $${formatCurrency(
                          agreement.sellingPrice
                        )} (${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah).`,
                        size: 24,
                      }),
                    ]
                    : []),
                ]
                : [
                  new TextRun({ text: "Ugu horeyn anigoo ah ", size: 24 }),
                  new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text:
                      `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, `
                      + `waxa aan  ${P.actionVerb} ${P.actionVerb2} `,
                    size: 24,
                  }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),

                  new TextRun({
                    text:
                      `,  ${cabirText} cabirkiisu yahay ${cabirFaahfaahin}, `
                      + `ku yaalla ${service?.kuYaallo?.gobol || ""} - ${service?.kuYaallo?.degmo || ""}, `
                      + `${service?.lottoLambar ? `Lotto Lambar: ${service.lottoLambar}, ` : ""}`
                      + `Ku Milkiyay: ${service?.kuMilkiyay || ""}, `
                      + `${milkiyadDetails ? milkiyadDetails + " " : ""}`
                      + `Tr. ${service?.taariikh ? formatDate(service.taariikh) : ""}.`,
                    size: 24,
                  }),

                  new TextRun({
                    text:
                      ` Soohdinta: Koonfur ${service?.soohdinta?.koonfur || ""}, `
                      + `Waqooyi ${service?.soohdinta?.waqooyi || ""}, `
                      + `Galbeed ${service?.soohdinta?.galbeed || ""}, `
                      + `Bari ${service?.soohdinta?.bari || ""}.`,
                    size: 24,
                  }),

                  ...(service?.ahna ? [new TextRun({ text: ` Ahna: ${service.ahna}.`, size: 24 })] : []),
                  ...(service?.kaKooban ? [new TextRun({ text: ` Ka kooban: ${service.kaKooban}.`, size: 24 })] : []),

                  ...(agreement?.sellingPrice
                    ? [
                      new TextRun({
                        text: ` Waxaan ku gaday lacag dhan $${formatCurrency(agreement.sellingPrice)} (${numberToSomaliWords(
                          agreement.sellingPrice
                        )} Doolarka Mareykanka ah).`,
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
                  new TextRun({
                    text: "BEEC U AQBALAHA IIBSADAHA DHULKA",
                    size: 24,
                    underline: true,
                    bold: true,
                  }),
                  new TextRun({ text: " Anigoo ah ", size: 24 }),
                  new TextRun({ text: buyerAgentDetails, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text:
                      `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, `
                      + `waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. `
                      + `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas `
                      + `waxay si sharci ah ugu wareegeen iibsade `,
                    size: 24,
                  }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text: `, waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.`,
                    size: 24,
                  }),
                ]
                : [
                  new TextRun({ text: "Anigoo ah iibsadaha ", size: 24 }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text:
                      `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasabtayna aysan jirin, `
                      + `waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah. `
                      + `Sidaasi darteed laga bilaabo taariikhda kor ku xusan, maamulkii iyo manfacii dhulkaas `
                      + `waxay si sharci ah ugu wareegeen iibsade `,
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
        }
        case "Saami": {
          // ================= HELPERS =================
          const joinNames = (people = []) => {
            const names = people.map(p => p?.fullName).filter(Boolean);
            if (names.length === 0) return "";
            if (names.length === 1) return names[0];
            if (names.length === 2) return `${names[0]} iyo ${names[1]}`;
            return `${names.slice(0, -1).join(", ")} iyo ${names[names.length - 1]}`;
          };

          const personLine = (p, roleColor, isBuyer = false) => {
             const W = GW(p?.gender);
            // isBuyer -> hooyadiisna/hooyadayna (adiga hagaaji haddii aad gender field haysato)
            const motherLabel = isBuyer ? "hooyadiisna la yiraahdo" : "hooyadayna la yiraahdo";

            return [
              new TextRun({ text: `${p?.fullName || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
              new TextRun({ text: `${p?.nationality || ""} `, color: roleColor, size: 24, font: "Times New Roman" }),
              new TextRun({ text: `ah, ina `, size: 24, font: "Times New Roman" }),
              new TextRun({ text: `${p?.motherName || ""} `, bold: true, color: roleColor, size: 24, font: "Times New Roman" }),
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

          // Ku dhis “qof1 ... iyo qof2 ...” runs oo separators leh
          const buildPeopleRuns = (people = [], roleColor, isBuyer = false) => {
            const arr = people.filter(Boolean);
            const runs = [];
            arr.forEach((p, idx) => {
              if (idx > 0) {
                const isLast = idx === arr.length - 1;
                runs.push(new TextRun({ text: isLast ? " iyo " : ", ", size: 24, font: "Times New Roman" }));
              }
              runs.push(...personLine(p, roleColor, isBuyer));
            });
            return runs;
          };

          // ================= DATA =================
          // Waxaad ka beddeli kartaa meesha aad sellers/buyers ka soo qaadato:
          const sellers = agreement?.dhinac1?.sellers || []; // ${T.seller}(yaal)
          const buyers = agreement?.dhinac2?.buyers || []; // iibsadaha(yaal)

          const sellerNames = joinNames(sellers);
          const buyerNames = joinNames(buyers);

          const sellersPlural = sellers.length > 1;
          const buyersPlural = buyers.length > 1;

          // ================= RETURN =================
          return [
            // QORAALKA BILOWGA HESHIISKA
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement.agreementDate)}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, Nootaayaha Xafiiska Nootaayaha Boqole,xafiiskeygana ku yaal Degmada Howl-wadaag, kasoo horjeedka xawaaladda Taaj, una dhow Xarunta Hormuud, ee Magaalada Muqdisho, Jamhuuriyadda Federaalka Soomaaliya,waxaa ii hor yimid iyagoo heshiis ah,`,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),

            ...(agreement.serviceType === "Saami" ? saamiHeaderSection(agreement, service) : []),

            // Title Seller
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({ text: T.seller.toUpperCase(), font: "Times New Roman", size: 24, bold: true, underline: true }),
              ],
            }),

            // SELLERS DETAILS (MULTI)
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: buildPeopleRuns(sellers, "FF0000", false),
            }),

            // Title Buyer
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: [
                new TextRun({ text: T.buyer.toUpperCase(), font: "Times New Roman", size: 24, bold: true, underline: true }),
              ],
            }),

            // BUYERS DETAILS (MULTI)
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 50 },
              children: buildPeopleRuns(buyers, "008000", true),
            }),

            // =========================
            // SELLER SECTION (MULTI)
            // =========================
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100, before: 100 },
              children: hasSellerAgent
                ? [
                  new TextRun({ text: T.sellerAgent.toUpperCase(), size: 24, bold: true, underline: true }),
                  new TextRun({ text: sellersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
                  new TextRun({ text: sellerAgentDetails, bold: true, size: 24 }),
                  new TextRun({ text: `, ${wakaaladText},kana wakiil ah ${T.seller} `, size: 24 }),
                  new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text: sellersPlural
                      ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan ka qireynaa markhaatiyaasha iyo nootaayaha hortooda, in aan ${P.actionVerb} ${P.actionVerb2} `
                      : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin, waxaan ka qirayaa markhaatiyaasha iyo nootaayaha hortooda, in aan ${P.actionVerb} ${P.actionVerb2} `,
                    size: 24,
                  }),
                ].concat([
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text: `, saami ka mid ah saamiyada ${sellersPlural ? "aan ku leenahay" : "aan ku leeyahay"} shirkadda ${service.companyName}, oo ah sida kor ku xusan, kuna cad Activity Report-ga, Tr ${formatDate(service.SaamiDate)}.`,
                    size: 24,
                  }),
                  new TextRun({
                    text: ` Sidaa darteed laga bilaabo 01/01/2026 faa'iidada iyo manfaca saamigaan si sharci ah ugu wareegtay `,
                    size: 24,
                  }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({ text: ".", size: 24 }),
                ])
                : [
                  new TextRun({ text: sellersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
                  new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text: sellersPlural
                      ? `, kana caafimaad qabna dhanka maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan ka qireynaa markhaatiyaasha iyo nootaayaha hortooda in aan ${P.actionVerb} ${P.actionVerb2} `
                      : `, kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin, waxaan ka qirayaa markhaatiyaasha iyo nootaayaha hortooda in aan ${P.actionVerb} ${P.actionVerb2} `,
                    size: 24,
                  }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({ text: `, saami ka mid ah saamiyada ${sellersPlural ? "aan ku leenahay" : "aan ku leeyahay"} Shirkada `, size: 24 }),
                  new TextRun({ text: `${service.companyName}`, size: 24, bold: true }),
                  new TextRun({ text: ` kuna cad Activity Report-ga Tr `, size: 24 }),
                  new TextRun({ text: `${formatDate(service.SaamiDate)}`, size: 24, bold: true }),
                  new TextRun({ text: ` Sidaa darteed laga bilaabo 01/01/2026 faa'iidada iyo manfaca saamigaan si sharci ah ugu wareegtay `, size: 24 }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({ text: ".", size: 24 }),
                ],
            }),

            // =========================
            // BUYER SECTION (MULTI)
            // =========================
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              children: hasBuyerAgent
                ? [
                  new TextRun({ text: T.buyerAgent.toUpperCase(), size: 24, underline: true, bold: true }),
                  new TextRun({ text: buyersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
                  new TextRun({ text: buyerAgentDetails, bold: true, size: 24 }),
                  new TextRun({
                    text: buyersPlural
                      ? `, ahna ${T.buyerAgent}, kana caafimaad qabna maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin waxaan ku qancay ${P.actionVerb3}, una aqbalnay `
                      : `, ahna ${T.buyerAgent}, kana caafimaad qaba maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin waxaan ku qancay ${P.actionVerb3}, una aqbalay `,
                    size: 24,
                  }),
                  new TextRun({ text: sellerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({ text: ".", size: 24 }),
                ]
                : [
                  new TextRun({ text: buyersPlural ? "Annagoo ah " : "Anigoo ah ", size: 24 }),
                  new TextRun({ text: buyerNames, bold: true, color: "FF0000", size: 24 }),
                  new TextRun({
                    text: buyersPlural
                      ? `, ahna ${T.buyer}, kana caafimaad qabna maskaxda iyo jirkaba, cid nagu qasabtayna aysan jirin, waxaan cadeynaynaa in aan ku qancay ${P.actionVerb3} aqbalnay. Wixii aan ku xusneyn halkaan waxaa loo raacayaa sida uu qabo sharciga islaamka iyo qaanuunka dalka.`
                      : `, ahna ${T.buyer}, kana caafimaad qaba maskaxda iyo jirkaba, cid i qasabtayna aysan jirin, waxaan cadeynayaa in aan ku qancay ${P.actionVerb3} aqbalayna. Wixii aan ku xusneyn halkaan waxaa loo raacayaa sida uu qabo sharciga islaamka iyo qaanuunka dalka.`,
                    size: 24,
                  }),
                ],
            }),
          ];
        }
        case "Wakaalad Guud": {
          // ================= HELPERS =================
          const joinWithIyo = (arr = []) => {
            const items = arr.filter(Boolean);
            if (items.length === 0) return "";
            if (items.length === 1) return items[0];
            if (items.length === 2) return `${items[0]} iyo ${items[1]}`;
            return `${items.slice(0, -1).join(", ")} iyo ${items[items.length - 1]}`;
          };

          // Qofka bixiyaha (grantor) sida tusaalahaaga:
          // "Ahmed ..., Somali ah, hooyadayna..., ku dhashay..., sanadkii..., degan..., lehna..., Tell: ..."
          const formatGrantor = (p) => {
            if (!p) return "";

            const fullName = p.fullName || "";
            const nationality = p.nationality || "Somali";
            const mother = p.motherName || "";
            const birthPlace = p.birthPlace || "";
            const birthYear = p.birthYear || "";
            const address = p.address || "";
            const docType = p.documentType || "";
            const docNo = p.documentNumber || "";
            const phone = p.phone || "";

            // "lehna Kaarka Aqoonsiga (NIRA) lambarkiisu yahay XXX ee ku lifaaqan warqadaan"
            // (haddii aad leedahay fields kale sida issuedCountry/notes, ku dari kartaa)
            return `${fullName}, ${nationality} ah, hooyadayna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
          };

          // Qofka la wakiilanayo (agent) sida tusaalahaaga:
          // "Abdulkadir..., Somali ah, hooyadiisna..., ku dhashay..., sanadkii..., degan..., lehna..., Tell: ..."
          const formatAgent = (p) => {
            if (!p) return "";

            const fullName = p.fullName || "";
            const nationality = p.nationality || "Somali";
            const mother = p.motherName || "";
            const birthPlace = p.birthPlace || "";
            const birthYear = p.birthYear || "";
            const address = p.address || "";
            const docType = p.documentType || "";
            const docNo = p.documentNumber || "";
            const phone = p.phone || "";

            return `${fullName}, ${nationality} ah, hooyadiisna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
          };

          // Bold for names only (si ay u ekaato sida aad hore u rabtay)
          const buildRunsWithBoldNames = (people = [], formatter) => {
            // Soo saar text pieces: [ {name, restText}, ... ]
            const items = people
              .filter(Boolean)
              .map((p) => {
                const fullName = p.fullName || "";
                const fullText = formatter(p); // starts with "FullName, ..."
                const rest = fullText.startsWith(fullName)
                  ? fullText.slice(fullName.length) // ", Somali ah, ..."
                  : `, ${fullText}`;
                return { fullName, rest };
              });

            // Haddii hal qof
            if (items.length === 1) {
              return [
                new TextRun({ text: items[0].fullName, bold: true, size: 24 }),
                new TextRun({ text: items[0].rest, size: 24 }),
              ];
            }

            // Haddii labo ama ka badan: mid mid u dhis oo ku kala xiro ", " iyo " iyo "
            const runs = [];
            items.forEach((it, idx) => {
              if (idx > 0) {
                const isLast = idx === items.length - 1;
                runs.push(
                  new TextRun({
                    text: isLast ? " iyo " : ", ",
                    size: 24,
                  })
                );
              }

              runs.push(new TextRun({ text: it.fullName, bold: true, size: 24 }));
              runs.push(new TextRun({ text: it.rest, size: 24 }));
            });

            return runs;
          };

          // ================= DATA =================
          const grantors = agreement?.dhinac1?.sellers || []; // kuwa bixiya wakaalada (2/3/4...)
          const agents = agreement?.dhinac2?.buyers || []; // kuwa la wakiilanayo (1/2/3...) -> haddii aad hayso dhinac2.agents beddel

          const isPluralGrantor = grantors.length > 1;

          const healthText = isPluralGrantor
            ? " kana caafimaad qabaan dhanka maskaxda iyo jirkaba, xiskeenuna taam yahay, cid nagu qasbeysana aysan jirin wakaaladan, "
            : " kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasbeysana aysan jirin wakaaladan, ";

          const statementText = isPluralGrantor
            ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad guud u siinay "
            : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad guud u siiyay ";

          const propertyText = isPluralGrantor
            ? "dhammaan hantideena guurtada iyo maguurtada ah (oo ay ku jiraan akoonada nooga furan bangiyada dalka iyo saamiyada aan ku leenahay shirkaddaha dalka), "
            : "dhammaan hantideyda guurtada iyo maguurtada ah (oo ay ku jiraan akoonada iiga furan bangiyada dalka iyo saamiyada aan ku leeyahay shirkaddaha dalka), ";

          // ================= PARAGRAPH (HAL PARAGRAPH OO DHEER) =================
          return [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: `Maanta oo ay taariikhdu tahay ${formatDate(
                    agreement.agreementDate
                  )}, ${isPluralGrantor ? "anagoo kala ah " : "anigoo ah "}`,
                  size: 24,
                }),

                // Grantors (names bold + rest normal) oo ku xiran ", " iyo " iyo "
                ...buildRunsWithBoldNames(grantors, formatGrantor),

                // health + statement
                new TextRun({
                  text: `${healthText}${statementText}`,
                  size: 24,
                }),

                // Agents (names bold + rest normal) oo ku xiran ", " iyo " iyo "
                ...buildRunsWithBoldNames(agents, formatAgent),

                // Qaybta hantida + awoodaha (sida aad rabtay)
                new TextRun({
                  text:
                    `, ${propertyText}` +
                    `in uu gadi karo, wareejin karo, hibeyn karo, waqfi karo, xafidi karo, dhisi karo, ijaari karo, ` +
                    `rahan dhigi karo kana saari karo, iskuna dammiinan karo, maslaxane ka geli karo una qaadi karo, ` +
                    `qareen u qaban karo kuna dacwoon karo, lacagna ka saari karo, uuna leeyahay maamulka ` +
                    `${isPluralGrantor ? "hantideena" : "hantideyda"} si la mid ah maamulka sharcigu ${isPluralGrantor ? "noo" : "ii"
                    } siiyay..`,
                  size: 24,
                }),
              ],
            }),
          ];
        }
       case "Wakaalad_Gaar_ah": {
  // ================= HELPERS =================
  const joinWithIyo = (arr = []) => {
    const items = arr.filter(Boolean);
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} iyo ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} iyo ${items[items.length - 1]}`;
  };

  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const formatGrantor = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadayna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  const formatAgent = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadiisna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Bold names only
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = people
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName)
          ? fullText.slice(fullName.length)
          : `, ${fullText}`;
        return { fullName, rest };
      });

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

  // ===== WAKAALAD GAAR AH DETAILS (service) =====
  const wakaalad = service || {};

  const nooca = safe(wakaalad.Nooca); // "Dhul Banaan" | "Guri Dhisan"
  const kuYaalloDegmo = safe(wakaalad?.kuYaallo?.degmo);
  const kuYaalloGobol = safe(wakaalad?.kuYaallo?.gobol);

  // cabirka enum + faahfaahin
  const cabirkaEnum = safe(wakaalad.cabirka); // "Boos" | "Nus Boos" | "Boosas"
  const tiradaBoosaska = wakaalad.tiradaBoosaska;
  const cabirFaahfaahin = safe(wakaalad.cabirFaahfaahin); // e.g "20x20"
  const lottoLambar = safe(wakaalad.lottoLambar);

  const soohdinKoonfur = safe(wakaalad?.soohdinta?.koonfur);
  const soohdinWaqooyi = safe(wakaalad?.soohdinta?.waqooyi);
  const soohdinGalbeed = safe(wakaalad?.soohdinta?.galbeed);
  const soohdinBari = safe(wakaalad?.soohdinta?.bari);

  const kuMilkiyay = safe(wakaalad.kuMilkiyay); // "Aato" | "Sabarloog" | "Maxkamad"
  const trDate = wakaalad.taariikh ? formatDate(wakaalad.taariikh) : "";

  const formatKuMilkiyay = () => {
    if (kuMilkiyay === "Aato") {
      const cadeyn = safe(wakaalad?.aato?.cadeynLambar);
      const kasooBaxday = safe(wakaalad?.aato?.kasooBaxday);
      const kuSaxiixan = safe(wakaalad?.aato?.kuSaxiixan);

      // tusaalahaaga: "W.M.L Rep. No. NC576/2021, Tr. 2026-02-01, kana soo baxday ..., kuna saxiixan yahay ..."
      const repPart = cadeyn ? `${cadeyn}` : "";
      const trPart = trDate ? `, Tr. ${trDate}` : "";
      const kasooPart = kasooBaxday ? `, kana soo baxday ${kasooBaxday}` : "";
      const saxiixPart = kuSaxiixan ? `, kuna saxiixan yahay ${kuSaxiixan}` : "";

      return `${repPart}${trPart}${kasooPart}${saxiixPart}`;
    }

    if (kuMilkiyay === "Sabarloog") {
      const sabNo = safe(wakaalad?.sabarloog?.sabarloogNo);
      const bol1 = safe(wakaalad?.sabarloog?.bollettarioNo1);
      const bol2 = safe(wakaalad?.sabarloog?.bollettarioNo2);
      const rLam = safe(wakaalad?.sabarloog?.rasiidNambar);
      const rTar = wakaalad?.sabarloog?.rasiidTaariikh
        ? formatDate(wakaalad.sabarloog.rasiidTaariikh)
        : "";
      const dHoose = safe(wakaalad?.sabarloog?.dHooseEe);

      const parts = [];
      if (sabNo) parts.push(`Sabarloog No. ${sabNo}`);
      if (bol1) parts.push(`Bollettario No. ${bol1}`);
      if (bol2) parts.push(`Bollettario No. ${bol2}`);
      if (rLam) parts.push(`Rasiid No. ${rLam}`);
      if (rTar) parts.push(`Taariikh ${rTar}`);
      if (dHoose) parts.push(`D/Hoose ee ${dHoose}`);

      return parts.length ? parts.join(", ") : "";
    }

    if (kuMilkiyay === "Maxkamad") {
      const warqadLam = safe(wakaalad?.maxkamad?.warqadLam);
      const maxkamada = safe(wakaalad?.maxkamad?.maxkamada);
      const garsoore = safe(wakaalad?.maxkamad?.garsooraha);
      const kuSaxiixan = safe(wakaalad?.maxkamad?.kuSaxiixan);

      const parts = [];
      if (warqadLam) parts.push(`Warqad Lam. ${warqadLam}`);
      if (maxkamada) parts.push(`Maxkamadda ${maxkamada}`);
      if (garsoore) parts.push(`Garsoore ${garsoore}`);
      if (kuSaxiixan) parts.push(`Ku saxiixan ${kuSaxiixan}`);

      return parts.length ? parts.join(", ") : "";
    }

    return "";
  };

  const formatCabir = () => {
    // tusaalaha: "cabirka: 20x20" (waxaad ku keydisay cabirFaahfaahin)
    if (cabirFaahfaahin) return cabirFaahfaahin;

    // haddii cabirFaahfaahin madhan yahay, isticmaal enum:
    if (cabirkaEnum === "Boos") return "Boos";
    if (cabirkaEnum === "Nus Boos") return "Nus Boos";
    if (cabirkaEnum === "Boosas") {
      return tiradaBoosaska ? `${tiradaBoosaska} Boos` : "Boosas";
    }
    return "";
  };

  const propertySentence = () => {
    // "dhulkeyga banaan kuna yaallo degmada Yaqshiid, cabirka: 20x20, Lotto No. 223223, soohdiintiisu tahay ..."
    const propType =
      nooca === "Dhul Banaan"
        ? "dhulkeyga banaan"
        : nooca === "Guri Dhisan"
        ? "gurigayga dhisan"
        : "hantidayda";

    const locPart = kuYaalloDegmo
      ? `kuna yaallo degmada ${kuYaalloDegmo}`
      : kuYaalloGobol
      ? `kuna yaallo ${kuYaalloGobol}`
      : "";

    const cabir = formatCabir();
    const cabirPart = cabir ? `, cabirka: ${cabir}` : "";

    const lottoPart = lottoLambar ? `, Lotto No. ${lottoLambar}` : "";

    const soohdinParts = [];
    if (soohdinKoonfur) soohdinParts.push(`Koonfur ${soohdinKoonfur}`);
    if (soohdinWaqooyi) soohdinParts.push(`Waqooyi ${soohdinWaqooyi}`);
    if (soohdinGalbeed) soohdinParts.push(`Galbeed ${soohdinGalbeed}`);
    if (soohdinBari) soohdinParts.push(`Bari ${soohdinBari}`);

    const soohdinText = soohdinParts.length
      ? `, soohdiintiisu tahay ${soohdinParts.join(", ")}`
      : "";

    return `${propType} ${locPart}${cabirPart}${lottoPart}${soohdinText}`;
  };

  // ================= DATA (PEOPLE) =================
  const grantors = agreement?.dhinac1?.sellers || []; // bixiyeyaasha wakaalada
  const agents = agreement?.dhinac2?.buyers || []; // la wakiilanayo

  const isPluralGrantor = grantors.length > 1;

  // tusaalahaaga wuxuu rabaa "xiskeygana taam yahay..." (ma rabo maskax/jir)
  const healthText = isPluralGrantor
    ? ", xiskeenuna taam yahay cid nagu qasbeysana aysan jirin wakaaladan, "
    : ", xiskeygana taam yahay cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // Awoodaha (tusaalahaaga)
  const powersText = isPluralGrantor
    ? ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo hantidaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale."
    : ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo dhulkaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale.";

  const kuMilkiyayText = formatKuMilkiyay();
  const kuMilkiyayPart = kuMilkiyayText ? `, ku milkiyay ${kuMilkiyayText}` : "";

  // ================= PARAGRAPH =================
  return [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, ${isPluralGrantor ? "anagoo kala ah " : "anigoo ah "}`,
          size: 24,
        }),

        // Grantors (names bold)
        ...buildRunsWithBoldNames(grantors, formatGrantor),

        // health + statement
        new TextRun({ text: `${healthText}${statementText}`, size: 24 }),

        // Agents (names bold)
        ...buildRunsWithBoldNames(agents, formatAgent),

        // Property description (dhul/guri + location + cabir + lotto + soohdin)
        new TextRun({
          text: `, ${propertySentence()}${kuMilkiyayPart}`,
          size: 24,
        }),

        // Powers
        new TextRun({ text: powersText, size: 24 }),
      ],
    }),
  ];
}
      case "Wakaalad_Saami": {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const formatGrantor = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadayna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  const formatAgent = (p) => {
    if (!p) return "";
    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    return `${fullName}, ${nationality} ah, hooyadiisna la yiraahdo ${mother}, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Bold names only
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = people
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName)
          ? fullText.slice(fullName.length)
          : `, ${fullText}`;
        return { fullName, rest };
      });

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

  // ================= DATA (PEOPLE) =================
  const grantors = agreement?.dhinac1?.sellers || []; // bixiyeyaasha wakaalada
  const agents = agreement?.dhinac2?.buyers || []; // la wakiilanayo
  const isPluralGrantor = grantors.length > 1;

  const healthText = isPluralGrantor
    ? ", xiskeenuna taam yahay cid nagu qasbeysana aysan jirin wakaaladan, "
    : ", xiskeygana taam yahay cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // ================= SERVICE (ACCOUNTS) =================
  const svc = service || {};

  const hormuudAcc = safe(svc.accountHormuud); // e.g 839399
  const salaamAcc = safe(svc.accountSalaam);   // e.g 49495959

  // date for activity report (haddii uusan jirin, isticmaal agreement date)
  const reportDate = svc?.Date ? formatDate(svc.Date) : formatDate(agreement.agreementDate);

  const hasHormuud = !!hormuudAcc;
  const hasSalaam = !!salaamAcc;

  // Text-ka aad rabto
  const hormuudText =
    `Saamiyada aan ku leeyahay Shirkadda Hormuud Telecom Somalia inc (HorTel). ` +
    `Accounka numbarkiisu yahay ${hormuudAcc}, sida ku cad activity report-ga ka soo baxay Hormuud ` +
    `kuna taariikhaysan ${reportDate}. ` +
    `in uu gadi karo, hibayn karo, rahmi karo, waqfi karo, iskuna damiinan karo, una xayiri karo naftiisa, ` +
    `rahan dhigi karo kana saari karo, qareen u qaban karo, u dacwoon karo, isla markaasna uu leeyahay maamul ` +
    `la mid ah midka sharcigu ii siiyey oo kale. Sidoo kalena uu maamuli karo faa'idada uu soo saaro saamigaas.`;

  const salaamText =
    `Sidoo kale accounkayga bankiga Salaam Somali Bank, ee numbarkiisuna yahay ${salaamAcc}, ` +
    `in uu maamuli karo, lacag ka saari karo, lacag dhigi karo, u dacwoon karo, u doodi karo, qareena u qaban karo, ` +
    `isla markaasna uu leeyahay maamul la mid ah midka sharcigu i siiyey oo kale.`;

  // ✅ Condition: hormuud only / salaam only / both
  let accountSentence = "";
  if (hasHormuud && hasSalaam) {
    accountSentence = `${hormuudText}\n\n${salaamText}`;
  } else if (hasHormuud) {
    accountSentence = hormuudText;
  } else if (hasSalaam) {
    accountSentence = salaamText;
  } else {
    // haddii labadaba madhan yihiin (optional)
    accountSentence = "";
  }

  // ================= PARAGRAPH =================
  return [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, ${isPluralGrantor ? "anagoo kala ah " : "anigoo ah "}`,
          size: 24,
        }),

        // Grantors (names bold)
        ...buildRunsWithBoldNames(grantors, formatGrantor),

        // health + statement
        new TextRun({ text: `${healthText}${statementText}`, size: 24 }),

        // Agents (names bold)
        ...buildRunsWithBoldNames(agents, formatAgent),

        // ✅ Account text (only if exists)
        ...(accountSentence
          ? [
              new TextRun({ text: `, ${accountSentence}`, size: 24 })
            ]
          : []),
      ],
    }),
  ];
}


        default:
          return [];
      }
    };



    // ================= SAXIIX LOGIC =================
    const sellerSignTitle = hasSellerAgent
      ? `SAXIIXA ${svc.sellerAgent(sellerGender, sellerAgents.length)}`
      : `SAXIIXA ${svc.sellerMain(sellerGender, sellers.length)} `;

    const sellerSignNames = hasSellerAgent
      ? sellerAgents.map(a => a.fullName)
      : sellers.map(s => s.fullName);

    const buyerSignTitle = hasBuyerAgent
      ? `SAXIIXA ${svc.buyerAgent(buyerGender, buyerAgents.length)}`
      : `SAXIIXA ${svc.buyerMain(buyerGender, buyers.length)}`;

    const buyerSignNames = hasBuyerAgent
      ? buyerAgents.map(a => a.fullName)
      : buyers.map(b => b.fullName);
    // ================= SAXIIXYADA (2 COLUMN – NO BORDER) =================
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            // ================= SELLER COLUMN =================
            new TableCell({
              borders: hiddenBorders,
              children: [
                // TITLE
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: sellerSignTitle,
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),

                // NAMES + SIGN LINE
                ...sellerSignNames.flatMap((name) => [
                  // NAME
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [
                      new TextRun({
                        text: (name || "").toUpperCase(),
                        bold: true,

                        size: 22,
                        font: "Times New Roman",
                      }),
                    ],
                  }),

                  // SIGN LINE (CENTER)
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                      new TextRun({
                        text: "__________________________",
                        size: 22,
                      }),
                    ],
                  }),
                ]),
              ],
            }),

            // ================= BUYER COLUMN =================
            new TableCell({
              borders: hiddenBorders,
              children: [
                // TITLE
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: buyerSignTitle,
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),

                // NAMES + SIGN LINE
                ...buyerSignNames.flatMap((name) => [
                  // NAME
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                      new TextRun({
                        text: (name || "").toUpperCase(),
                        bold: true,

                        size: 22,
                        font: "Times New Roman",
                      }),
                    ],
                  }),

                  // SIGN LINE (CENTER)
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                      new TextRun({
                        text: "__________________________",
                        size: 22,
                      }),
                    ],
                  }),
                ]),
              ],
            }),
          ],
        }),
      ],
    });

    // ================= MARQAATIYAASHA =================
    const witnessesTitle = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({
          text: "SAXIIXA MARQAATIYAASHA",
          bold: true,
          size: 24,
        }),
      ],
    });



    const witnessesTable =
      agreement.witnesses && agreement.witnesses.length > 0
        ? new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: agreement.witnesses.map((w) =>
                new TableCell({
                  borders: hiddenBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 20 },
                      children: [
                        new TextRun({
                          text: (w || "").toUpperCase(),
                          bold: true,
                          size: 22,
                          font: "Times New Roman",
                        }),
                        new TextRun({
                          text: "\n__________________________",
                          size: 22,
                        }),
                      ],
                    }),
                  ],
                })
              ),
            }),
          ],
        })
        : null;



    // ================= SUGITAANKA NOOTAAYADA =================
    const notarySection = [
      // TITLE
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: "SUGITAANKA NOOTAAYADA",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),

      // REF + DATE (CENTER)
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: `REF: ${agreement.refNo}, Tr. ${formatDate(agreement.agreementDate)}`,
            size: 22,
            bold: true,
            underline: true,
            font: "Times New Roman",
          }),
          new TextRun({
            text: " Anigoo ah ",
            size: 24,
            font: "Times New Roman",
          }),
          new TextRun({
            text: "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, ",
            size: 24,
            bold: true,
            font: "Times New Roman",
          }),
          new TextRun({
            text:
              "Nootaayaha Xafiiska Nootaayaha Boqole, waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, " +
              "laguna saxiixay horteyda, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka.",
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),


      // TITLE NOOTAAYAHA
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: "NOOTAAYAHA",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),

      // NAME + SIGN LINE
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
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
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: "__________________________",
            size: 20,
          }),
        ],
      }),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 500,
                right: 800,
                bottom: 700,
                left: 800,
                footer: 200,
              },
            },
          },

          // 🟢 FOOTER (LOGO KALE)
          footers: {
            default: new Footer({
              children: [
                // FOOTER LOGO
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 20 },
                  children: [
                    new ImageRun({
                      data: footerImageBuffer,
                      type: "png",
                      transformation: {
                        width: 800,
                        height: 8,
                      },
                    }),
                  ],
                }),

                // FOOTER TEXT
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "www.Nootaayoboqole.com  Mobile: 0617730000  Email: NootaayoBoqole@gmail.com",
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
                // PAGE NUMBER
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 20 },
                  children: [
                    new TextRun({ text: "Page ", size: 20 }),
                    PageNumber.CURRENT,
                    new TextRun({ text: " of ", size: 20 }),
                    PageNumber.TOTAL_PAGES,
                  ],
                }),
              ],
            }),
          },

          // 🟢 BODY CONTENT
          children: [
            // LOGO
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 20 },
              children: [
                new ImageRun({
                  data: headerImageBuffer,
                  type: "png",
                  transformation: {
                    width: 650,
                    height: 120,
                  },
                }),
              ],
            }),

            // REF + DATE
            new Paragraph({
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: TabStopPosition.MAX,
                },
              ],
              children: [
                new TextRun({
                  text: `REF ${agreement.refNo}\t`,
                  size: 24,



                }),
                new TextRun({
                  text: formatDate(agreement.agreementDate),
                  size: 24,


                }),
              ],
            }),

            // // ✅ UJEEDDO (CENTER)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: `UJEEDDO: ${serviceHelper(agreement).ujeeddo}`,
                  bold: true,
                  underline: true,
                  size: 24,
                  font: "Times New Roman",
                }),
              ],
            }),
            ...serviceIntroParagraphs(
              agreement.serviceType,
              sellers,
              buyers,
              service,
              sellerAgents,   // ✅ ku dar
              buyerAgents,

              // ✅ ku dar
              agreement,

            ),

            // ===== SAXIIXYADA =====
            signatureTable,

            // ===== MARQAATIYAASHA =====

            witnessesTitle,
            ...(witnessesTable ? [witnessesTable] : []),



            // ===== SUGITAANKA NOOTAAYADA =====
            ...notarySection,


            // QORAALKA HESHIISKA

          ]

        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Agreement-${agreement.refNo}.docx`);
  };

  return (
    <div className="space-y-6">
      {/* Download Button Section */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-end">
        <Button
          onClick={downloadWord}
         
        >
          Download Word Document
        </Button>
      </div>

      {/* Agreement Details Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-xl">Agreement Information</h2>
            <p className="text-gray-600">Manage agreement details and pricing</p>
          </div>
          <Button
            onClick={() => {
              setFormData({
                agreementDate: agreement.agreementDate?.split("T")[0] || "",
                officeFee: agreement.officeFee || "",
                sellingPrice: agreement.sellingPrice || "",
              });
              setShowAgreementModal(true);
            }}
        
          >
            Edit Agreement
          </Button>
        </div>

        {/* Current Agreement Details Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className={`grid ${agreement.agreementType === "Beec" ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} gap-6`}>
            <div>
              <p className="text-sm text-gray-500 mb-1">Agreement Date</p>
              <p className="font-medium">{formatDate(agreement.agreementDate) || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Office Fee</p>
              <p className="font-medium">{agreement.officeFee ? `$${agreement.officeFee}` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">agreement Type</p>
              <p className="font-medium">{agreement.agreementType ? `${agreement.agreementType}` : "N/A"}</p>
            </div>
            {agreement.agreementType === "Beec" && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Selling Price</p>
                <p className="font-medium">{formatCurrency(agreement.sellingPrice) ? `$${formatCurrency(agreement.sellingPrice)}` : "N/A"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agreement Update Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-bold text-lg">Edit Agreement</h3>
              <Button
                onClick={() => setShowAgreementModal(false)}
                className="text-xl hover:text-gray-600"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agreement Date</label>
                  <Input
                    type="date"
                    value={formData.agreementDate}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Office Fee ($)</label>
                  <Input
                    type="number"
                    placeholder="Enter office fee"
                    value={formData.officeFee}
                    onChange={(e) =>
                      setFormData({ ...formData, officeFee: e.target.value })
                    }
                  />
                </div>

                {agreement.agreementType === "Beec" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Selling Price ($)</label>
                    <Input
                      type="number"
                      placeholder="Enter selling price"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, sellingPrice: e.target.value })
                      }
                    
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button
                  onClick={() => setShowAgreementModal(false)}
                  
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                 
                >
                  Updated
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementInfo;