import { connect } from "react-redux";
import memoize from "memoizee";

import { selectCurrentTimestamp, selectOrphanOrders } from "src/select-state";
import Positions from "modules/portfolio/components/positions/positions";
import getLoginAccountPositions from "modules/my-positions/selectors/login-account-positions";
import getOpenOrders from "modules/user-open-orders/selectors/open-orders";
import { loadAccountTrades } from "modules/my-positions/actions/load-account-trades";
import { triggerTransactionsExport } from "modules/transactions/actions/trigger-transactions-export";
import claimTradingProceeds from "modules/my-positions/actions/claim-trading-proceeds";
import { constants } from "services/augurjs";
import { orderBy } from "lodash";
import { selectMarket } from "modules/market/selectors/market";
import { loadDisputing } from "modules/reporting/actions/load-disputing";

const mapStateToProps = state => {
  const positions = getLoginAccountPositions();
  const openOrders = getOpenOrders();
  const orphanedOrders = selectOrphanOrders(state);
  const orphanedMarkets = [];
  for (let i = 0; i < orphanedOrders.length; i++) {
    orphanedMarkets.push(selectMarket(orphanedOrders[i].marketId));
  }
  const reportingStates = constants.REPORTING_STATE;
  const openPositionMarkets = [];
  const reportingMarkets = [];
  const closedMarkets = [];
  // NOTE: for data wiring, this should probably be just done as calls for getting openPosition Markets, getting Reporting Markets, and getting Closed Markets respectively from the node and just passed the expected keys below
  const markets = getPositionsMarkets(positions, openOrders, orphanedMarkets);
  // TODO -- getting each section of markets should be it's own call
  const marketsCount = markets.length;
  markets.forEach(market => {
    if (
      market.reportingState === reportingStates.FINALIZED ||
      market.reportingState === reportingStates.AWAITING_FINALIZATION
    ) {
      closedMarkets.push(market);
    } else if (market.reportingState !== reportingStates.PRE_REPORTING) {
      reportingMarkets.push(market);
    } else {
      openPositionMarkets.push(market);
    }
  });

  const orderdClosedMarkets = orderBy(
    closedMarkets,
    ["endTime.timestamp"],
    ["desc"]
  );

  return {
    currentTimestamp: selectCurrentTimestamp(state),
    marketsCount,
    openPositionMarkets,
    reportingMarkets,
    closedMarkets: orderdClosedMarkets,
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded:
      state.transactionsOldestLoadedBlock ===
      state.loginAccount.registerBlockNumber,
    registerBlockNumber: state.loginAccount.registerBlockNumber,
    isMobile: state.isMobile
  };
};

const mapDispatchToProps = dispatch => ({
  loadAccountTrades: () => dispatch(loadAccountTrades()),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
  claimTradingProceeds: marketIds => dispatch(claimTradingProceeds(marketIds)),
  loadDisputing: () => dispatch(loadDisputing()),
});

const getPositionsMarkets = memoize(
  (positions, openOrders, orphanedMarkets) =>
    Array.from(
      new Set([...positions.markets, ...openOrders, ...orphanedMarkets])
    ),
  { max: 1 }
);

const PositionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Positions);

export default PositionsContainer;
