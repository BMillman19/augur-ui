/* eslint react/no-array-index-key: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { SCALAR, YES_NO } from "modules/markets/constants/market-types";

import Styles from "modules/market/components/core-properties/core-properties.styles.less";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.less";

import getValue from "utils/get-value";
import { dateHasPassed } from "utils/format-date";
import { constants } from "services/augurjs";
import { Hint } from "modules/common/components/icons";

const Property = p => (
  <div
    className={classNames(Styles.CoreProperties__property, {
      [Styles.CoreProperties__propertySmall]: p.numRow !== 0
    })}
  >
    <span className={Styles[`CoreProperties__property-name`]}>
      <div>{p.property.name}</div>
      {p.property.tooltip && (
        <div>
          <label
            className={classNames(
              TooltipStyles.TooltipHint,
              Styles["CoreProperties__property-tooltip"]
            )}
            data-tip
            data-for="tooltip--market-fees"
          >
            {Hint}
          </label>
          <ReactTooltip
            id="tooltip--market-fees"
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="bottom"
            type="light"
          >
            <h4>Trading Settlement Fee</h4>
            <p>
              The trading settlement fee is a combination of the Market Creator
              Fee (<b>{p.property.marketCreatorFee}</b>) and the Reporting Fee (
              <b>{p.property.reportingFee}</b>)
            </p>
          </ReactTooltip>
        </div>
      )}
    </span>
    <span style={p.property.textStyle}>{p.property.value}</span>
  </div>
);

export default class CoreProperties extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired
  };

  determinePhase() {
    const { reportingState } = this.props.market;
    switch (reportingState) {
      case constants.REPORTING_STATE.PRE_REPORTING:
        return "Open";

      case constants.REPORTING_STATE.DESIGNATED_REPORTING:
      case constants.REPORTING_STATE.OPEN_REPORTING:
      case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
      case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
        return "Reporting";

      case constants.REPORTING_STATE.AWAITING_FINALIZATION:
      case constants.REPORTING_STATE.FINALIZED:
        return "Resolved";

      case constants.REPORTING_STATE.FORKING:
        return "Forking";

      case constants.REPORTING_STATE.AWAITING_NO_REPORT_MIGRATION:
        return "Awaiting No Report Migrated";

      case constants.REPORTING_STATE.AWAITING_FORK_MIGRATION:
        return "Awaiting Fork Migration";

      default:
        return "";
    }
  }

  render() {
    const { market, currentTimestamp } = this.props;

    const marketCreatorFee = getValue(
      market,
      "marketCreatorFeeRatePercent.full"
    );
    const reportingFee = getValue(market, "reportingFeeRatePercent.full");

    const isScalar = market.marketType === SCALAR;
    const consensus = getValue(
      market,
      isScalar ? "consensus.winningOutcome" : "consensus.outcomeName"
    );

    const propertyRows = [
      [
        {
          name: "volume",
          value: getValue(market, "volume.full")
        },
        {
          name: "fee",
          value: getValue(market, "settlementFeePercent.full"),
          tooltip: true,
          marketCreatorFee,
          reportingFee
        },
        {
          name: "phase",
          value: this.determinePhase()
        }
      ],
      [
        {
          name: "created",
          value: getValue(market, "creationTime.formattedLocal")
        },
        {
          name: "type",
          value:
            getValue(market, "marketType") === YES_NO
              ? "Yes/No"
              : getValue(market, "marketType")
        },
        {
          name: "min",
          value:
            market.marketType === SCALAR
              ? getValue(market, "minPrice").toString()
              : null
        }
      ],
      [
        {
          name: dateHasPassed(
            currentTimestamp,
            getValue(market, "endTime.timestamp")
          )
            ? "expired"
            : "expires",
          value: getValue(market, "endTime.formattedLocal")
        },
        {
          name: "denominated in",
          value: getValue(market, "scalarDenomination"),
          textStyle: { textTransform: "none" }
        },
        {
          name: "max",
          value:
            market.marketType === SCALAR
              ? getValue(market, "maxPrice").toString()
              : null
        }
      ]
    ];

    const renderedProperties = [];
    propertyRows.forEach((propertyRow, numRow) => {
      const row = [];
      propertyRow.forEach((property, numCol) => {
        if (property.value) {
          row.push(
            <Property
              key={"property" + numRow + numCol}
              property={property}
              numRow={numRow}
            />
          );
        }
      });
      renderedProperties.push(
        <div key={"row" + numRow} className={Styles.CoreProperties__row}>
          {" "}
          {row}
        </div>
      );
      if (numRow === 0) {
        renderedProperties.push(
          <div
            key={"linebreak" + numRow}
            className={Styles.CoreProperties__lineBreak}
          />
        );
      }
    });

    return (
      <div className={Styles.CoreProperties__coreContainer}>
        {consensus && (
          <div className={Styles.CoreProperties__row}>
            <div className={Styles.CoreProperties__property}>
              <span className={Styles[`CoreProperties__property-name`]}>
                <div>Winning Outcome:</div>
              </span>
              <span
                className={Styles[`CoreProperties__property-winningOutcome`]}
              >
                {consensus}
              </span>
            </div>
          </div>
        )}
        {consensus && <div className={Styles.CoreProperties__lineBreak} />}
        {renderedProperties}
      </div>
    );
  }
}
