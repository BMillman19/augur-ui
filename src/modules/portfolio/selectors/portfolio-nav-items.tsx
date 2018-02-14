import selectMyPositionsSummary from "modules/my-positions/selectors/my-positions-summary";
import selectMyMarketsSummary from "modules/my-markets/selectors/my-markets-summary";
import selectMyReportsSummary from "modules/my-reports/selectors/my-reports-summary";
import {
  MY_POSITIONS,
  MY_MARKETS,
  MY_REPORTS
} from "modules/routes/constants/views";
import {
  formatNumber,
  formatEtherTokens,
  formatRep
} from "utils/format-number";
export default function() {
  return selectPortfolioNavItems();
}
export const selectPortfolioNavItems = () => {
  const positionsSummary = selectMyPositionsSummary();
  const marketsSummary = selectMyMarketsSummary();
  const reportsSummary = selectMyReportsSummary();
  return [
    {
      label: "Positions",
      view: MY_POSITIONS,
      leadingTitle: "Total Number of Positions",
      leadingValue: (positionsSummary && positionsSummary.numPositions) || 0,
      leadingValueNull: "No Positions",
      trailingTitle: "Total Profit/Loss",
      trailingValue: (positionsSummary && positionsSummary.totalNet) || 0,
      trailingValueNull: "No Profit/Loss"
    },
    {
      label: "Markets",
      view: MY_MARKETS,
      leadingTitle: "Total Markets",
      leadingValue: formatNumber(
        (marketsSummary && marketsSummary.numMarkets) || 0,
        { denomination: "Markets" }
      ),
      leadingValueNull: "No Markets",
      trailingTitle: "Total Gain/Loss",
      trailingValue: formatEtherTokens(
        (marketsSummary && marketsSummary.totalValue) || 0
      ),
      trailingValueNull: "No Gain/Loss"
    },
    {
      label: "Reports",
      view: MY_REPORTS,
      leadingTitle: "Total Reports",
      leadingValue: formatNumber(reportsSummary && reportsSummary.numReports, {
        denomination: "Reports"
      }),
      leadingValueNull: "No Reports",
      trailingTitle: "Total Gain/Loss",
      trailingValue: formatRep(reportsSummary && reportsSummary.netRep),
      trailingValueNull: "No Gain/Loss"
    }
  ];
};
