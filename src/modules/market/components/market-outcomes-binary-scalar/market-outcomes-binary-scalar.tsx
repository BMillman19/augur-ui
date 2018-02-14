import React from "react";
import { BINARY } from "modules/markets/constants/market-types";
import getValue from "utils/get-value";
import Styles from "modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar.styles";
type MarketOutcomesProps = {
  outcomes: any[],
  max?: string,
  min?: string,
  type?: string
};
const MarketOutcomes: React.SFC<MarketOutcomesProps> = p => {
  const calculatePosition = () => {
    const lastPrice = getValue(p.outcomes[0], "lastPricePercent.full");
    if (p.type === BINARY) {
      return lastPrice;
    }
    return `${lastPrice / (p.max - p.min) * 100}%`;
  };
  const currentValuePosition = {
    left: calculatePosition()
  };
  const minValue = p.min && p.type !== BINARY ? p.min : "0%";
  const maxValue = p.min && p.type !== BINARY ? p.max : "100%";
  return (
    <div className={Styles.MarketOutcomes}>
      <div className={Styles.MarketOutcomes__range} />
      <span className={Styles.MarketOutcomes__min}>{minValue}</span>
      <span className={Styles.MarketOutcomes__max}>{maxValue}</span>
      <span
        className={Styles.MarketOutcomes__current}
        style={currentValuePosition}
      >
        <span className={Styles["MarketOutcomes__current-value"]}>
          {getValue(p.outcomes[0], "lastPricePercent.formatted")}
        </span>
        <span className={Styles["MarketOutcomes__current-denomination"]}>
          {getValue(p.outcomes[0], "lastPricePercent.denomination")}
        </span>
      </span>
    </div>
  );
};
export default MarketOutcomes;
