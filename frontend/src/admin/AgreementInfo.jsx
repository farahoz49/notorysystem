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
import numberToSomaliWords from "../helpers/NumberToSomali.js";
import { formatCurrency } from "../helpers/formatCurrency.js";
import { formatDate } from "../helpers/formatDate.js";
import logo from '../assets/Logo1.jpg'
import footerLogo from '../assets/footer.png'
import { getTitles } from "../helpers/genderRules.js";
import { getPhrases } from "../helpers/PhraseMap.js";
import { GW } from "../helpers/genderWords.js";
import { updateAgreement } from "../api/agreements.api.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { buildWakaaladSaamiDoc } from "../Services/wakaaladSaami.jsx";
import { buildCaddeynCase } from "../Services/Caddeyn.jsx"
import { buildDhulBanaanDoc } from "../Services/DhulBanaan.jsx";
import { buildSaamiDoc } from "../Services/saami.jsx";
import { buildBaabuurDoc } from "../Services/baabuur.jsx";
import { buildMootoDoc } from "../Services/mooto.jsx";
import { buildWakaaladGuudDoc } from "../Services/WakaaladGuud.jsx";
import { buildWakaaladKaleDoc } from "../Services/wakaaladKale.jsx";
import { buildWakaaladGaarAhDoc } from "../Services/wakaaladGaarAh.jsx";
import { Heshiis2daraf } from "../Services/Heshiis2daraf.jsx";
import { buildDaaminulMaalDoc } from "../Services/daaminulMaal.jsx";
import { useSelector } from "react-redux";
import { buildShaqaaleysiinDoc } from "../Services/Shaqaaleysiin.jsx";
import { buildXayiraadSaamiDoc } from "../Services/xayiraadSaami.jsx";

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
  const { user } = useSelector((state) => state.auth);
  const { data: settings } = useSelector((state) => state.settings);
  const website = settings?.office?.website || "www.Nootaayoboqole.com";
  const email = settings?.office?.email;
  const Phone = settings?.office?.phone1;
  const notaryName = settings?.office?.DrName;

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





  // ================= DOWNLOAD WORD =================
  const downloadWord = async () => {


    const sellers = agreement.dhinac1?.sellers || [];
    const buyers = agreement.dhinac2?.buyers || [];

    const normalizeGender = (g) =>
      String(g || "male").toLowerCase() === "female" ? "female" : "male";

    const sellerGender = normalizeGender(sellers?.[0]?.gender);
    const buyerGender = normalizeGender(buyers?.[0]?.gender);

    const service = agreement.serviceRef || {};

    const sellerAgents = agreement.dhinac1?.agents || [];

    const buyerAgents = agreement.dhinac2?.agents || [];
    const docs = agreement?.dhinac1?.agentDocuments || {};




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








    const serviceIntroParagraphs = (
      serviceType,
      sellers,
      buyers,
      service,
      sellerAgents,
      buyerAgents,
      agreement,
      notaryName

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
          // if (wakaalad) {
          //   textParts.push(
          //     `haystana ${wakaalad.wakaladType || ""} lambarkeedu yahay ${wakaalad.refNo || ""},Tr. ${formatDate(wakaalad.date) || ""},kana soo baxday Xafiiska Nootaayaha iyo Latalinta Sharciga ah ee ${wakaalad.kasooBaxday || ""},uuna saxiixay Dr.${wakaalad.saxiix1 || ""}`
          //   );
          // }

          // // ✅ Haddii Tasdiiq jirto (OPTIONAL)
          // if (tasdiiq) {
          //   textParts.push(
          //     `waxaa kale oo jira Tasdiiq lambarkiisu yahay ${tasdiiq.refNo || ""},Tr. ${formatDate(tasdiiq.date)}`
          //   );
          // }

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
      const buyerList = (agreement?.dhinac2?.buyers || []).filter(p => p?.fullName);

      const sellerAgentList = (agreement?.dhinac1?.agents || []).filter(p => p?.fullName);
      const buyerAgentList = (agreement?.dhinac2?.agents || []).filter(p => p?.fullName);

      // ✅ waa in ay kor joogaan
      const seller0 = sellerList?.[0] || {};
      const buyer0 = buyerList?.[0] || {};

      // hadda ka dib isticmaal
      const sellernationality = seller0.nationality || "";
      const sellerMotherName = seller0.motherName || "";
      const sellerBirthPlace = seller0.birthPlace || "";
      const sellerBirthYear = seller0.birthYear || "";
      const sellerAddress = seller0.address || "";
      const sellerdocumentType = seller0.documentType || "";   // ✅ (hoos eeg #2)
      const sellerdocumentNumber = seller0.documentNumber || "";   // ✅
      const sellerPhone = seller0.phone || "";

      const buyernationality = buyer0.nationality || "";
      const buyerMotherName = buyer0.motherName || "";
      const buyerBirthPlace = buyer0.birthPlace || "";
      const buyerBirthYear = buyer0.birthYear || "";
      const buyerAddress = buyer0.address || "";
      const buyerdocumentType = buyer0.documentType || "";
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

          new TextRun({ text: `${w.dhalasho} `, size: 24, font: "Times New Roman" }), // ku dhashay/ku dhalatay
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
          return buildMootoDoc({
            agreement,
            service,
            formatDate,
            formatCurrency,
            numberToSomaliWords,
            getTitles,

            personInfoRuns,
            seller0,
            buyer0,
            GW,
            hasSellerAgent,
            hasBuyerAgent,
            sellerAgentDetails,
            buyerAgentDetails,
            wakaaladText,
            sellerNames,
            buyerNames,
            notaryName
          });


        case "baabuur":
          return buildBaabuurDoc({
            agreement,
            service,
            formatDate,
            formatCurrency,
            numberToSomaliWords,
            getTitles,
            getPhrases,

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
            GW,
          });


        case "Saami":
          return buildSaamiDoc({
            agreement,
            service,
            formatDate,
            numberToSomaliWords,
            formatCurrency,
            getTitles,
            getPhrases,
            GW,
            notaryName
          });
        case "XayiraadSaami":
          return buildXayiraadSaamiDoc({ agreement, service, formatDate, numberToSomaliWords, formatCurrency, notaryName })

        case "DhulBanaan":
          return buildDhulBanaanDoc({
            agreement,
            service,
            formatDate,
            formatCurrency,
            numberToSomaliWords,
            getTitles,
            getPhrases,
            GW,
            sellers,
            buyers,
            sellerAgents,
            buyerAgents,
            hasSellerAgent,
            hasBuyerAgent,
            sellerNames,
            buyerNames,
            sellerAgentDetails,
            buyerAgentDetails,
            wakaaladText,
            // includeLocalSignatures: true, // only haddii aad rabto in case-kan kaliya saxiixyo ku daraan
          });



        case "Wakaalad Guud":
          return buildWakaaladGuudDoc({ agreement, formatDate });
        case "Wakaalad kale":
          return buildWakaaladKaleDoc({ agreement, service, formatDate });
        case "Wakaalad_Gaar_ah":
          return buildWakaaladGaarAhDoc({ agreement, service, formatDate });

        // gudaha switch-case:
        case "Wakaalad_Saami": {
          return buildWakaaladSaamiDoc({
            agreement,
            service,
            formatDate,
            GW,
          });
        }
        case "Caddeyn": {
          return buildCaddeynCase({ agreement });
        }
        case "Heshiis Dhex Maray Laba Daraf": {
          return Heshiis2daraf({ agreement });
        }
        case "Daaminulmaal":
          return buildDaaminulMaalDoc({ agreement, service, formatDate, formatCurrency, numberToSomaliWords, sellers, buyers });
        case "Shaqaaleysiin":
          return buildShaqaaleysiinDoc({ agreement, service, formatDate, formatCurrency, numberToSomaliWords, sellers, buyers, notaryName });


        default:
          return [];
      }
    };





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
                      text: `${website}  Email: ${email} Mobile: ${Phone}`,

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


            ...serviceIntroParagraphs(
              agreement.serviceType,
              sellers,
              buyers,
              service,
              sellerAgents,   // ✅ ku dar
              buyerAgents,
              agreement,
              notaryName,


            ),
            console.log(notaryName)


          ]

        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${agreement.refNo}-${agreement.serviceType}.docx`);
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
              <p className="text-sm text-gray-500 mb-1">Khidmada</p>
              <p className="font-medium">{agreement.officeFee ? `$${agreement.officeFee}` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Adeega</p>
              <p className="font-medium">
                {agreement.agreementType} {agreement.serviceType}
              </p>
            </div>
            {agreement.agreementType === "Beec" && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Beeca</p>
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