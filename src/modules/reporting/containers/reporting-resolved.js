import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingResolved from 'modules/reporting/components/reporting-resolved/reporting-resolved'
// import { loadResolved } from 'modules/reporting/actions/load-resolved'
import { loadReporting } from 'src/modules/reporting/actions/load-reporting'
import { selectMarketsToReport } from 'src/modules/reporting/selectors'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  markets: getValue(selectMarketsToReport(state), 'resolved'),
})

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting()),
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
})

const ReportingResolvedContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingResolved))

export default ReportingResolvedContainer
