import {
  UPDATE_REPORTS,
  UPDATE_REPORT,
  CLEAR_REPORTS
} from "modules/reports/actions/update-reports";
import { CLEAR_OLD_REPORTS } from "modules/reports/actions/clear-old-reports";
import { RESET_STATE } from "modules/app/actions/reset-state";
const DEFAULT_STATE = {};
export default function(reports = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORTS: {
      let universeID;
      const updatedReports = Object.assign({}, reports);
      const universeIDs = Object.keys(action.reports);
      const numUniverseIDs = universeIDs.length;
      for (let i = 0; i < numUniverseIDs; ++i) {
        universeID = universeIDs[i];
        updatedReports[universeID] = Object.assign(
          {},
          reports[universeID],
          action.reports[universeID]
        );
      }
      return updatedReports;
    }
    case UPDATE_REPORT: {
      const universeReports = reports[action.universeID] || {};
      return {
        ...reports,
        [action.universeID]: {
          ...universeReports,
          [action.marketID]: {
            ...(universeReports[action.marketID] || {
              marketID: action.marketID
            }),
            ...action.report
          }
        }
      };
    }
    case CLEAR_OLD_REPORTS: {
      const universeReports = reports[action.universeID] || {};
      return {
        ...reports,
        [action.universeID]: Object.keys(universeReports).reduce(
          (p, marketID) => {
            if (
              universeReports[marketID].period >=
              action.currentReportingWindowAddress
            ) {
              p[marketID] = universeReports[marketID];
            }
            return p;
          },
          {}
        )
      };
    }
    case RESET_STATE:
    case CLEAR_REPORTS:
      return DEFAULT_STATE;
    default:
      return reports;
  }
}
