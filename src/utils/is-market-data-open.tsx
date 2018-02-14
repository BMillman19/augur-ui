export function isMarketDataOpen(marketData) {
  return marketData.consensus === null;
}
export function isMarketDataExpired(marketData, currentTime) {
  if (!marketData || !marketData.endDate || !currentTime) {
    return false;
  }
  return marketData.endDate < parseInt(currentTime / 1000, 10);
}
export function isMarketDataPreviousReportPeriod(
  marketData,
  currentPeriod,
  reportingPeriodDurationInSeconds
) {
  return (
    parseInt(marketData.endDate, 10) <=
    (currentPeriod - 2) * reportingPeriodDurationInSeconds
  );
}
