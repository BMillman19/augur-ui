import React from "react";
import PropTypes from "prop-types";

import { YES_NO } from "modules/markets/constants/market-types";

import getValue from "utils/get-value";
import CustomPropTypes from "utils/custom-prop-types";
import { createBigNumber } from "utils/create-big-number";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-yes-no-scalar/market-outcomes-yes-no-scalar.styles.less";

const MarketOutcomes = p => {
  const scalarDenomination = !p.scalarDenomination ? "" : p.scalarDenomination;
  const calculatePosition = () => {
    const lastPrice =
      getValue(p.outcomes[0], "lastPricePercent.fullPrecision") || 0;

    if (p.type === YES_NO) {
      return lastPrice;
    }

    const range = p.max.minus(p.min);
    return `${createBigNumber(lastPrice)
      .minus(p.min)
      .dividedBy(range)
      .times(createBigNumber(100))}`;
  };

  const currentValuePosition = {
    left: calculatePosition() + "%"
  };

  const minValue =
    !isNaN(p.min) && p.type !== YES_NO
      ? `${p.min} ${scalarDenomination}`
      : "0 %";
  const maxValue =
    !isNaN(p.max) && p.type !== YES_NO
      ? `${p.max} ${scalarDenomination}`
      : "100 %";

  const lastPriceDenomination =
    p.type !== YES_NO
      ? ""
      : getValue(p.outcomes[0], "lastPricePercent.denomination");
  const arrowStyles = {
    left: p.type === YES_NO ? "0.9375rem" : "0.5rem",
    marginLeft: p.type === YES_NO ? "0.625rem" : "0"
  };

  return (
    <div className={Styles.MarketOutcomes}>
      <div className={Styles.MarketOutcomes__range} />
      <span className={Styles.MarketOutcomes__min}>{minValue}</span>
      <span className={Styles.MarketOutcomes__max}>{maxValue}</span>
      <span
        className={Styles.MarketOutcomes__current}
        style={currentValuePosition}
      >
        <span
          className={Styles["MarketOutcomes__current-value"]}
          data-testid="midpoint"
        >
          {getValue(p.outcomes[0], "lastPricePercent.formatted")}
        </span>
        <div style={{ position: "relative", display: "inline" }}>
          <span className={Styles["MarketOutcomes__current-denomination"]}>
            {lastPriceDenomination}
          </span>
          <MarketOutcomeTradingIndicator
            outcome={p.outcomes[0]}
            style={arrowStyles}
          />
        </div>
      </span>
    </div>
  );
};

MarketOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: CustomPropTypes.bigNumber,
  min: CustomPropTypes.bigNumber,
  type: PropTypes.string,
  scalarDenomination: PropTypes.string
};

export default MarketOutcomes;
