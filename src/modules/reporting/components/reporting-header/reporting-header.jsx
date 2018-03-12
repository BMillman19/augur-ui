import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import { getDaysRemaining, convertUnixToFormattedDate } from 'utils/format-date'

import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'
import TooltipStyles from 'modules/common/less/tooltip'
import { MODAL_PARTICIPATE } from 'modules/modal/constants/modal-types'

import { Participate } from 'modules/common/components/icons'

export default class ReportingHeader extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    loadReportingWindowBounds: PropTypes.func.isRequired,
    reportingWindowStats: PropTypes.object.isRequired,
    repBalance: PropTypes.string.isRequired,
    updateModal: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.loadReportingWindowBounds()
  }

  render() {
    const p = this.props

    const totalDays = getDaysRemaining(p.reportingWindowStats.endTime, p.reportingWindowStats.startTime)
    const daysLeft = getDaysRemaining(p.reportingWindowStats.endTime)
    const formattedDate = convertUnixToFormattedDate(p.reportingWindowStats.endTime)
    const currentPercentage = ((totalDays - daysLeft) / totalDays) * 100
    const disableParticipate = (p.repBalance === '0')
    const currentPeriodStyle = {
      width: `${((totalDays - daysLeft) / totalDays) * 100}%`,
    }

    return (
      <article className={Styles.ReportingHeader}>
        <div className={Styles.ReportingHeader__header}>
          <div>
            <h1 className={Styles.ReportingHeader__heading}>Reporting: {p.heading}</h1>
            { p.heading === 'Dispute' &&
              <div className={Styles['ReportingHeader__dispute-wrapper']}>
                <div className={Styles['ReportingHeader__dispute-header']}>
                  <div className={Styles['ReportingHeader__meta-wrapper']}>
                    <span className={Styles.ReportingHeader__endDate}>Dispute Window ends { formattedDate.formattedLocal }</span>
                    <span className={Styles.ReportingHeader__stake}> | </span><span className={Styles.ReportingHeader__stake}>{ p.reportingWindowStats.stake } REP Staked</span>
                  </div>
                  <button
                    className={disableParticipate ? Styles['ReportingHeader__participationTokens--disabled'] : Styles.ReportingHeader__participationTokens}
                    data-tip
                    data-for="tooltip--participation-tokens"
                    disabled={disableParticipate}
                    onClick={() => p.updateModal({
                      type: MODAL_PARTICIPATE,
                      canClose: true,
                    })}
                  >
                    {Participate}
                    <span
                      className={Styles['ReportingHeader__participationTokens--text']}
                    >
                      participate
                    </span>
                  </button>
                  {!p.isMobile &&
                    <ReactTooltip
                      id="tooltip--participation-tokens"
                      className={TooltipStyles.Tooltip}
                      effect="solid"
                      place="left"
                      type="light"
                    >
                      <h4>Don&apos;t see any markets that need to be disputed?</h4>
                      <p>Purchase participation tokens to earn a share of the reporting fees collected during this dispute window.</p>
                    </ReactTooltip>
                  }
                </div>
                <div className={Styles['ReportingHeader__dispute-graph']}>
                  <div className={Styles.ReportingHeader__graph}>
                    <div className={currentPercentage <= 90 ? Styles['ReportingHeader__graph-current'] : Styles['ReportingHeader__graph-current-90']}>
                      <div style={currentPeriodStyle}>
                        <span>{ daysLeft } days left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </article>
    )
  }
}
