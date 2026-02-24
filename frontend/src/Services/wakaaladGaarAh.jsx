// src/docTemplates/wakaaladGaarAh.js
import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * ✅ WAKAALAD GAAR AH (Dhul Banaan / Guri Dhisan) - gooni ah
 * - Multi grantors + multi agents
 * - Names bold only
 * - Property details: nooca, ku yaallo, cabir, lotto, soohdin, ku milkiyay (Aato/Sabarloog/Maxkamad)
 * - Hal paragraph dheer (sida code-kaaga)
 */
export const buildWakaaladGaarAhDoc = ({ agreement, service, formatDate }) => {
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
    const items = (people || [])
      .filter(Boolean)
      .map((p) => {
        const fullName = safe(p.fullName);
        const fullText = formatter(p); // starts with FullName
        const rest = fullText.startsWith(fullName)
          ? fullText.slice(fullName.length)
          : `, ${fullText}`;
        return { fullName, rest };
      });

    if (items.length === 0) return [];

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

    const soohdinText = soohdinParts.length
      ? `, soohdiintiisu tahay ${soohdinParts.join(", ")}`
      : "";

    // spacing clean
    return `${propType}${locPart ? " " + locPart : ""}${cabirPart}${lottoPart}${soohdinText}`.trim();
  };

  // ================= PEOPLE =================
  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;

  const healthText = isPluralGrantor
    ? ", xiskeenuna taam yahay cid nagu qasbeysana aysan jirin wakaaladan, "
    : ", xiskeygana taam yahay cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  const powersText = isPluralGrantor
    ? ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo hantidaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale."
    : ", in uu gedi karo, u dacwoon karo, dhisi karo, haddii loo baahdana qareen u qaban karo dhulkaas oo ilaa hadda ka madax banaan rahan ama sheegasho cid kale.";

  const kuMilkiyayText = formatKuMilkiyay();
  const kuMilkiyayPart = kuMilkiyayText ? `, ku milkiyay ${kuMilkiyayText}` : "";

  // ================= RETURN =================
  return [
     // TITLE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
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
          text: `Maanta oo ay taariikhdu tahay ${formatDate(
            agreement.agreementDate
          )}, ${isPluralGrantor ? "anagoo kala ah " : "anigoo ah "}`,
          size: 24,
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24 }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({
          text: `, ${propertySentence()}${kuMilkiyayPart}`,
          size: 24,
        }),

        new TextRun({ text: powersText, size: 24 }),
      ],
    }),
  ];
};