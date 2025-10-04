// Helper date calculations
const today = new Date();

export const maxDOB = new Date(
  today.getFullYear() - 21,
  today.getMonth(),
  today.getDate()
); // 21 years ago
export const minDOB = new Date(
  today.getFullYear() - 55,
  today.getMonth(),
  today.getDate()
); // 55 years ago
