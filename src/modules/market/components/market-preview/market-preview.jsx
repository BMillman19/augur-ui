import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketBasics from "modules/market/containers/market-basics";
import MarketProperties from "modules/market/containers/market-properties";
import OutstandingReturns from "modules/market/components/market-outstanding-returns/market-outstanding-returns";
import MarketLiquidity from "modules/market/containers/market-liquidity";

import CommonStyles from "modules/market/components/common/market-common.styles.less";
import Styles from "modules/market/components/market-preview/market-preview.styles.less";

const MarketPreview = p => (
  <article
    className={classNames(CommonStyles.MarketCommon__container, {
      [`${CommonStyles["single-card"]}`]: p.cardStyle === "single-card"
    })}
    id={"id-" + p.id}
    data-testid={p.testid + "-" + p.id}
  >
    <MarketBasics {...p} />
    <div
      className={classNames(Styles.MarketPreview__footer, {
        [`${Styles["single-card"]}`]: p.cardStyle === "single-card"
      })}
    >
      <MarketProperties {...p} />
    </div>
    {p.unclaimedCreatorFees.value > 0 &&
      p.collectMarketCreatorFees && (
        <div
          className={classNames(Styles.MarketPreview__returns, {
            [`${Styles["single-card"]}`]: p.cardStyle === "single-card"
          })}
        >
          <OutstandingReturns
            id={p.id}
            unclaimedCreatorFees={p.unclaimedCreatorFees}
            collectMarketCreatorFees={p.collectMarketCreatorFees}
          />
        </div>
      )}
    <MarketLiquidity
      marketId={p.id}
      market={p}
      pendingLiquidityOrders={p.pendingLiquidityOrders}
    />
  </article>
);

MarketPreview.propTypes = {
  testid: PropTypes.string,
  id: PropTypes.string,
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func,
  className: PropTypes.string,
  description: PropTypes.string,
  outcomes: PropTypes.array,
  isOpen: PropTypes.bool,
  isFavorite: PropTypes.bool,
  isPendingReport: PropTypes.bool,
  endTime: PropTypes.object,
  settlementFeePercent: PropTypes.object,
  volume: PropTypes.object,
  tags: PropTypes.array,
  onClickToggleFavorite: PropTypes.func,
  cardStyle: PropTypes.string,
  hideReportEndingIndicator: PropTypes.bool,
  linkType: PropTypes.string,
  collectMarketCreatorFees: PropTypes.func
};

export default MarketPreview;
