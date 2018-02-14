import { describe, it } from "mocha";
import { assert } from "chai";
import { ADD_CLOSE_POSITION_TRADE_GROUP } from "modules/my-positions/actions/add-close-position-trade-group";
import { CLEAR_CLOSE_POSITION_OUTCOME } from "modules/my-positions/actions/clear-close-position-outcome";
import * as closePositionTradeGroups from "modules/my-positions/reducers/close-position-trade-groups";
describe("modules/my-positions/reducers/close-position-trade-groups.js", () => {
  describe("closePositionTradeGroups", () => {
    const test = t => {
      it(t.description, () => {
        if (t.defaultState) {
          t.assertions(closePositionTradeGroups.default(undefined, t.action));
        } else {
          const existingClosePositionTradeGroups = t.existingClosePositionTradeGroups || {
            "0xMarketID1": {
              0: ["0x00000TradeGroupID1", "0x00000TradeGroupID2"]
            }
          };
          t.assertions(
            closePositionTradeGroups.default(
              existingClosePositionTradeGroups,
              t.action
            )
          );
        }
      });
    };
    test({
      description: "should return the default state",
      action: {},
      defaultState: true,
      assertions: res => {
        assert.deepEqual(res, {});
      }
    });
    test({
      description: "should return the existing state",
      action: {},
      assertions: res => {
        assert.deepEqual(res, {
          "0xMarketID1": {
            0: ["0x00000TradeGroupID1", "0x00000TradeGroupID2"]
          }
        });
      }
    });
    test({
      description:
        "should add a tradeGroupID to an existing market and outcome",
      action: {
        type: ADD_CLOSE_POSITION_TRADE_GROUP,
        marketID: "0xMarketID1",
        outcomeID: "0",
        tradeGroupID: "0x00000TradeGroupID3"
      },
      assertions: res => {
        assert.deepEqual(res, {
          "0xMarketID1": {
            0: [
              "0x00000TradeGroupID1",
              "0x00000TradeGroupID2",
              "0x00000TradeGroupID3"
            ]
          }
        });
      }
    });
    test({
      description: `should clear the only outcome`,
      existingClosePositionTradeGroups: {
        "0xMarketID1": {
          0: ["0x00000TradeGroupID1", "0x00000TradeGroupID2"],
          1: ["0x00000TradeGroupID3"]
        },
        "0xMarketID2": {
          3: ["0x00000TradeGroupID4"]
        }
      },
      action: {
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: "0xMarketID2",
        outcomeID: "3"
      },
      assertions: res => {
        assert.deepEqual(res, {
          "0xMarketID1": {
            0: ["0x00000TradeGroupID1", "0x00000TradeGroupID2"],
            1: ["0x00000TradeGroupID3"]
          }
        });
      }
    });
    test({
      description: `should clear one of the outcomes`,
      existingClosePositionTradeGroups: {
        "0xMarketID1": {
          0: ["0x00000TradeGroupID1", "0x00000TradeGroupID2"],
          1: ["0x00000TradeGroupID3"]
        },
        "0xMarketID2": {
          3: ["0x00000TradeGroupID4"]
        }
      },
      action: {
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: "0xMarketID1",
        outcomeID: "0"
      },
      assertions: res => {
        assert.deepEqual(res, {
          "0xMarketID1": {
            1: ["0x00000TradeGroupID3"]
          },
          "0xMarketID2": {
            3: ["0x00000TradeGroupID4"]
          }
        });
      }
    });
  });
});
