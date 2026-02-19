const numberToSomaliWords = (input) => {
  if (input === null || input === undefined) return "";

  const clean = String(input).replace(/,/g, "").trim();
  if (!clean) return "";

  const parts = clean.split(".");
  const integerPart = Number(parts[0]);
  const decimalPart = parts[1];

  if (isNaN(integerPart)) return "";

  const units = [
    "", "Hal", "Labo", "Saddex", "Afar",
    "Shan", "Lix", "Todobo", "Sideed", "Sagaal"
  ];

  const tens = [
    "", "Toban", "Labaatan", "Soddon", "Afartan",
    "Konton", "Lixdan", "Todobaatan", "Sideetan", "Sagaashan"
  ];

  const small = (n) => {
    if (n < 10) return units[n];

    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      return u ? `${tens[t]} iyo ${units[u]}` : tens[t];
    }

    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      const hWord = `${units[h]} Boqol`;
      return r ? `${hWord} iyo ${small(r)}` : hWord;
    }

    return "";
  };

  const big = (n) => {
    if (n < 1000) return small(n);

    if (n < 1_000_000) {
      const th = Math.floor(n / 1000);
      const r = n % 1000;
      const thWord = `${small(th)} Kun`;
      return r ? `${thWord} iyo ${big(r)}` : thWord;
    }

    if (n < 1_000_000_000) {
      const mil = Math.floor(n / 1_000_000);
      const r = n % 1_000_000;
      const milWord = `${big(mil)} Milyan`;
      return r ? `${milWord} iyo ${big(r)}` : milWord;
    }

    if (n < 1_000_000_000_000) {
      const bil = Math.floor(n / 1_000_000_000);
      const r = n % 1_000_000_000;
      const bilWord = `${big(bil)} Bilyan`;
      return r ? `${bilWord} iyo ${big(r)}` : bilWord;
    }

    if (n < 1_000_000_000_000_000) {
      const tri = Math.floor(n / 1_000_000_000_000);
      const r = n % 1_000_000_000_000;
      const triWord = `${big(tri)} Tiriliyan`;
      return r ? `${triWord} iyo ${big(r)}` : triWord;
    }

    return n.toString();
  };

  let result = big(integerPart);

  // ✅ Handle decimal
  if (decimalPart) {
    const decimalWords = decimalPart
      .split("")
      .map((d) => units[Number(d)])
      .join(" ");
    result += ` dhibic ${decimalWords}`;
  }

  return `${result}`;
};


 export const formatDate = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };
   export const formatCurrency = (amount) => {
      if (amount === null || amount === undefined) return "";

      return Number(amount).toLocaleString("en-US");
    };

export default numberToSomaliWords;
