import sinon from "sinon";
import { createBigNumber } from "utils/create-big-number";

import coreStats, {
  selectOutcomeLastPrice,
  createPeriodPLSelector,
  __RewireAPI__ as CoreStatsRewireAPI
} from "modules/account/selectors/core-stats";
// import { formatEther, formatRep } from 'utils/format-number'

import { ZERO } from "modules/trade/constants/numbers";

describe("modules/account/selectors/core-stats", () => {
  describe("default", () => {
    test(`should call 'selectCoreStats'`, () => {
      const stubbedSelectCoreStats = sinon.stub();

      CoreStatsRewireAPI.__Rewire__("selectCoreStats", stubbedSelectCoreStats);

      coreStats();

      CoreStatsRewireAPI.__ResetDependency__("selectCoreStats");

      assert(
        stubbedSelectCoreStats.calledOnce,
        `didn't call 'selectCoreStats' once as expected`
      );
    });
  });

  describe("selectOutcomeLastPrice", () => {
    test(`should return null when 'marketOutcomeData' is undefined`, () => {
      const actual = selectOutcomeLastPrice(undefined, 1);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return null when 'outcomeId' is undefined`, () => {
      const actual = selectOutcomeLastPrice({}, undefined);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return the expected price`, () => {
      const actual = selectOutcomeLastPrice({ 1: { price: "0.1" } }, 1);

      const expected = "0.1";

      expect(actual).toBe(expected);
    });

    test(`should return the expected price`, () => {
      const actual = selectOutcomeLastPrice({ 2: { price: "0.1" } }, 1);

      const expected = undefined;

      expect(actual).toBe(expected);
    });
  });

  describe("createPeriodPLSelector", () => {
    // eslint-disable-line func-names, prefer-arrow-callback
    test(`should return null when 'accountTrades' is undefined`, () => {
      const blockchain = {};

      const selector = createPeriodPLSelector(1);

      const actual = selector.resultFunc(undefined, blockchain, undefined);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return null when 'blockchain' is undefined`, () => {
      const accountTrades = {};

      const selector = createPeriodPLSelector(1);

      const actual = selector.resultFunc(accountTrades, undefined, undefined);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return 0 for a set period with no trades`, () => {
      const accountTrades = {
        "0xMarketID1": {
          1: [
            {
              blockNumber: 90000
            },
            {
              blockNumber: 90001
            }
          ],
          2: [
            {
              blockNumber: 90000
            },
            {
              blockNumber: 90001
            }
          ]
        }
      };

      const blockchain = {
        currentBlockNumber: 100000
      };

      const outcomesData = {
        "0xMarketID1": {}
      };

      const selector = createPeriodPLSelector(1);

      const actual = selector.resultFunc(
        accountTrades,
        blockchain,
        outcomesData
      );

      const expected = ZERO;

      expect(actual).toEqual(expected);
    });

    test(`should return the expected value for a set period with trades`, () => {
      const accountTrades = {
        "0xMarketID1": {
          1: [
            {
              blockNumber: 95000
            },
            {
              blockNumber: 96000
            }
          ],
          2: [
            {
              blockNumber: 95000
            },
            {
              blockNumber: 96000
            }
          ]
        }
      };

      const blockchain = {
        currentBlockNumber: 100000
      };

      const outcomesData = {
        "0xMarketID1": {}
      };

      CoreStatsRewireAPI.__Rewire__("selectOutcomeLastPrice", () => "0.2");
      CoreStatsRewireAPI.__Rewire__("augur", {
        trading: {
          calculateProfitLoss: () => ({
            realized: "-1",
            unrealized: "2"
          })
        }
      });

      const selector = createPeriodPLSelector(1);

      const actual = selector.resultFunc(
        accountTrades,
        blockchain,
        outcomesData
      );

      const expected = createBigNumber("2");

      CoreStatsRewireAPI.__ResetDependency__("selectOutcomeLastPrice");
      CoreStatsRewireAPI.__ResetDependency__("augur");

      expect(actual).toEqual(expected);
    });
  });
});
