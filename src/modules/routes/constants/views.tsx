// MAIN VIEWS
export const MARKET = "market";
export const MARKETS = "markets";
export const FAVORITES = "favorites";
export const CREATE_MARKET = "create-market";
export const TRANSACTIONS = "transactions";
export const ACCOUNT = "account";
export const AUTHENTICATION = "authentication";
export const CONNECT = "connect";
export const CREATE = "create";
export const CATEGORIES = "categories";
export const REPORTING = "reporting";
export const DEFAULT_VIEW = CATEGORIES;
// NOTE -- if the view is conditionally displayed based on a param, it's value should be housed withint the resepective constant file
// Most of these will be progressively being refactored out
// SUB VIEWS
//  Portfolio
export const MY_POSITIONS = "my-positions";
export const MY_MARKETS = "my-markets";
export const WATCHLIST = "watch-list";
export const PORTFOLIO_TRANSACTIONS = "transactions";
//  Market (TODO -- These should be params, not routes)
export const MARKET_DATA_NAV_OUTCOMES = "outcomes";
export const MARKET_DATA_ORDERS = "orders";
export const MARKET_DATA_NAV_CHARTS = "charts";
export const MARKET_DATA_NAV_DETAILS = "details";
export const MARKET_DATA_NAV_REPORT = "report";
export const MARKET_DATA_NAV_SNITCH = "snitch";
export const MARKET_USER_DATA_NAV_POSITIONS = "positions";
export const MARKET_USER_DATA_NAV_OPEN_ORDERS = "open-orders";
//  Account
export const ACCOUNT_DEPOSIT = "deposit-funds";
export const ACCOUNT_TRANSFER = "transfer-funds";
export const ACCOUNT_WITHDRAW = "withdraw-funds";
export const ACCOUNT_EXPORT = "export-account";
// Reporting
export const REPORTING_DISPUTE = "reporting-dispute";
export const REPORTING_REPORTING = "reporting-reporting";
export const REPORTING_REPORT = "reporting-report"; // NOTE -- Not currently used...but will be shortly
// Dev only
export const STYLE_SANDBOX = "style-sandbox";
