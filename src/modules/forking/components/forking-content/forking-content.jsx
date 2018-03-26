import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { convertUnixToFormattedDate } from 'utils/format-date'
import ForkingProgressBar from 'modules/forking/components/forking-progress-bar/forking-progress-bar'
import { TYPE_MIGRATE_REP } from 'modules/market/constants/link-types'
import MarketLink from 'modules/market/components/market-link/market-link'

import Styles from 'modules/forking/components/forking-content/forking-content.styles'

const ForkingContent = (p) => {
  const unixFormattedDate = convertUnixToFormattedDate(p.forkEndTime)
  const forkWindowActive = Number(p.forkEndTime) > p.currentTime

  return (
    <section className={classNames(Styles.ForkingContent, p.expanded ? Styles.expanded : '')}>
      <div className={classNames(Styles.ForkingContent__container, p.expanded ? Styles.expanded : '')}>
        <h4>
          Forking window ends {unixFormattedDate.formattedLocal}
        </h4>
        <ForkingProgressBar
          forkEndTime={p.forkEndTime}
          currentTime={p.currentTime}
        />
        {forkWindowActive &&
          <p>
            If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate to your chosen child universe. All REP migrated during the forking period will receive a 5% bonus. The forking period will end on {unixFormattedDate.formattedLocalShort} or when more than 50% of all REP has been migrated to a child universe. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
          </p>
        }
        {!forkWindowActive &&
          <p>
            If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate to your chosen child universe. The forking period has ended. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
          </p>
        }
        <MarketLink
          className={Styles.ForkingContent__migrate_rep_button}
          id={p.forkingMarket}
          formattedDescription="Migrate REP"
          linkType={TYPE_MIGRATE_REP}
        >
          Migrate REP
        </MarketLink>
      </div>
    </section>
  )
}

ForkingContent.propTypes = {
  forkingMarket: PropTypes.string.isRequired,
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
}

export default ForkingContent
