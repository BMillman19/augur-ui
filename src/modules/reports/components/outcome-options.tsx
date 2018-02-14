import React from "react";
import classNames from "classnames";
import {
  BINARY,
  CATEGORICAL,
  SCALAR
} from "modules/markets/constants/market-types";
import {
  BINARY_INDETERMINATE_OUTCOME_ID,
  CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID
} from "modules/markets/constants/market-outcomes";
type OutcomeOptionsProps = {
  className?: string,
  type?: string,
  reportableOutcomes?: any[],
  reportedOutcomeID?: string,
  isReported?: boolean,
  isIndeterminate?: boolean,
  onOutcomeChange?: (...args: any[]) => any
};
const OutcomeOptions: React.SFC<OutcomeOptionsProps> = p => (
  <article className="outcome-options">
    {p.type === SCALAR && (
      <div className="reportable-outcomes">
        <label
          key="scalar-outcome"
          className="outcome-option"
          htmlFor="outcome-scalar-input"
        >
          <input
            type="text"
            className="outcome-option-input"
            name="outcome-scalar-input"
            value={p.reportedOutcomeID}
            disabled={p.isReported || p.isIndeterminate}
            onChange={p.onOutcomeChange}
          />
        </label>
      </div>
    )}
    {p.type !== SCALAR && (
      <div className="reportable-outcomes">
        {(p.reportableOutcomes || []).map(outcome => (
          <span key={outcome.id}>
            {((p.type === BINARY &&
              outcome.id !== BINARY_INDETERMINATE_OUTCOME_ID) ||
              (p.type === CATEGORICAL &&
                outcome.id !==
                  CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID)) && (
              <label
                className={classNames("outcome-option", {
                  disabled: p.isReported || p.isIndeterminate
                })}
                htmlFor="outcome-option-radio"
              >
                <input
                  type="radio"
                  className="outcome-option-radio"
                  name="outcome-option-radio"
                  value={outcome.id}
                  checked={p.reportedOutcomeID === outcome.id}
                  disabled={p.isReported || p.isIndeterminate}
                  onChange={p.onOutcomeChange}
                />
                {outcome.name}
              </label>
            )}
          </span>
        ))}
      </div>
    )}
  </article>
);
export default OutcomeOptions;
