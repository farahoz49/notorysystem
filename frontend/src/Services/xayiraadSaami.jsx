// src/services/xayiraadSaami.js
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
 * buildXayiraadSaamiDoc
 * ✅ 2 QAAB:
 * 1) Haddii BUYER uusan jirin -> (CADDEEYAHA kaliya)
 * 2) Haddii BUYER jiro        -> (CADDEEYAHA + LOO CADDEEYAHA)
 *
 * ✅ SIGNATURE LOGIC (sida saami.js):
 * - haddii sellerAgents jiraan -> agent-yaasha ayaa saxiixaya CADDEEYAHA
 * - haddii buyerAgents jiraan  -> agent-yaasha ayaa saxiixaya LOO CADDEEYAHA
 *
 * ✅ WAKAALAD intro:
 * - haddii sellerAgent jiro -> intro = wakiilka (agent) + wakaaladText + “Wakiilna u ah ... (seller)”
 * - haddii uusan jirin -> intro = seller (caddeeye)
 */
export const buildXayiraadSaamiDoc = ({
    agreement,
    service,
    formatDate,
    numberToSomaliWords,
    formatCurrency,
    notaryName,
}) => {
    const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
    const toNum = (v) => Number(String(v ?? "").replace(/,/g, "")) || 0;

    const red = "FF0000";
    const hiddenBorders = {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };

    // ================== data ==================
    const sellers = agreement?.dhinac1?.sellers || [];
    const buyers = agreement?.dhinac2?.buyers || [];
    const hasBuyer = (buyers || []).filter(Boolean).length > 0;

    const seller = sellers?.[0] || {};
    const buyer = buyers?.[0] || {};

    const sellerAgents = agreement?.dhinac1?.agents || [];
    const buyerAgents = agreement?.dhinac2?.agents || [];
    const hasSellerAgent = sellerAgents.length > 0;
    const hasBuyerAgent = buyerAgents.length > 0;

    const sellerDocsMap = agreement?.dhinac1?.agentDocuments || {};

    // ================== computed ==================
    const amount = toNum(service?.amount);
    const shares = toNum(service?.saami); // tirada saami
    const bank = safe(service?.bank);
    const accNo = safe(service?.accountNumber);
    const activityDate = service?.date ? formatDate(service?.date) : "";
    const sababta = safe(service?.sababta);
    const mudada = safe(service?.mudada);

    const signatureLine = "______________________________";

    // ================== wakaalad text (sellerAgents) ==================
    const wakaaladText = (sellerAgents || [])
        .map((agent) => {
            const agentId = agent?._id?.toString();
            const agentDocs = sellerDocsMap?.[agentId];
            if (!agentDocs) return "";

            const { wakaalad, tasdiiq } = agentDocs;
            const parts = [];

            if (wakaalad) {
                // ✅ sida example-kaaga
                parts.push(
                    `heystana ${safe(wakaalad.wakaladType)} uu lambarkeedu yahay ${safe(
                        wakaalad.refNo
                    )} kana soo baxday xafiiska Nootaayaha Boqole, kuna taariikheysan ${safe(wakaalad.date)?.split("T")?.[0] || ""
                    } uuna ku saxiixan yahay Dr. ${safe(wakaalad.saxiix1)}`
                );
            }

            if (tasdiiq) {
                parts.push(
                    `waxaa kale oo jira Tasdiiq lambarkiisu yahay ${safe(
                        tasdiiq.refNo
                    )}, Tr. ${safe(tasdiiq.date)?.split("T")?.[0] || ""}`
                );
            }

            return parts.join(", ");
        })
        .filter(Boolean)
        .join(" | ");

    // ================== personRuns (mother phrase customizable) ==================
    const personRuns = (p, color = red, motherPhrase = "hooyadayna la yiraahdo") => [
        new TextRun({
            text: `${safe(p?.fullName)}, `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({
            text: `${safe(p?.nationality)} ah, `,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `${motherPhrase} `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.motherName)} `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `ku dhashay `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.birthPlace)}, `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `sannadkii `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.birthYear)}, `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `degan `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.address)}, `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `lehna `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.documentType)} `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({ text: `lambarkiisu yahay `, size: 24, font: "Times New Roman" }),
        new TextRun({
            text: `${safe(p?.documentNumber)} `,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({
            text: `ee ku lifaaqan warqadaan, Tell: `,
            size: 24,
            font: "Times New Roman",
        }),
        new TextRun({
            text: `${safe(p?.phone)}`,
            bold: true,
            color,
            size: 24,
            font: "Times New Roman",
        }),
    ];

    // ================== INTRO (2 qaab) ==================
    const introParagraphChildren = () => {
        const kids = [];

        // ✅ CASE A: sellerAgent jiro -> caddeeye = wakiil
        if (hasSellerAgent) {
            const agent = sellerAgents?.[0] || {};

            kids.push(
                new TextRun({
                    text: `Maanta oo ay taariikhdu tahay ${formatDate(
                        agreement?.agreementDate
                    )}, anigoo ah `,
                    size: 24,
                    font: "Times New Roman",
                }),
                ...personRuns(agent, red, "hooyadayna la yiraahdo"),
                new TextRun({ text: `, `, size: 24, font: "Times New Roman" })
            );

            // ✅ wakaalad text (ha isticmaalin \n\n gudaha TextRun; docx mararka qaar si xun ayuu u qaataa)
            if (wakaaladText) {
                kids.push(
                    new TextRun({
                        text: `${wakaaladText}, `,
                        size: 24,
                        font: "Times New Roman",
                    })
                );
            }

            kids.push(
                new TextRun({ text: `Wakiilna u ah `, size: 24, font: "Times New Roman" }),
                // new TextRun({
                //     text: `${safe(seller?.fullName)} `,
                //     bold: true,
                //     color: red,
                //     size: 24,
                //     font: "Times New Roman",
                // }),

                ...personRuns(seller, red, "hooyadiisna la yiraahdo"),
                new TextRun({
                    text: `, oo ka mid ah saamileyda Shirkadda Hormuud Telecom Somalia Inc (Hortel), `,
                    size: 24,
                    font: "Times New Roman",
                })
            );

            if (accNo) {
                kids.push(
                    new TextRun({ text: `lehna akoon nambar `, size: 24, font: "Times New Roman" }),
                    new TextRun({
                        text: `${accNo} `,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    })
                );
            }

            kids.push(
                new TextRun({
                    text: `sida ku cad Activity Report-ga, kana soo baxay Shirkadda Hormuud Telecom Somalia Inc (Hortel)`,
                    size: 24,
                    font: "Times New Roman",
                })
            );

            if (activityDate) {
                kids.push(
                    new TextRun({ text: ` kuna taariikheysan `, size: 24, font: "Times New Roman" }),
                    new TextRun({
                        text: `${activityDate} `,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    })
                );
            }

            kids.push(
                new TextRun({
                    text: `waxaan Xafiiska Nootaayaha iyo Markhaatiyaasha hortooda ka caddeynayaa, aniga oo maskaxda iyo maankaba ka fayow, cid i khasabtayna aanay jirin, in aan u xayiray (rahmay) qeyb ka mid ah saamiga `,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: `${safe(seller?.fullName)} `,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: `uu ku leeyahay Shirkadda Hormuud, dammaanadda maalgalinta uu sameeyay `,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: `${bank || "BANK"}`,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                })
            );



            kids.push(
                new TextRun({ text: `, maalgalintaas oo ku kaceysa adduun dhan: `, size: 24, font: "Times New Roman" }),
                new TextRun({
                    text: `USD ${formatCurrency(amount)}`,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: ` (${numberToSomaliWords(amount)} Doolarka mareykanka ah). `,
                    size: 24,
                    font: "Times New Roman",
                })
            );

            if (accNo) {
                kids.push(
                    new TextRun({
                        text: `saamiga aan xayiray (rahmay) waa saamiga leh akoon nambar: `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${accNo}.`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({

                        text: `Sababta aan u xayiray (rahmay) saamigayga aan ku leeyahay Shirkada Hormuud waa maalgelin nooceedu yahay `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${sababta || "----"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` taas oo ay lacag bixinteedu socon doonto muddo dhan `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${mudada || "----"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` Bilood`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` ah oo ka billaabaneysa marka aan heshiiska saxiixo ama sida ku cad heshiiska murabaxada ee u dhexeeya Bankiga iyo `,
                        size: 24,
                        font: "Times New Roman",
                    }),

                );
                // ✅ haddii buyer jiro -> ku dar “loo caddeeyaha”
                if (hasBuyer) {
                    kids.push(
                        ...personRuns(buyer, red, "hooyadiisna la yiraahdo")
                    );
                }
            }

            return kids;
        }
        // ✅ CASE C: sellerAgent ma jiro, buyer wuu jiraa
        if (!hasSellerAgent && hasBuyer) {
            kids.push(
                new TextRun({
                    text: `Maanta oo ay taariikhdu tahay ${formatDate(
                        agreement?.agreementDate
                    )}, anigoo ah `,
                    size: 24,
                    font: "Times New Roman",
                }),
                ...personRuns(seller, red, "hooyadayna la yiraahdo"),
                new TextRun({
                    text: `, oo ka mid ah saamileyda Shirkadda Hormuud Telecom Somalia Inc (Hortel), waxaan Xafiiska Nootaayaha iyo Markhaatiyaasha hortooda ka caddeynayaa, aniga oo maskaxda iyo maankaba ka fayow, cid i khasabtayna aanay jirin, in aan u xayiray (rahmay) qeyb ka mid ah saamigayga aan ku leeyahay Shirkadda Hormuud, dammaanadda maalgalinta uu u sameeyay `,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: `${bank || "BANK"} `,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                }),
                ...personRuns(buyer, red, "hooyadiisna la yiraahdo"),
                new TextRun({
                    text: `. `,
                    size: 24,
                    font: "Times New Roman",
                }),



                // new TextRun({
                //     text: `maalgalintaas oo ku kaceysa adduun dhan: `,
                //     size: 24,
                //     font: "Times New Roman",
                // }),
                // new TextRun({
                //     text: `USD ${formatCurrency(amount)} `,
                //     bold: true,
                //     color: red,
                //     size: 24,
                //     font: "Times New Roman",
                // }),
                // new TextRun({
                //     text: `(${numberToSomaliWords(amount)} Doolarka Mareykanka ah). `,
                //     size: 24,
                //     font: "Times New Roman",
                // })
            );

            if (accNo) {
                kids.push(
                    new TextRun({
                        text: `Saamiga aan xayiray (rahmay) waa saamiga leh akoon lambar: `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${accNo} `,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({

                        // pragraph one 

                        text: `Sababta aan u xayiray (rahmay) saamigaas oo ah maalgelin muraabaxo`,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${sababta || "----"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` sida ku cad heshiiska muraabaxada ee u dhexeeya`,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${bank || "----"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` iyo`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${safe(buyer?.fullName)} `,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    // pragraph two

                    new TextRun({
                        text: `Sidaa darteed waxaan ka codsanayaa Shirkadda Hormuud in ay u xayirto (rahanto) `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${bank || "BANK"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({ text: ` saami dhan `, size: 24, font: "Times New Roman" }),
                    new TextRun({
                        text: `${shares || safe(service?.saami) || "----"}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` (${numberToSomaliWords(shares || safe(service?.saami))} saami), oo u dhiganta `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `USD ${formatCurrency(amount)}`,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` (${numberToSomaliWords(amount)} Doolarka Mareykanka ah).`,
                        size: 24,
                        font: "Times New Roman",
                    }),


                    new TextRun({
                        text: ` oo ah qiimaha buugga ee Shirkadda Hormuud. Cadadka lacagta maalgalintu waa `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `USD ${formatCurrency(amount)} `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `(${numberToSomaliWords(amount)} Doolarka Mareykanka ah). `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` Mudadda lacag bixintu waa `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${mudada || "----"}`,
                        size: 24,
                        font: "Times New Roman",
                    }),

                    new TextRun({
                        text: ` bilood Qaabka lacag bixintu waxa uu noqonayaa sida ku cad heshiiska muraabaxada `,
                        size: 24,
                        font: "Times New Roman",
                    }),

                    // pragraph three

                    new TextRun({
                        text: ` Haddii uu ku bixin waayo `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${safe(buyer?.fullName)} `,
                        bold: true,
                        color: red,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` muddo lacageedka loogu talagalay qaddarka lacageed ee uu Bankigu ka sugayey muddo lixdan maalin (60 maalin) ah, waxaan halkan ku caddeynayaa in  `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `${bank || "----"}`,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: `xaq uu u leeyahay in ay Shirkadda Hormuud u xaraashto saami u dhigma qaddarka lacageed ee xilligaas lagu leeyahay ` +
                            `ee uu bixin waayey, ayadoo qiimaha lagu iibinayo saamigana uu yahay qiimaha uu maalintaas ka marayo suuqa (Market Value). `,
                        size: 24,
                        font: "Times New Roman",
                    }),
                    new TextRun({
                        text: ` Haddii uu ku bixiyo lacagaha deynta ah ee uu SALAAM SOMALI BANK ku leeyahay, waqtigii lagu heshiiyey ama ka hor,Shirkadda Hormuud waa in ay xayiraadda ka qaado saamiga aan rahmay ama xayiray, ` +
                            `ka dib markii ay Bankiga ka helaan amarka xayiraad ka qaadida saamiga `,
                        size: 24,
                        font: "Times New Roman",
                    }),

                );

            }


            return kids;
        }

        // ✅ CASE B: sellerAgent ma jiro -> caddeeye = seller
        kids.push(
            new TextRun({
                text: `Maanta oo ay taariikhdu tahay ${formatDate(
                    agreement?.agreementDate
                )}, anigoo ah `,
                size: 24,
                font: "Times New Roman",
            }),
            ...personRuns(seller, red, "hooyadayna la yiraahdo"),
            new TextRun({



                text: `, Kana mid ah saamilayda Shirkadda Hormuud, waxaan Xafiiska Nootaayaha iyo Markhaatiyaasha hortooda ka caddeynayaa, aniga oo maskaxda iyo maankaba ka fayow,cid i khasabtayna aanay jirin, in aan u xayiray (rahmay) qeyb ka mid ah saamigayga aan ku leeyahay Shirkadda Hormuud, dammaanadda maalgalinta u ii sameeyay Salaam Somali Bank, maalgalintaas oo ku kaceysa adduun dhan: `,
                size: 24,
                font: "Times New Roman",
            })
        );
        kids.push(

            new TextRun({
                text: `USD ${formatCurrency(amount)}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` (${numberToSomaliWords(amount)} Doolarka Mareykanka ah).`,
                size: 24,
                font: "Times New Roman",
            })
        );

        if (accNo) {
            kids.push(
                new TextRun({ text: `Saamigayga aan xayiray (rahmay) waa saamiga leh Akoon lambar: `, size: 24, font: "Times New Roman" }),
                new TextRun({
                    text: `${accNo} `,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                })
            );
        }

        kids.push(new TextRun({ text: `sida ku cad Activity Report-ga, kana soo baxay shirkadda Hormuud Telecom Somalia Inc (Hortel) kuna taariikheysan `, size: 24, font: "Times New Roman" }));

        if (activityDate) {
            kids.push(

                new TextRun({
                    text: `${activityDate} `,
                    bold: true,
                    color: red,
                    size: 24,
                    font: "Times New Roman",
                })
            );
        }

        kids.push(
            new TextRun({
                text: `ee ku diiwaan gashan magaceyga: `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${safe(seller?.fullName)} `,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            })
        );







        return kids;
    };

    // ================== other paragraphs ==================
    const sababMuddoParagraph = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 },
        children: [

            new TextRun({

                text: `Sababta aan u xayiray (rahmay) saamigayga aan ku leeyahay Shirkada Hormuud waa maalgelin nooceedu yahay `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${sababta || "----"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` taas oo ay lacag bixinteedu socon doonto muddo dhan `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${mudada || "----"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` Bilood`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` ah oo ka billaabaneysa marka aan heshiiska saxiixo ama sida ku cad heshiiska murabaxada ee u dhexeeya aniga iyo Bankiga.`,
                size: 24,
                font: "Times New Roman",
            }),



        ],
    });

    const requestParagraph = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 },
        children: [
            new TextRun({
                text: `Sidaa darteed waxaan ka codsanayaa Shirkadda Hormuud in ay u xayirto (rahanto) `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${bank || "BANK"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({ text: ` saami dhan `, size: 24, font: "Times New Roman" }),
            new TextRun({
                text: `${shares || safe(service?.saami) || "----"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` (${numberToSomaliWords(shares || safe(service?.saami))} saami), oo u dhiganta `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `USD ${formatCurrency(amount)}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: ` (${numberToSomaliWords(amount)} Doolarka Mareykanka ah).`,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const defaultParagraph = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 },
        children: [
            new TextRun({
                text:
                    `Haddii aan muddada lacageedka leygu talagalay ku bixin waayo qaddarka lacageed ee uu Bankigu iga sugayo ` +
                    `muddo lixdan maalin (60 maalin) ah, waxaan halkaan ku caddeynayaa in `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${bank || "BANK"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text:
                    ` xaq u leeyahay in ay Shirkadda Hormuud u xaraashto saamiga uu dhigmo qaddarka lacageed ee xilligaas lagu leeyahay, ` +
                    `ayna iibiso (Market Value).`,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const releaseParagraph = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 180 },
        children: [
            new TextRun({
                text: `Haddii aan ku bixiyo lacagaha deynta ah ee uu `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${bank || "BANK"}`,
                bold: true,
                color: red,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text:
                    ` igu leeyahay, waqtigii lagu ballamay ama ka hor, Shirkadda Hormuud waa in ay xayiraadda ka qaado saamiga aan rahmay ama xayiray, ` +
                    `ka dib markii ay Bankiga ka helaan amarka xayiraadda ka qaadida saamiga.`,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    // ================== SIGNATURES (sida saami.js logic) ==================
    const joinSigNames = (arr = []) =>
        (arr || [])
            .filter(Boolean)
            .map((p) => safe(p?.fullName).toUpperCase())
            .filter(Boolean)
            .join(" , ");

    const leftPeople = hasSellerAgent ? sellerAgents : sellers;
    const rightPeople = hasBuyerAgent ? buyerAgents : buyers;

    const leftName =
        leftPeople.length > 1 ? joinSigNames(leftPeople) : safe(leftPeople?.[0]?.fullName).toUpperCase();
    const rightName =
        rightPeople.length > 1 ? joinSigNames(rightPeople) : safe(rightPeople?.[0]?.fullName).toUpperCase();

    const signaturesBlock = () => {
        // ✅ QAAB 1: buyer ma jiro
        if (!hasBuyer) {
            const signerTitle = hasSellerAgent ? "SAXIIXA WAKIILKA CADDEEYAHA" : "SAXIIXA CADDEEYAHA";
            return [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 120, after: 80 },
                    children: [
                        new TextRun({
                            text: signerTitle,
                            bold: true,
                            underline: true,
                            size: 24,
                            font: "Times New Roman",
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 80 },
                    children: [
                        new TextRun({
                            text: leftName || "",
                            bold: true,
                            size: 22,
                            font: "Times New Roman",
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
                }),
            ];
        }

        // ✅ QAAB 2: buyer jiro -> 2 columns
        const leftTitle = hasSellerAgent ? "SAXIIXA WAKIILKA CADDEEYAHA" : "SAXIIXA CADDEEYAHA";
        const rightTitle = hasBuyerAgent ? "SAXIIXA WAKIILKA LOO CADDEEYAHA" : "SAXIIXA LOO CADDEEYAHA";

        return [
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: hiddenBorders.top,
                    bottom: hiddenBorders.bottom,
                    left: hiddenBorders.left,
                    right: hiddenBorders.right,
                    insideHorizontal: hiddenBorders.top,
                    insideVertical: hiddenBorders.top,
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: hiddenBorders,
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 60 },
                                        children: [
                                            new TextRun({
                                                text: leftTitle,
                                                bold: true,
                                                underline: true,
                                                size: 24,
                                                font: "Times New Roman",
                                            }),
                                        ],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 60 },
                                        children: [new TextRun({ text: leftName || "", bold: true, size: 22, font: "Times New Roman" })],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
                                    }),
                                ],
                            }),

                            new TableCell({
                                borders: hiddenBorders,
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 60 },
                                        children: [
                                            new TextRun({
                                                text: rightTitle,
                                                bold: true,
                                                underline: true,
                                                size: 24,
                                                font: "Times New Roman",
                                            }),
                                        ],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 60 },
                                        children: [new TextRun({ text: rightName || "", bold: true, size: 22, font: "Times New Roman" })],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [new TextRun({ text: signatureLine, size: 22, font: "Times New Roman" })],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ];
    };

    // ================= MARQAATIYAASHA =================
    const witnessesTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
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


    const witnessesTable =
        agreement?.witnesses && agreement.witnesses.length > 0
            ? new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: hiddenBorders.top,
                    bottom: hiddenBorders.bottom,
                    left: hiddenBorders.left,
                    right: hiddenBorders.right,
                    insideHorizontal: hiddenBorders.top,
                    insideVertical: hiddenBorders.top,
                },
                rows: [
                    new TableRow({
                        children: agreement.witnesses.map((w) =>
                            new TableCell({
                                borders: hiddenBorders,
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 120 },
                                        children: [
                                            new TextRun({
                                                text: (w || "").toUpperCase(),
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
                            })
                        ),
                    }),
                ],
            })
            : null;

    // ================= SUGITAANKA NOOTAAYADA =================
    const notarySection = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 120 },
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
                    text: `REF: ${safe(agreement?.refNo)}, Tr. ${formatDate(agreement?.agreementDate)} `,
                    size: 22,
                    bold: true,
                    underline: true,
                    font: "Times New Roman",
                }),
                new TextRun({ text: "Anigoo ah ", size: 24, font: "Times New Roman" }),
                new TextRun({
                    text: notaryName,
                    size: 24,
                    bold: true,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text:
                        " Nootaayaha Xafiiska Nootaayaha Boqole, waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, laguna saxiixay horteyda, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka.",
                    size: 24,
                    font: "Times New Roman",
                }),
            ],
        }),

        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
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

    // ================== RETURN ==================
    return [
        // TITLE
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new TextRun({
                    text: "UJEEDDO: XAYIRAAD SAAMI",
                    bold: true,
                    underline: true,
                    size: 24,
                    font: "Times New Roman",
                }),
            ],
        }),

        // INTRO
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: introParagraphChildren(),
        }),

        // SABAB + MUDDO

        ...(hasSellerAgent ? [] : [sababMuddoParagraph]),

        // REQUEST
        requestParagraph,

        // DEFAULT RULE
        defaultParagraph,

        // RELEASE RULE
        releaseParagraph,

        // SIGNATURES
        ...signaturesBlock(),

        // WITNESSES
        ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),

        // NOTARY
        ...notarySection,
    ];
};