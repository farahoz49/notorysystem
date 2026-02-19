export const timeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 5) return "Hadda";

  const intervals = [
    { label: "sano", seconds: 31536000 },
    { label: "bil", seconds: 2592000 },
    { label: "maalin", seconds: 86400 },
    { label: "saac", seconds: 3600 },
    { label: "daqiiqo", seconds: 60 },
    { label: "ilbiriqsi", seconds: 1 },
  ];

  for (let i of intervals) {
    const count = Math.floor(diffInSeconds / i.seconds);
    if (count > 0) {
      return `${count} ${i.label} kahor`;
    }
  }

  return "Hadda";
};
