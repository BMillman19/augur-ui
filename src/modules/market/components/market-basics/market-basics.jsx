/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketOutcomesBinaryScalar from 'modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar'
import MarketOutcomesCategorical from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical'
import MarketLink from 'modules/market/components/market-link/market-link'

import toggleTag from 'modules/routes/helpers/toggle-tag'
import { formatDate } from 'utils/format-date'
import { BINARY, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-basics/market-basics.styles'
import SingleSlicePieGraph from 'src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph'
import TimeRemainingIndicatorWrapper from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'
import { constants } from 'services/augurjs'
import moment from 'moment'

const MarketBasics = (p) => {
  let ReportEndingIndicator = () => null
  if ((p.reportingState === constants.REPORTING_STATE.DESIGNATED_REPORTING || p.reportingState === constants.REPORTING_STATE.OPEN_REPORTING) && !p.hideReportEndingIndicator) {
    const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph)
    const endDate = moment(p.endDate.value).add(constants.CONTRACT_INTERVAL.DESIGNATED_REPORTING_DURATION_SECONDS, 'seconds').toDate()
    const displayDate = formatDate(endDate)

    ReportEndingIndicator = () => (
      <div className={Styles.MarketBasics__reportingends}>
        <div>Reporting Ends {displayDate.formattedShort}</div>
        <WrappedGraph startDate={p.endDate.value} endDate={endDate} currentTimestamp={p.currentTimestamp} />
      </div>
    )
  }

  return (
    <article className={Styles.MarketBasics}>
      <div
        className={classNames(CommonStyles.MarketCommon__topcontent, { [`${CommonStyles['single-card']}`]: p.cardStyle === 'single-card' })}
      >
        <div className={Styles.MarketBasics__header}>
          <ul className={Styles.MarketBasics__tags}>
            {p.tags && p.tags.length > 1 &&
            <li>Tags</li>
            }
            {(p.tags || []).map((tag, i) => i !== 0 &&
              <li key={i}>
                <button onClick={() => toggleTag(tag, p.location, p.history)}>
                  {tag}
                </button>
              </li>)}
          </ul>
          {p.disputeRound != null &&
            <div className={Styles['MarketBasics__round-number']}>
              <span className={Styles['MarketBasics__round-label']}>Dispute Round</span>
              <span className={Styles['MarketBasics__round-text']}>{ p.market && p.market.disputeInfo &&
                p.market.disputeInfo.disputeRound
              }
              </span>
            </div>
          }
          <ReportEndingIndicator />
        </div>
        <h1 className={CommonStyles.MarketCommon__description}>
          <MarketLink
            id={p.id}
            formattedDescription={p.formattedDescription}
          >
            {p.description}
          </MarketLink>
        </h1>

        {(p.marketType === BINARY || p.marketType === SCALAR) &&
          <MarketOutcomesBinaryScalar outcomes={p.outcomes} min={p.minPrice} max={p.maxPrice} type={p.marketType} scalarDenomination={p.scalarDenomination} />
        }

        {p.marketType === CATEGORICAL &&
          <MarketOutcomesCategorical outcomes={p.outcomes} />
        }
      </div>
    </article>
  )
}

MarketBasics.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func,
  currentTimestamp: PropTypes.number.isRequired,
  hideReportEndingIndicator: PropTypes.bool,
}

export default MarketBasics
