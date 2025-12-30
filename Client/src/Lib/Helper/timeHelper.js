// utils/timeHelpers.js
export const getLatestEntry = (timeData) => {
  const history = timeData?.data?.history;
  if (!history || !Array.isArray(history) || history.length === 0) {
    return null;
  }
  // Assuming history is chronological (newest at the end)
  return history[history.length - 1];
};

export const getLatestQuote = (timeData) => {
  return getLatestEntry(timeData)?.quote || "";
};
