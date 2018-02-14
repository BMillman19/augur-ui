/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same
import React from "react";
import classNames from "classnames";
import MarketOutcomesBinaryScalar from "modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar";
import MarketOutcomesCategorical from "modules/market/components/market-outcomes-categorical/market-outcomes-categorical";
import MarketLink from "modules/market/components/market-link/market-link";
import MarketStatusIcon from "modules/market/components/market-status-icon/market-status-icon";
import toggleTag from "modules/routes/helpers/toggle-tag";
import { BINARY, SCALAR } from "modules/markets/constants/market-types";
import CommonStyles from "modules/market/components/common/market-common.styles";
import Styles from "modules/market/components/market-basics/market-basics.styles";
type MarketBasicsProps = {
  history: object,
  location: object,
  isLogged: boolean,
  toggleFavorite?: (...args: any[]) => any
};
const MarketBasics: React.SFC<MarketBasicsProps> = p => (
  <article>
    <div
      className={classNames(CommonStyles.MarketCommon__topcontent, {
        [`${CommonStyles["single-card"]}`]: p.cardStyle === "single-card"
      })}
    >
      <div className={CommonStyles.MarketCommon__header}>
        <ul className={Styles.MarketBasics__tags}>
          {p.tags.length > 1 && <li>Tags</li>}
          {(p.tags || []).map(
            (tag, i) =>
              i !== 0 && (
                <li key={i}>
                  <button onClick={() => toggleTag(tag, p.location, p.history)}>
                    {tag}
                  </button>
                </li>
              )
          )}
        </ul>
        <MarketStatusIcon isOpen={p.isOpen} isReported={p.isReported} />
      </div>

      <h1 className={CommonStyles.MarketCommon__description}>
        <MarketLink id={p.id} formattedDescription={p.formattedDescription}>
          {p.description}
        </MarketLink>
      </h1>

      {(p.marketType === BINARY || p.marketType === SCALAR) && (
        <MarketOutcomesBinaryScalar
          outcomes={p.outcomes}
          min={p.minValue}
          max={p.maxValue}
          type={p.marketType}
        />
      )}

      {p.marketType === "categorical" && (
        <MarketOutcomesCategorical outcomes={p.outcomes} />
      )}
    </div>
  </article>
);
export default MarketBasics;
