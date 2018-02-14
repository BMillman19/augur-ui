import { augur } from "services/augurjs";
import { updateIsFirstOrderBookChunkLoaded } from "modules/bids-asks/actions/update-order-book";
import insertOrderBookChunkToOrderBook from "modules/bids-asks/actions/insert-order-book-chunk-to-order-book";
import logError from "utils/log-error";
import { has } from "lodash";
const loadOneOutcomeBidsOrAsks = (
  marketID,
  outcome,
  orderTypeLabel,
  callback = logError
) => (dispatch, getState) => {
  const { marketsData } = getState();
  if (marketID == null || outcome == null || orderTypeLabel == null) {
    return callback(
      `must specify market ID, outcome, and order type: ${marketID} ${outcome} ${orderTypeLabel}`
    );
  }
  const market = marketsData[marketID];
  if (!market) return callback(`market ${marketID} data not found`);
  dispatch(
    updateIsFirstOrderBookChunkLoaded(marketID, outcome, orderTypeLabel, false)
  );
  augur.trading.getOrders(
    { marketID, outcome, orderType: orderTypeLabel },
    (err, orders) => {
      if (err) return callback(err);
      if (orders != null) {
        dispatch(
          insertOrderBookChunkToOrderBook(
            marketID,
            outcome,
            orderTypeLabel,
            has(orders, [marketID, outcome, orderTypeLabel])
              ? orders[marketID][outcome][orderTypeLabel]
              : {}
          )
        );
      }
      callback(null);
    }
  );
};
export default loadOneOutcomeBidsOrAsks;
