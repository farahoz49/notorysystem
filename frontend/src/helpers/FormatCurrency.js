 export const formatCurrency = (amount) => {
      if (amount === null || amount === undefined) return "";

      return Number(amount).toLocaleString("en-US");
    };