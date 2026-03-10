import {
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
} from "docx";
import { GW } from "../helpers/genderWords.js";
/**
 * buildKireeynDoc
 *
 * agreement:
 * - refNo
 * - agreementDate
 * - witnesses
 * - notaryName
 *
 * service:
 * - gobtakirada
 * - address
 * - cabirka
 * - mudo
 * - dateB
 * - qimahakirada
 * - qimahahormariska
 * - mudohormaris
 * - dateB1
 * - mudoKurdhin
 *
 * sellers[0] = kireeyaha
 * buyers[0]  = kireystaha
 */
export const buildKireeynDoc = ({
    agreement,
    service,
    formatDate,
    sellers = [],
    buyers = [],
    notaryName,
    numberToSomaliWords,
    formatCurrency,
}) => {
    // ================= HELPERS =================
    const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

    const toNum = (v) => {
        if (v === undefined || v === null || v === "") return 0;
        return Number(String(v).replace(/,/g, "")) || 0;
    };

    const upper = (v) => safe(v).toUpperCase();

    const hiddenBorders = {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };

    const tableNoBorders = {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };

    const redRun = (text, extra = {}) =>
        new TextRun({
            text,
            color: "FF0000",
            bold: true,
            size: 24,
            font: "Times New Roman",
            ...extra,
        });

    const normalRun = (text, extra = {}) =>
        new TextRun({
            text,
            size: 24,
            font: "Times New Roman",
            ...extra,
        });

    const titleParagraph = (text) =>
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 120 },
            children: [
                new TextRun({
                    text,
                    bold: true,
                    underline: true,
                    size: 24,
                    font: "Times New Roman",
                }),
            ],
        });

    const bulletParagraph = (children) =>
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
            bullet: { level: 0 },
            children,
        });

    const addMonths = (startDate, months) => {
        if (!startDate || !months) return "";
        const date = new Date(startDate);
        if (Number.isNaN(date.getTime())) return "";

        date.setMonth(date.getMonth() + parseInt(months, 10));
        date.setDate(date.getDate() - 1);

        return formatDate(date);
    };

    const monthsText = (months) => {
        const n = toNum(months);
        if (!n) return "";
        if (typeof numberToSomaliWords === "function") {
            return numberToSomaliWords(n);
        }
        return String(n);
    };

    const moneyText = (amount) => {
        const n = toNum(amount);
        if (!n) return "";
        if (typeof numberToSomaliWords === "function") {
            return numberToSomaliWords(n);
        }
        return String(n);
    };

    const usdText = (amount) => {
        const n = toNum(amount);
        if (!n) return "USD ____";
        if (typeof formatCurrency === "function") {
            return formatCurrency(n);
        }
        return `USD ${n.toFixed(2)}`;
    };

    const personLabel = (person, fallback) => {
        const name = safe(person?.fullName);
        return name ? upper(name) : fallback;
    };

    // ================= DATA =================
    const kireeye = sellers?.[0] || {};
    const kireyste = buyers?.[0] || sellers?.[1];

    const gobtakirada = safe(service?.gobtakirada);
    const address = safe(service?.address);
    const cabirka = safe(service?.cabirka);

    const mudo = safe(service?.mudo);
    const dateB = service?.dateB ? formatDate(service.dateB) : "";
    const dateDEnd = service?.dateB && service?.mudo ? addMonths(service.dateB, service.mudo) : "";

    const qimahakirada = toNum(service?.qimahakirada);
    const qimahahormariska = toNum(service?.qimahahormariska);
    const mudohormaris = safe(service?.mudohormaris);
    const dateB1 = service?.dateB1 ? formatDate(service.dateB1) : "";
    const dateD1End =
        service?.dateB1 && service?.mudohormaris
            ? addMonths(service.dateB1, service.mudohormaris)
            : "";

    const mudoKurdhin = safe(service?.mudoKurdhin);

    const hasAdvanceData =
        qimahahormariska || safe(service?.mudohormaris) || safe(service?.dateB1);

    const refNo = safe(agreement?.refNo);
    const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";
    const usedNotaryName = safe(notaryName) || safe(agreement?.notaryName);
    const grantors =
        agreement?.dhinac1?.sellers?.length
            ? agreement.dhinac1.sellers
            : sellers || [];

    const agents =
        agreement?.dhinac2?.buyers?.length
            ? agreement.dhinac2.buyers
            : buyers || [];

    const isPluralGrantor = grantors.length > 1;
    const W0 = GW(grantors?.[0]?.gender || "male");

    const formatPersonTextParts = (p) => {
        if (!p) return { name: "", rest: "" };

        const W = GW(p.gender || "male");

        const fullName = safe(p.fullName);
        const nationality = safe(p.nationality) || "Soomaali";
        const mother = safe(p.motherName);
        const birthPlace = safe(p.birthPlace);
        const birthYear = safe(p.birthYear);
        const personAddress = safe(p.address);
        const docType = safe(p.documentType);
        const docNo = safe(p.documentNumber);
        const phone = safe(p.phone);

        const rest =
            `, ${nationality} ah, ku dhashay ${birthPlace}, sanadkii ${birthYear}, degan ${personAddress}, ` +
            `${W.hooyo} la yiraahdo ${mother}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tel ${phone}.`;

        return { name: fullName, rest };
    };


    const numberedPersonParagraph = (idx, p) => {
        const { name, rest } = formatPersonTextParts(p);

        return new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 140 },
            children: [
                new TextRun({
                    text: `${idx}. `,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: name || "________________",
                    bold: true,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text: rest,
                    size: 24,
                    font: "Times New Roman",
                }),
            ],
        });
    };

    const title = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200},
      children: [
        new TextRun({
          text: "UJEEDDO: HESHIIS KIRO",
          bold: true,
          underline: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    })
    const dhinac1Title = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200, before: 200 },
        children: [
            new TextRun({
                text: `Maanta oo ay taariikhdu tahay ${formatDate(
                    agreement?.agreementDate
                )}, anigoo ah ${usedNotaryName}, `,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: `${usedNotaryName}, `,
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
    });

    const dhinac1Paragraphs = grantors.length
        ? grantors.map((p, i) => numberedPersonParagraph(i + 1, p))
        : [
            // new Paragraph({
            //     alignment: AlignmentType.JUSTIFIED,
            //     spacing: { after: 140 },
            //     children: [
            //         new TextRun({
            //             text: "1. ________________________________",
            //             size: 24,
            //             font: "Times New Roman",
            //         }),
            //     ],
            // }),
        ];



    const dhinac2Paragraphs = agents.length
        ? agents.map((p, i) => numberedPersonParagraph(i + 1, p))
        : [
            // new Paragraph({
            //     alignment: AlignmentType.JUSTIFIED,
            //     spacing: { after: 140 },
            //     children: [
            //         new TextRun({
            //             text: "1. ________________________________",
            //             size: 24,
            //             font: "Times New Roman",
            //         }),
            //     ],
            // }),
        ];

    // ================= INTRO =================
    const intro = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [
            normalRun(
                "Labada daraf ee magacyadooda kor ku xusan yihiin waxa ay iga codsadeen inaan qoraal ugu sameeyo heshiis kiro oo ah sida soo socoto:"
            ),
        ],
    });

    // ================= QODOBKA 1 =================
    const q1Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 1",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Tilmaamaha Goobta La Kireynayo",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q1 = bulletParagraph([
        redRun(gobtakirada || "________"),
        normalRun(" oo ku taallo "),
        redRun(address || "________"),
        normalRun(", cabirkiisu yahay "),
        redRun(cabirka || "________"),
        normalRun(" oo laga kireynayo "),
        redRun(personLabel(kireyste, "________")),
    ]);

    // ================= QODOBKA 2 =================
    const q2Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 2",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Mudada kirada",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q2Children = !mudo
        ? [normalRun("Mudada kirada waa mid furan.")]
        : [
            normalRun("Mudada kirada waa "),
            redRun(`${mudo} bilood`),
            normalRun(" ("),
            redRun(`${monthsText(mudo)} bilood`),
            normalRun(") oo ka bilaabaneysa "),
            redRun(dateB || "________"),
            normalRun(" kuna eg "),
            redRun(dateDEnd || "________"),
            normalRun("."),
        ];

    const q2 = bulletParagraph(q2Children);

    // ================= QODOBKA 3 =================
    const q3Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 3",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Qiimaha kirada",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q3Children = [
        normalRun("Qiimaha kirada bishii waa "),
        redRun(usdText(qimahakirada)),
        normalRun(" ("),
        redRun(moneyText(qimahakirada) || "____"),
        normalRun(" oo Doolarka Mareekanka ah)"),
    ];

    if (hasAdvanceData) {
        q3Children.push(
            normalRun(", waxaana la hormariyay lacag dhan "),
            redRun(usdText(qimahahormariska)),
            normalRun(" ("),
            redRun(moneyText(qimahahormariska) || "____"),
            normalRun(" Doolarka Mareykanka ah), oo ah mudo "),
            redRun(`${mudohormaris || "____"} Bilood`),
            normalRun(" ("),
            redRun(`${monthsText(mudohormaris) || "____"} bilood`),
            normalRun(") oo ka bilaabaneysa "),
            redRun(dateB1 || "________"),
            normalRun(" kuna eg "),
            redRun(dateD1End || "________")
        );
    }

    q3Children.push(normalRun("."));

    const q3 = bulletParagraph(q3Children);

    // ================= QODOBKA 4 =================
    const q4Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 4",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Waajibka Kireeyaha",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q4 = [
        bulletParagraph([
            normalRun(
                "Kireeyaha ayaa mas’uul ka ah wixii ka yimaada milkiyadda Goobta uu kireeyey oo sheegasho dad kale ah, waxa uuna dammaanad qaadayaa in uu celin doono wixii hanti ah oo goobtaas galay. haddii cid kale sheegato."
            ),
        ]),
        bulletParagraph([
            normalRun(
                "kireeyuhu waa in uu ku wareejiyaa goobta la kireeyey oo dhamaystiran kireystaha"
            ),
        ]),
        bulletParagraph([
            normalRun(
                "kireeyuhu waa in uusan la imaan wax dhibaya ama qalqal galinaya howlaha ku intifaaca goobta uu kireeyay ."
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Wixii is bedel ah ee lagu sameynayo heshiiskan waa in ay isla ogolaadaan labada dhinac"
            ),
        ]),
        ...(mudoKurdhin
            ? [
                bulletParagraph([
                    normalRun(
                        "Haddii kireeyaha uu u baahdo goobta la kireeyey waa in uu kireystaha siiyaa wargelin aan ka yarayn muddo "
                    ),
                    redRun(mudoKurdhin),
                    normalRun(" bilood ah."),
                ]),
            ]
            : []),
    ];

    // ================= QODOBKA 5 =================
    const q5Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 5",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Waajibka Kireystaha",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q5 = [
        bulletParagraph([
            normalRun(
                "Kireystaha ayaa xil ka saaran yahay nadaafada iyo ilaalinta goobta uu kireystay asagoo mas’uul ka ah wixii burbur ah ee goobtaas uu u gaysto muddada uu kirada ku degan yahay"
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Kireystaha waxaa waajib ku ah in uu bixiyo kirada sida ku cad qodobka 2aad ee heshiiskan"
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Kireystaha waa in uu ilaaliyaa dhismaha Goobta uu kireeyey isla markaana uu xafido goobtaas"
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Kireystaha waxa ka mamnuuc ah in goobta uu kireystey lagu isticmaalo wax maan-dooriya ah, in lagu kaydiyo wax hub ah, in loo isticmaalo si aanu sharcigu islaamka iyo qaanuunka dalka aan waafaqsanayn."
            ),
        ]),
        ...(mudoKurdhin
            ? [
                bulletParagraph([
                    normalRun(
                        "Haddii uu kireystahu rabo in uu ka baxo goobta uu kireystey, waa in uu ku war-geliyaa kireeyaha ugu yaraan muddo "
                    ),
                    redRun(mudoKurdhin),
                    normalRun(" bilood ah ka hor."),
                ]),
            ]
            : []),
    ];

    // ================= QODOBKA 6 =================
    const q6Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 6",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Sii Socosha La’aanta Heshiiska",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });
    const q6 = bulletParagraph([
        normalRun(
            "Haddii inta lagu guda jiro mudada kirada, goobta la kireeyey ay baaba’do dhammaanteed ama qeyb ka mid ah musiibo rabaani ah darteed, heshiiska dib ayaa loogu noqonayaa si dhinacyadu go’aan ugu gaaraan iyadoo la dhowrayo mabda’a niyadsamida."
        ),
    ]);

    // ================= QODOBKA 7 =================
    const q7Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 7",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Dhammaadka Kirada",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q7 = [
        bulletParagraph([
            normalRun(
                "Kirada waxay ku eg’tahay marka ay dhammaato mudada ku xusan qodobka 2aad ee heshiiska."
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Marka ay dhammaato mudada kirada haddii uu kireestaha sii wado ku intifaaca goobta la kireeyey, kireeyuhuna uusan ka hor imaanin waxaa loo aqoonsanayaa in kirada la cusbooneysiiyey."
            ),
        ]),
        bulletParagraph([
            normalRun(
                "Haddii ay dhammaato mudada kiradu dhinacyadu waa in ay isku yimaadaan si looga wada hadlo heshiiska."
            ),
        ]),
    ];

    // ================= QODOBKA 8 =================
    const q8Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 8",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Wax Ka Badelista Goobta",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });
    const q8 = bulletParagraph([
        normalRun(
            "Kiraystahu haddii uu rabo in uu wax ka bedelo goobta uu kiraystey waa m uu ogolaansho ka helaa kireeyaha"
        ),
    ]);

    // ================= QODOBKA 9 =================
    const q9Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 9",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
            new TextRun({
                text: " Haddii Khilaaf Yimaado",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const q9 = bulletParagraph([
        normalRun(
            "Haddii khilaaf yimaado waxaa lagu xalinayaa shareecada islaamka iyo qaanuunka dalka."
        ),
    ]);

    // ================= QODOBKA 10 =================
    const q10Title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 120 },
        children: [
            new TextRun({
                text: "Qodobka 10",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
            new TextRun({
                text: "aad",
                bold: true,
                underline: true,
                superScript: true,
                size: 18,
                font: "Times New Roman",
            }),
        ],
    });

    const q10 = bulletParagraph([
        normalRun(
            "Qoraalkaan waxaan loo akhriyey dhammaan dadkii loo qoray, ka dibna halkaan hoose ayey wada saxiixeen markii ay fahmeen nuxurka iyo ujeedadiisa"
        ),
    ]);

    // ================= SIGNATURES =================
    const signaturesTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 120 },
        children: [
            new TextRun({
                text: "SAXIIXYADA DHINACYADA",
                bold: true,
                underline: true,
                size: 24,
                font: "Times New Roman",
            }),
        ],
    });

    const signatureTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableNoBorders,
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
                                    redRun("KIREEYAHA", { size: 26 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 50 },
                                children: [
                                    redRun(personLabel(kireeye, "________________"), { size: 24 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [normalRun("__________________________")],
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
                                    redRun("KIREYSTAHA", { size: 26 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 50 },
                                children: [
                                    redRun(personLabel(kireyste, "________________"), { size: 24 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [normalRun("__________________________")],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    // ================= WITNESSES =================
    const witnesses = Array.isArray(agreement?.witnesses) ? agreement.witnesses : [];

    const toWitnessLine = (w) => {
        if (!w) return "";
        if (typeof w === "string") return upper(w);
        const name = safe(w?.name || w?.fullName);
        const phone = safe(w?.phone);
        return upper(phone ? `${name} (${phone})` : name);
    };

    const witnessRows =
        witnesses.length > 0
            ? Array.from({ length: Math.ceil(Math.min(witnesses.length, 4) / 2) }).map((_, i) => {
                const leftW = witnesses[i * 2];
                const rightW = witnesses[i * 2 + 1];

                const makeCell = (w) =>
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: hiddenBorders,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 70 },
                                children: [
                                    new TextRun({
                                        text: toWitnessLine(w) || "________________",
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

                return new TableRow({
                    children: [makeCell(leftW), makeCell(rightW)],
                });
            })
            : [];

    const witnessesTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 100 },
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
        witnessRows.length > 0
            ? new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: tableNoBorders,
                rows: witnessRows,
            })
            : null;

    // ================= NOTARY =================
    const notarySection = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 220, after: 120 },
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
            spacing: { after: 110 },
            children: [
                new TextRun({
                    text: `REF: ${refNo || "____"}, Tr. ${tr || "____"} `,
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
                    text: `${usedNotaryName || "________________"}, `,
                    bold: true,
                    size: 24,
                    font: "Times New Roman",
                }),
                new TextRun({
                    text:
                        "Nootaayaha Xafiiska Nootaayaha Boqole, waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, laguna saxiixay horteyda, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka Soomaaliya.",
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
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: usedNotaryName || "________________",
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

    // ================= RETURN =================
    return [
        title,
        dhinac1Title,
        ...dhinac1Paragraphs,

        // dhinac2Title,
        ...dhinac2Paragraphs,
        intro,

        q1Title,
        // q1Sub,
        q1,

        q2Title,

        q2,

        q3Title,

        q3,

        q4Title,

        ...q4,

        q5Title,

        ...q5,

        q6Title,

        q6,

        q7Title,

        ...q7,

        q8Title,
        ,
        q8,

        q9Title,

        q9,

        q10Title,
        q10,

        signaturesTitle,
        signatureTable,

        ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
        ...notarySection,
    ];
};