// src/docTemplates/wakaaladKale.js
import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * ✅ WAKAALAD KALE (Wakaalad Gaar ah) - gooni ah
 * - Multi grantors + multi agents
 * - Names bold only
 * - Hal paragraph dheer (sida code-kaaga)
 *
 * NOTE:
 * - propertyText halkan waa "service?.propertyText" (ama "service?.details") si aad u qorto waxa gaar ahaan la wakiishanayo.
 * - Haddii aadan rabin, waa empty ahaanayaa.
 */
export const buildWakaaladKaleDoc = ({ agreement, service, formatDate }) => {
  // ================= HELPERS =================
  const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

  // Qofka bixiyaha (grantor)
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

  // Qofka la wakiilanayo (agent)
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
        const fullText = formatter(p);
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

  // ================= DATA =================
  const grantors = agreement?.dhinac1?.sellers || [];
  const agents = agreement?.dhinac2?.buyers || [];

  const isPluralGrantor = grantors.length > 1;
  const introWho = isPluralGrantor ? "anagoo kala ah " : "anigoo ah ";

  const healthText = isPluralGrantor
    ? " kana caafimaad qabaan dhanka maskaxda iyo jirkaba, xiskeenuna taam yahay, cid nagu qasbeysana aysan jirin wakaaladan, "
    : " kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, cid igu qasbeysana aysan jirin wakaaladan, ";

  const statementText = isPluralGrantor
    ? "waxaan qoraalkaan ku caddeynaynaa in aan wakaalad gaar ah u siinay "
    : "waxaan qoraalkaan ku caddeynayaa in aan wakaalad gaar ah u siiyay ";

  // ✅ waxaad ku qoraysaa waxa la wakiishanayo (gaar ahaan)
  // 1) service.propertyText (string)
  // 2) ama service.details (string)
  // 3) haddii waxba jirin -> empty
  const propertyText = safe(service?.propertyText || service?.details);

  const ownershipWord = isPluralGrantor ? "hantideena" : "hantideyda";
  const gaveWord = isPluralGrantor ? "noo" : "ii";

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
          )}, ${introWho}`,
          size: 24,
        }),

        ...buildRunsWithBoldNames(grantors, formatGrantor),

        new TextRun({ text: `${healthText}${statementText}`, size: 24 }),

        ...buildRunsWithBoldNames(agents, formatAgent),

        new TextRun({
          text:
            `, ${propertyText ? propertyText + ", " : ""}` +
            `in uu gadi karo, wareejin karo, hibeyn karo, waqfi karo, xafidi karo, dhisi karo, ijaari karo, ` +
            `rahan dhigi karo kana saari karo, iskuna dammiinan karo, maslaxane ka geli karo una qaadi karo, ` +
            `qareen u qaban karo kuna dacwoon karo, lacagna ka saari karo, uuna leeyahay maamulka ` +
            `${ownershipWord} si la mid ah maamulka sharcigu ${gaveWord} siiyay..`,
          size: 24,
        }),
      ],
    }),
  ];
};