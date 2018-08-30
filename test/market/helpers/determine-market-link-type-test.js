import { constants } from "services/augurjs";
import {
  TYPE_VIEW,
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_TRADE
} from "modules/market/constants/link-types";
import { determineMarketLinkType } from "modules/market/helpers/determine-market-link-type";

describe(`modules/market/helpers/determine-market-link-type.js`, () => {
  const account = { address: "userId" };

  const test = t => {
    it(t.description, () => {
      t.assertions();
    });
  };

  describe("empty market", () => {
    it(`should call the expected method`, () => {
      const market = {};
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_VIEW, `Didn't call the expected method`);
    });
  });

  describe("empty login account", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.PRE_REPORTING
      };
      const actual = determineMarketLinkType(market, {});
      assert.deepEqual(actual, TYPE_VIEW, `Didn't call the expected method`);
    });
  });

  describe("null market", () => {
    it(`should call the expected method`, () => {
      const market = null;
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_VIEW, `Didn't call the expected method`);
    });
  });

  describe("pre reporting market", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.PRE_REPORTING
      };
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_TRADE, `Didn't call the expected method`);
    });
  });

  describe("designated reporting market", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
        designatedReporter: account.address
      };
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_REPORT, `Didn't call the expected method`);
    });
  });

  describe("non-designated reporting market", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
        designatedReporter: "snuggles"
      };
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_VIEW, `Didn't call the expected method`);
    });
  });

  describe("open reporting market", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.OPEN_REPORTING
      };
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_REPORT, `Didn't call the expected method`);
    });
  });

  describe("dispute reporting market", () => {
    it(`should call the expected method`, () => {
      const market = {
        reportingState: constants.REPORTING_STATE.CROWDSOURCING_DISPUTE
      };
      const actual = determineMarketLinkType(market, account);
      assert.deepEqual(actual, TYPE_DISPUTE, `Didn't call the expected method`);
    });
  });
});
