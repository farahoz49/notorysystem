   const months = [
  "Jannaayo",
  "Febraayo",
  "Maarso",
  "Abriil",
  "Maayo",
  "Juuno",
  "Luulyo",
  "Agoosto",
  "Sebteembar",
  "Oktoobar",
  "Nofeembar",
  "Diseembar",
];

export const formatDatewithname = (dateValue) => {
  if (!dateValue) return "";

  const d = new Date(dateValue);

  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
};