import memoize from 'memoizee'
import BigNumber from 'bignumber.js'

import store from 'src/store'

import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import { BUY, SELL } from 'modules/transactions/constants/types'

import { formatNone, formatEtherTokens, formatShares } from 'utils/format-number'
import { cancelOrder } from 'modules/bids-asks/actions/cancel-order'
/**
 * Pulls off existing order book in state
 * @param {String} outcomeId
 * @param {String} marketId
 *
 * @return {Array}
 */
export function selectUserOpenOrders(marketId, outcomeId, marketOrderBook, orderCancellation) {
  const { loginAccount } = store.getState()
  if (!loginAccount.address || marketOrderBook == null) return []

  return userOpenOrders(marketId, outcomeId, loginAccount, marketOrderBook, orderCancellation)
}

/**
 * Orders are sorted: asks then bids. By price in descending order
 *
 * @param {String} outcomeId
 * @param {Object} loginAccount
 * @param {{buy: object, sell: object}} marketOrderBook
 *
 * @return {Array}
 */
const userOpenOrders = memoize((marketId, outcomeId, loginAccount, marketOrderBook, orderCancellation) => {
  const orderData = marketOrderBook[outcomeId]

  const userBids = (orderData == null || orderData.buy == null) ? [] : getUserOpenOrders(marketId, marketOrderBook[outcomeId], BUY, outcomeId, loginAccount.address, orderCancellation)
  const userAsks = (orderData == null || orderData.sell == null) ? [] : getUserOpenOrders(marketId, marketOrderBook[outcomeId], SELL, outcomeId, loginAccount.address, orderCancellation)

  return userAsks.concat(userBids)
}, { max: 10 })

/**
 * Returns user's order for specified outcome sorted by price
 *
 * @param {Object} orders
 * @param {String} orderType
 * @param {String} outcomeId
 * @param {String} userId
 *
 * @return {Array}
 */
function getUserOpenOrders(marketId, orders, orderType, outcomeId, userId, orderCancellation={}) {
  const typeOrders = orders[orderType]
  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userId) && order.orderState === 'OPEN')
    .sort((order1, order2) => new BigNumber(order2.price, 10).comparedTo(new BigNumber(order1.price, 10)))
    .map(order => (
      {
        id: order.orderId,
        type: orderType,
        marketId,
        outcomeId,
        pending: orderCancellation[order.orderId],
        originalShares: formatNone(),
        avgPrice: formatEtherTokens(order.price),
        matchedShares: formatNone(),
        unmatchedShares: formatShares(order.amount),
        cancelOrder: (orderId, marketId, outcome, type) => {
          store.dispatch(cancelOrder(orderId, marketId, outcome, type))
        },
      }
    ))
}
