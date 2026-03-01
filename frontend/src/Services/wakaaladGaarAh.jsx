// src/docTemplates/wakaaladGaarAh.js
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
 * ✅ WAKAALAD GAAR AH (Dhul Banaan / Guri Dhisan) - gooni ah
 * - Multi grantors + multi agents
 * - Names bold only
 * - Property details...
 * - Hal paragraph dheer
 * - ✅ Signature + Witnesses + Sugitaanka Nootaayada
 * - ✅ Titles: single/plural + male/female
 */
export const buildWakaaladGaarAhDoc = ({ agreement, service, formatDate }) => {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  const singleOrPlural = (count, single, plural) => (count > 1 ? plural : single);

  const maleFemale = (gender, male, female) =>
    String(gender || "").toLowerCase() === "female" ? female : male;

  // ✅ LOCAL gender words (GW global ma isticmaaleyno)
  const G = (gender) => {
    const g = String(gender || "").toLowerCase();
    const isF = g === "female";
    return {
      grantorMother: "hooyadayna la yiraahdo", // bixiye (had iyo jeer sidan ayaad rabtay)
      agentMother: isF ? "hooyadeedna la yiraahdo" : "hooyadiisna la yiraahdo",
      born: isF ? "ku dhalatay" : "ku dhashay",
    };
  };

  // ✅ female single grantor text adjust (uu->ay, karo->karto)
  const toFemaleSingleGrantorText = (txt = "", grantorGender, isPluralGrantor) => {
    const isFSingle = !isPluralGrantor && String(agentGender || "").toLowerCase() === "female";
    if (!isFSingle) return String(txt);

    return String(txt)
      .replaceAll("in uu", "in ay")
      .replaceAll(" uu ", " ay ")
      .replaceAll(" uuna ", " ayna ")
      .replaceAll("uuna", "ayna")
      .replace(/\bkaro\b/g, "karto");
  };

  // ================= PEOPLE =================
  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;
  const grantorGender = grantors?.[0]?.gender || "male";
  const agentGender = agents?.[0]?.gender || "male";

  const formatGrantor = (p) => {
    if (!p) return "";
    const W = G(p?.gender);

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    // ✅ grantor: hooyadayna... (sidaad rabtay)
    return `${fullName}, ${nationality} ah, ${W.grantorMother} ${mother}, ${W.born} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  const formatAgent = (p) => {
    if (!p) return "";
    const W = G(p?.gender);

    const fullName = safe(p.fullName);
    const nationality = safe(p.nationality) || "Somali";
    const mother = safe(p.motherName);
    const birthPlace = safe(p.birthPlace);
    const birthYear = safe(p.birthYear);
    const address = safe(p.address);
    const docType = safe(p.documentType);
    const docNo = safe(p.documentNumber);
    const phone = safe(p.phone);

    // ✅ agent: hooyadiisna/hooyadeedna + ku dhashay/ku dhalatay
    return `${fullName}, ${nationality} ah, ${W.agentMother} ${mother}, ${W.born} ${birthPlace}, sanadkii ${birthYear}, degan ${address}, lehna ${docType} lambarkiisu yahay ${docNo} ee ku lifaaqan warqadaan, Tell: ${phone}`;
  };

  // Bold names only
  const buildRunsWithBoldNames = (people = [], formatter) => {
    const items = (people || [])
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName) ? fullText.slice(fullName.length) : `, ${fullText}`;
        return { fullName, rest };
      });

    if (items.length === 0) return [];

    if (items.length === 1) {
      return [
        new TextRun({ text: items[0].fullName, bold: true, size: 24, font: "Times New Roman" }),
        new TextRun({ text: items[0].rest, size: 24, font: "Times New Roman" }),
      ];
    }

    const runs = [];
    items.forEach((it, idx) => {
      if (idx > 0) {
        const isLast = idx === items.length - 1;
        runs.push(new TextRun({ text: isLast ? " iyo " : ", ", size: 24, font: "Times New Roman" }));
      }
      runs.push(new TextRun({ text: it.fullName, bold: true, size: 24, font: "Times New Roman" }));
      runs.push(new TextRun({ text: it.rest, size: 24, font: "Times New Roman" }));
    });

    return runs;
  };

  // ================= WAKAALAD DETAILS (service) =================
  const wakaalad = service || {};

  const nooca = safe(wakaalad.Nooca); // "Dhul Banaan" | "Guri Dhisan"
  const kuYaalloDegmo = safe(wakaalad?.kuYaallo?.degmo);
  const kuYaalloGobol = safe(wakaalad?.kuYaallo?.gobol);

  const cabirkaEnum = safe(wakaalad.cabirka); // "Boos" | "Nus Boos" | "Boosas"
  const tiradaBoosaska = wakaalad.tiradaBoosaska;
  const cabirFaahfaahin = safe(wakaalad.cabirFaahfaahin); // "20x20"
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

      const repPart = cadeyn ? `${cadeyn}` : "";
      const trPart = trDate ? `, Tr. ${trDate}` : "";
      const kasooPart = kasooBaxday ? `, kana soo baxday ${kasooBaxday}` : "";
      const saxiixPart = kuSaxiixan ? `, kuna saxiixan yahay ${kuSaxiixan}` : "";

      return `${repPart}${trPart}${kasooPart}${saxiixPart}`.trim();
    }

    if (kuMilkiyay === "Sabarloog") {
      const sabNo = safe(wakaalad?.sabarloog?.sabarloogNo);
      const bol1 = safe(wakaalad?.sabarloog?.bollettarioNo1);
      const bol2 = safe(wakaalad?.sabarloog?.bollettarioNo2);
      const rLam = safe(wakaalad?.sabarloog?.rasiidNambar);
      const rTar = wakaalad?.sabarloog?.rasiidTaariikh ? formatDate(wakaalad.sabarloog.rasiidTaariikh) : "";
      const dHoose = safe(wakaalad?.sabarloog?.dHooseEe);

      const parts = [];
      if (sabNo) parts.push(`Sabarloog No. ${sabNo}`);
      if (bol1) parts.push(`Bollettario No. ${bol1}`);
      if (bol2) parts.push(`Bollettario No. ${bol2}`);
      if (rLam) parts.push(`Rasiid No. ${rLam}`);
      if (rTar) parts.push(`Taariikh ${rTar}`);
      if (dHoose) parts.push(`D/Hoose ee ${dHoose}`);

      return parts.join(", ");
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

      return parts.join(", ");
    }

    return "";
  };

  const formatCabir = () => {
    if (cabirFaahfaahin) return cabirFaahfaahin;

    if (cabirkaEnum === "Boos") return "Boos";
    if (cabirkaEnum === "Nus Boos") return "Nus Boos";
    if (cabirkaEnum === "Boosas") return tiradaBoosaska ? `${tiradaBoosaska} Boos` : "Boosas";

    return "";
  };

  const propertySentence = () => {
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

    const soohdinText = soohdinParts.length ? `, soohdiintiisu tahay ${soohdinParts.join(", ")}` : "";

    return `${propType}${locPart ? " " + locPart : ""}${cabirPart}${lottoPart}${soohdinText}`.trim();
  };

  const kuMilkiyayText = formatKuMilkiyay();
  const kuMilkiyayPart = kuMilkiyayText ? `, ku milkiyay ${kuMilkiyayText}` : "";

  // ================= TEXTS =================
  const healthText = isPluralGrantor
    ? ", xiskeenuna taam yahay cid nagu qasbeysana aysan jirin wakaaladan, "
    : ", xiskeygana taam yahay cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // ✅ powersText (rag) -> auto female single (karo->karto, uu->ay)
  const rawPowersText = isPluralGrantor
    ? ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo hantidaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale."
    : ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo dhulkaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale.";

  const powersText = toFemaleSingleGrantorText(rawPowersText, grantorGender, isPluralGrantor);

  // ================= SIGNATURES + WITNESSES + NOTARY =================
  const signatureLine = "______________________________";

  const leftTitle = singleOrPlural(
    grantors.length,
    `SAXIIXA ${maleFemale(grantorGender, "WAKAALAD BIXIYAHA", "WAKAALAD BIXISADA")}`,
    "SAXIIXA WAKAALAD BIXIYAASHA"
  );

  const rightTitle = singleOrPlural(
    agents.length,
    `SAXIIXA ${maleFemale(agentGender, "LA WAKIISHA", "LA WAKIISHADA")}`,
    "SAXIIXA WAKIILLADA"
  );

  const buildSignatureChildren = (title, people = []) => {
    const children = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: title, bold: true, size: 24, underline: {}, font: "Times New Roman" })],
      }),
    ];

    (people || [])
      .filter(Boolean)
      .forEach((p, idx) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: safe(p?.fullName).toUpperCase(), bold: true, size: 24, font: "Times New Roman" })],
          })
        );

        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: idx === people.length - 1 ? 0 : 140 },
            children: [new TextRun({ text: signatureLine, size: 24, font: "Times New Roman" })],
          })
        );
      });

    return children;
  };

  const hiddenBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const witnessesTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
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

  const witnessNames = (agreement?.witnesses || []).filter(Boolean);

  const witnessesTable =
    witnessNames.length > 0
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
          rows: Array.from({ length: Math.ceil(witnessNames.length / 2) }).map((_, i) => {
            const leftW = witnessNames[i * 2];
            const rightW = witnessNames[i * 2 + 1];

            const cell = (name) =>
              new TableCell({
                borders: hiddenBorders,
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [
                      new TextRun({
                        text: (name || "").toUpperCase(),
                        bold: true,
                        size: 22,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "__________________________", size: 22, font: "Times New Roman" })],
                  }),
                ],
              });

            return new TableRow({
              children: [cell(leftW), cell(rightW)],
            });
          }),
        })
      : null;

  const notarySection = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 200 },
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
          text: "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed, ",
          size: 24,
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text:
            "Nootaayaha Xafiiska Nootaayaha Boqole, waxaan sugayaa in saxiixyada kor ku xusan ay yihiin kuwo run ah oo ku dhacay si xor ah, laguna saxiixay horteyda, waana sugitaan ansax ah oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka.",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "NOOTAAYAHA", bold: true, size: 24, font: "Times New Roman" })],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: "Dr. Maxamed Cabdiraxmaan Sheekh Maxamed", bold: true, size: 24, font: "Times New Roman" })],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "__________________________", size: 22, font: "Times New Roman" })],
    }),
  ];

  // ================= RETURN =================
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 200 },
      children: [
        new TextRun({
          text: "UJEEDO: WAKAALAD GAAR AH",
          bold: true,
          underline: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Maanta oo ay taariikhdu tahay ${formatDate(agreement?.agreementDate)}, ${
            isPluralGrantor ? "anagoo kala ah " : "anigoo ah "
          }`,
          size: 24,
          font: "Times New Roman",
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24, font: "Times New Roman" }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({ text: `, ${propertySentence()}${kuMilkiyayPart}`, size: 24, font: "Times New Roman" }),

        new TextRun({ text: powersText, size: 24, font: "Times New Roman" }),
      ],
    }),

    new Table({
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
              children: buildSignatureChildren(leftTitle, grantors),
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: hiddenBorders,
              children: buildSignatureChildren(rightTitle, agents),
            }),
          ],
        }),
      ],
    }),

    ...(witnessesTable ? [witnessesTitle, witnessesTable] : []),
    ...notarySection,
  ];
};