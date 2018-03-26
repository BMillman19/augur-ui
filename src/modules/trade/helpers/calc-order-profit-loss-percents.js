import BigNumber from 'bignumber.js'
import { BUY } from 'modules/transactions/constants/types'
import { SCALAR } from 'modules/markets/constants/market-types'

BigNumber.config({ ERRORS: false })

/**
 *
 * @param numShares number of shares the user wants to buy or sell
 * @param limitPrice maximum price for purchases or minimum price for sales the user wants to purchase or sell at
 * @param side BUY or SELL; whether or not the user wishes to buy or sell shares
 * @param minPrice only relevant for scalar markets; all other markets min is created and set to 0
 * @param maxPrice only relevant for scalar markets; all other markets max is created and set to 1
 * @param type the market type
 * @returns object with the following properties
 *    potentialEthProfit:     number, maximum number of ether that can be made according to the current numShares and limit price
 *    potentialEthLoss:       number, maximum number of ether that can be lost according to the current numShares and limit price
 *    potentialProfitPercent: number, the maximum percentage profit that can be earned with current numShares and limit price,
 *                                    excluding first 100% (so a 2x is a 100% return and not a 200% return). For BUYs, loss is always 100% (exc. fees)
 *    potentialLossPercent:   number, the max percentage loss that can be lost with current numShares and limit price; for SELLs loss is always 100%
 */

export default function (numShares, limitPrice, side, minPrice, maxPrice, type, sharesFilled, tradeTotalCost) {
  if (!numShares || !sharesFilled || !side|| !type || (!limitPrice && tradeTotalCost == null)) return null
  let calculatedShares = numShares
  let calculatedPrice = limitPrice
  if (!limitPrice && tradeTotalCost) {
    // market order
    calculatedPrice = new BigNumber(tradeTotalCost, 10).dividedBy(sharesFilled).toFixed()
    calculatedShares = sharesFilled
  }
  if (type === SCALAR && (isNaN(minPrice) || isNaN(maxPrice))) return null
  const max = new BigNumber(type === SCALAR ? maxPrice : 1)
  const min = new BigNumber(type === SCALAR ? minPrice : 0)
  const limit = new BigNumber(calculatedPrice, 10)
  const totalCost = type === SCALAR ? min.minus(limit).abs().times(calculatedShares) : limit.times(calculatedShares)

  const potentialEthProfit = side === BUY ?
    new BigNumber(max.minus(limit).abs(), 10).times(calculatedShares) :
    new BigNumber(limit.minus(min).abs(), 10).times(calculatedShares)

  const potentialEthLoss = side === BUY ?
    new BigNumber(limit.minus(min).abs(), 10).times(calculatedShares) :
    new BigNumber(max.minus(limit).abs(), 10).times(calculatedShares)

  const potentialProfitPercent = potentialEthProfit.dividedBy(totalCost).times(100)
  const potentialLossPercent = potentialEthLoss.dividedBy(totalCost).times(100)

  return {
    potentialEthProfit,
    potentialEthLoss,
    potentialProfitPercent,
    potentialLossPercent,
  }
}
