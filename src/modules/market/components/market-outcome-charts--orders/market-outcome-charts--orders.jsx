import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.any,
    hoveredPrice: PropTypes.any,
    marketMidpoint: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOrderIndex: null,
      hoveredSide: null,
    }
  }

  componentDidMount() {
    this.asks.scrollTo(0, (this.asks.scrollHeight || 0))
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeOrderBook}>
        <div
          ref={(asks) => { this.asks = asks }}
          className={Styles.MarketOutcomeOrderBook__Side}
        >
          {(p.orderBook.asks || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === p.orderBook.asks.length - 1,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === ASKS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === ASKS && i > s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                p.updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: ASKS,
                })
              }}
              onMouseLeave={() => {
                p.updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.price.value.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.shares.value.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.cumulativeShares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
            </div>
          ))}
        </div>
        <span className={Styles.MarketOutcomeOrderBook__Midmarket}>
          {p.marketMidpoint === null ?
            'No Orders' :
            `${p.marketMidpoint.toFixed(p.fixedPrecision).toString()} ETH`
          }
        </span>
        <div className={Styles.MarketOutcomeOrderBook__Side} >
          {(p.orderBook.bids || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === 0,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === BIDS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === BIDS && i < s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                p.updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: BIDS,
                })
              }}
              onMouseLeave={() => {
                p.updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.price.value.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.shares.value.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.cumulativeShares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
