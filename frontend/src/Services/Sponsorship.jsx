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

/**
 * buildSponsorshipDoc
 *
 * sellers[0] = Dammaanad-qaadaha
 * buyers[0]  = Qofka la damaanad qaadayo / ardayga
 *
 * service:
 * - AcademicYear
 * - universityName
 * - place
 * - bank
 * - accountNumber
 *
 * agreement:
 * - refNo
 * - agreementDate
 * - witnesses
 * - notaryName (optional haddii dibadda laga soo diro)
 */
export const buildSponsorshipDoc = ({
  agreement,
  service,
  formatDate,
  sellers = [],
  buyers = [],
  notaryName,
}) => {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());
  const upper = (v) => safe(v).toUpperCase();

  const G = (gender) => {
    const g = String(gender || "").toLowerCase();
    const isF =
      g === "female" || g === "f" || g === "naag" || g === "gabar";
    return {
      isFemale: isF,
      isMale: !isF,

      // person wording
      hasWord: isF ? "haysatana" : "haystana",

      // ownership/pronouns
      travelWord: isF ? "safarkeeda" : "safarkiisa",
      travelWord0: isF ? "safarto" : "safro",
      eduWord: isF ? "waxbarashadeeda" : "waxbarashadiisa",
      extraWord: isF ? "joogayso" : "joogayo",

      // sentence wording
      plansWord: isF ? "Waxay ay qorsheynaysaa" : "Waxa uu qorsheynayaa",
      requestWord: isF ? "Waxa ay codsatay ayna sugeysaa" : "Waxa uu codsaday uuna sugayaana",

      // text about student
      studentPronoun: isF ? "iyada" : "isaga",
      personWord: isF ? "ardayad" : "arday",
      keyss: isF ? "ay" : "uu",
      keyss0: isF ? "ayna" : "uuna",
      baratos: isF ? "barato" : "barto",

      // document words if needed later
      subjectWord: isF ? "gabadha" : "wiilka",
    };
  };

  const buildPersonIntroRuns = (person, genderMode = "self") => {
    const fullName = upper(person?.fullName);
    const nationality = safe(person?.nationality || "Soomaaliyeed");
    const documentType = safe(person?.documentType || "ID Card");
    const documentNumber = safe(person?.documentNumber);

    const personG = G(person?.gender);

    return [
      new TextRun({
        text: fullName || "________________",
        bold: true,
        color: "FF0000",
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: `, muwaadin ${nationality}, ${personG.hasWord} `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: documentType,
        bold: true,
        color: "FF0000",
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` lambarkiisu yahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: documentNumber || "________",
        bold: true,
        color: "FF0000",
        size: 24,
        font: "Times New Roman",
      }),
    ];
  };

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

  // ================= DATA =================
  const sponsor = sellers?.[0] || {};
  const student = buyers?.[0] || {};

  const sponsorName = upper(sponsor?.fullName);
  const studentName = upper(student?.fullName);

  const studentGender = G(student?.gender);

  const academicYear = safe(service?.AcademicYear);
  const universityName = safe(service?.universityName);
  const place = safe(service?.place );
  const bank = safe(service?.bank );
  const accountNumber = safe(service?.accountNumber);

  const refNo = safe(agreement?.refNo);
  const tr = agreement?.agreementDate ? formatDate(agreement.agreementDate) : "";

  const usedNotaryName =
    safe(notaryName) ||
    safe(agreement?.notaryName)

  const signatureLine = "______________________________";

  // ================= HEADER =================
  const kuLine = new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 200 , before : 200 },
    children: [
      new TextRun({
        text: "KU: CIDDA AY QUSEYSO ",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    
    ],
  });

  const ujeeddoLine = new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: "UJEEDDO: DAMAANAD-QAAD",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // ================= BODY =================

  // Paragraph 1
  const p1 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: "Aniga oo ah ",
        size: 24,
        font: "Times New Roman",
      }),

      ...buildPersonIntroRuns(sponsor),

      new TextRun({
        text: `, waxaan halkan ku caddeynayaa inaan si buuxda dammaanad ugu qaaday kharashaadka waxbarasho iyo kuwo kale ee khuseeya `,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: studentName || "________________",
        bold: true,
        color: "FF0000",
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: `, muwaadin Soomaaliyeed ah, `,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: studentGender.hasWord + " ",
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: safe(student?.documentType || "Passport"),
        bold: true,
        color: "FF0000",
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: ` lambarkiisu yahay `,
        size: 24,
        font: "Times New Roman",
      }),

      new TextRun({
        text: safe(student?.documentNumber) || "________",
        bold: true,
        color: "FF0000",
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

  // Paragraph 2
  const p2 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: `${studentGender.plansWord} in ${studentGender.keyss} u ${studentGender.travelWord0} dalka `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: upper(place),
        color: "FF0000",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` si ${studentGender.keyss} wax uga ${studentGender.baratos} `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` Jaamacadda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: universityName || "JAAMACADDA",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` sannadka waxbarasho ee `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: academicYear || "________",
        color: "FF0000",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ${studentGender.studentPronoun} oo ah ${studentGender.personWord} caalami ah.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // Paragraph 3
  const p3 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: `Sidoo kale waxaan dammaanad qaadaya dhammaan arrimaha ku saabsan `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: studentGender.travelWord,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` dalka `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: place,
        color: "FF0000",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` muddada ${studentGender.keyss} halkaas ${studentGender.extraWord} iyo dhammaan kharashka `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: studentGender.eduWord,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` sare ee dalkaas.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // Paragraph 4
  const p4 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: `Waxaan halkan ku xaqiijinayaa in aan awood u leeyahay in aan daboolo dhammaan kharashaadka jaamacadda ee ku baxaya, sida hoyga, lacagaha waxbarashada iyo waxyaabaha kale.`,
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

  // Paragraph 5
  const p5 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: `${studentGender.requestWord} in fiisaha laga siiyo Safaaradda dowladda `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: place,
        color: "FF0000",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` ee Muqdisho-Soomaaliya, waxaana si buuxda u fahamsanahay in haddii aannan gudan waajibaadkan sharci, in ay keeni karto ciqaabta uu sharciga dhigayo.`,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  });

  // Paragraph 6
  const p6 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: `Waxaan xisaab bangi ku leeyahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: bank || "Salaam Somali Bank",
        color: "FF0000",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: ` Akoonka lambarkiisu yahay `,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: accountNumber || "________",
        color: "FF0000",
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

  // ================= SIGNATURE =================
  const sponsorSigTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: "MAGACA IYO SAXIIXA DAMMAANAD-QAADAHA",
        bold: true,
        color: "FF0000",
        size: 28,
        font: "Times New Roman",
      }),
    ],
  });

  const sponsorSigName = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: sponsorName || "________________",
        bold: true,
        color: "FF0000",
        size: 28,
        font: "Times New Roman",
      }),
    ],
  });

  const sponsorSigLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: "________________________________________",
        size: 22,
        font: "Times New Roman",
      }),
    ],
  });

  // ================= WITNESSES =================
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
          text: `${usedNotaryName}, `,
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
          text: usedNotaryName,
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
    kuLine,
    ujeeddoLine,
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    sponsorSigTitle,
    sponsorSigName,
    sponsorSigLine,
    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
    
  ];
};