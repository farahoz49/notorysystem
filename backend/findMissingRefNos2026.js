import Agreement from "../model/Agreement.js";

export const findMissingRefNos2026 = async () => {
  const year = 2026;

  const docs = await Agreement.find(
    { refNo: { $regex: `/BQL/${year}$` } },
    { refNo: 1, _id: 0 }
  );

  const nums = docs
    .map(d => parseInt(String(d.refNo).split("/")[0], 10))
    .filter(n => Number.isFinite(n))
    .sort((a, b) => a - b);

  const missing = [];
  const min = nums[0] ?? 1;
  const max = nums[nums.length - 1] ?? 0;

  const set = new Set(nums);
  for (let i = min; i <= max; i++) {
    if (!set.has(i)) missing.push(i);
  }

  console.log("Total:", nums.length, "Max:", max);
  console.log("Missing numbers:", missing);
};

findMissingRefNos2026();