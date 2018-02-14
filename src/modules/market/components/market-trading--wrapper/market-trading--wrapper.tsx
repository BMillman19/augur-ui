import React, { Component } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import MarketTradingForm from "modules/market/components/market-trading--form/market-trading--form";
import MarketTradingConfirm from "modules/market/components/market-trading--confirm/market-trading--confirm";
import { Close } from "modules/common/components/icons/icons";
import makePath from "modules/routes/helpers/make-path";
import ValueDenomination from "modules/common/components/value-denomination/value-denomination";
import getValue from "utils/get-value";
import { BUY, SELL, LIMIT } from "modules/transactions/constants/types";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import Styles from "modules/market/components/market-trading--wrapper/market-trading--wrapper.styles";
type MarketTradingWrapperProps = {
  market: object,
  isLogged: boolean,
  selectedOutcomes: any[],
  selectedOutcome: object,
  initialMessage: string | boolean,
  availableFunds?: any,
  isMobile: boolean,
  toggleForm: (...args: any[]) => any
};
type MarketTradingWrapperState = {
  currentPage: number,
  currentPage: any,
  [x: number]: any,
  orderEstimate: any,
  orderType: any,
  orderPrice: string,
  orderQuantity: string,
  orderEstimate: string,
  marketOrderTotal: string,
  marketQuantity: string,
  selectedNav: any,
  currentPage: number
};
class MarketTradingWrapper extends Component<
  MarketTradingWrapperProps,
  MarketTradingWrapperState
> {
  constructor(props) {
    super(props);
    this.state = {
      orderType: LIMIT,
      orderPrice: "",
      orderQuantity: "",
      orderEstimate: "",
      marketOrderTotal: "",
      marketQuantity: "8.0219",
      selectedNav: BUY,
      currentPage: 0
    };
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateOrderEstimate = this.updateOrderEstimate.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.orderQuantity !== nextState.orderQuantity ||
      this.state.orderPrice !== nextState.orderPrice
    ) {
      let orderEstimate = "";
      if (
        nextState.orderQuantity instanceof BigNumber &&
        nextState.orderPrice instanceof BigNumber
      ) {
        orderEstimate = `${nextState.orderQuantity
          .times(nextState.orderPrice)
          .toNumber()} ETH`;
      }
      this.updateOrderEstimate(orderEstimate);
    }
  }
  prevPage() {
    const newPage =
      this.state.currentPage <= 0 ? 0 : this.state.currentPage - 1;
    this.setState({ currentPage: newPage });
  }
  nextPage() {
    const newPage =
      this.state.currentPage >= 1 ? 1 : this.state.currentPage + 1;
    this.setState({ currentPage: newPage });
  }
  updateState(property, value) {
    this.setState({ [property]: value });
  }
  updateOrderEstimate(orderEstimate) {
    this.setState({
      orderEstimate
    });
  }
  render() {
    const s = this.state;
    const p = this.props;
    const lastPrice = getValue(p, "selectedOutcome.lastPrice.formatted");
    return (
      <section className={Styles.TradingWrapper}>
        {p.isMobile && (
          <div className={Styles["TradingWrapper__mobile-header"]}>
            <button
              className={Styles["TradingWrapper__mobile-header-close"]}
              onClick={p.toggleForm}
            >
              {Close}
            </button>
            <span className={Styles["TradingWrapper__mobile-header-outcome"]}>
              {p.selectedOutcome.name}
            </span>
            <span className={Styles["TradingWrapper__mobile-header-last"]}>
              <ValueDenomination formatted={lastPrice} />
            </span>
          </div>
        )}
        {s.currentPage === 0 && (
          <div>
            <ul className={Styles.TradingWrapper__header}>
              <li
                className={classNames({
                  [`${Styles.active}`]: s.selectedNav === BUY
                })}
              >
                <button onClick={() => this.setState({ selectedNav: BUY })}>
                  Buy
                </button>
              </li>
              <li
                className={classNames({
                  [`${Styles.active}`]: s.selectedNav === SELL
                })}
              >
                <button onClick={() => this.setState({ selectedNav: SELL })}>
                  Sell
                </button>
              </li>
            </ul>
            {p.initialMessage && (
              <p className={Styles["TradingWrapper__initial-message"]}>
                {p.initialMessage}
              </p>
            )}
            {p.initialMessage &&
              p.isLogged &&
              p.availableFunds.lte(0) && (
                <Link
                  className={Styles["TradingWrapper__button--add-funds"]}
                  to={makePath(ACCOUNT_DEPOSIT)}
                >
                  Add Funds
                </Link>
              )}
            {!p.initialMessage && (
              <MarketTradingForm
                market={p.market}
                marketType={getValue(p, "market.marketType")}
                maxPrice={getValue(p, "market.maxPrice")}
                minPrice={getValue(p, "market.minPrice")}
                availableFunds={p.availableFunds}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEstimate={s.orderEstimate}
                marketOrderTotal={s.marketOrderTotal}
                marketQuantity={s.marketQuantity}
                selectedOutcome={p.selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
                isMobile={p.isMobile}
              />
            )}
          </div>
        )}
        {s.currentPage === 1 && (
          <MarketTradingConfirm
            market={p.market}
            selectedNav={s.selectedNav}
            orderType={s.orderType}
            orderPrice={s.orderPrice}
            orderQuantity={s.orderQuantity}
            orderEstimate={s.orderEstimate}
            marketOrderTotal={s.marketOrderTotal}
            marketQuantity={s.marketQuantity}
            selectedOutcome={p.selectedOutcome}
            prevPage={this.prevPage}
            trade={p.selectedOutcome.trade}
            isMobile={p.isMobile}
          />
        )}
      </section>
    );
  }
}
export default MarketTradingWrapper;
