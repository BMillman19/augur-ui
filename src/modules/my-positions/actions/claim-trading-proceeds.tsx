import { each } from "async";
import { augur } from "services/augurjs";
import { updateAssets } from "modules/auth/actions/update-assets";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import cancelOpenOrdersInClosedMarkets from "modules/user-open-orders/actions/cancel-open-orders-in-closed-markets";
import selectWinningPositions from "modules/my-positions/selectors/winning-positions";
import noop from "utils/noop";
import logError from "utils/log-error";
const claimTradingProceeds = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const winningPositions = selectWinningPositions();
  const markets =
    !marketIds || marketIds.length === 0
      ? winningPositions.map(winningPosition => winningPosition.id)
      : marketIds;
  if (markets.length > 0) {
    augur.trading.claimMarketsTradingProceeds({
      meta: loginAccount.meta,
      markets,
      _shareHolder: loginAccount.address,
      onSent: noop,
      onSuccess: claimedMarkets => {
        dispatch(updateAssets());
        each(
          claimedMarkets,
          (marketID, nextMarketID) => {
            dispatch(loadMarketsInfo([marketID], nextMarketID));
          },
          err => callback(err)
        );
      },
      onFailed: err => callback(err)
    });
  }
  // has claimed proceeds on all finalized markets so close open orders
  if (!marketIds) {
    dispatch(cancelOpenOrdersInClosedMarkets());
  }
};
export default claimTradingProceeds;
