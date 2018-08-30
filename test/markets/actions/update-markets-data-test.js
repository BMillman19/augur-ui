import * as updateMarketsDataReducer from "modules/markets/actions/update-markets-data";

describe(`modules/markets/actions/update-markets-data.js`, () => {
  const test = t => it(t.description, () => t.assertions());

  it("`updateMarketsData` should return the expected object", () => {
    const actual = updateMarketsDataReducer.updateMarketsData({
      test: "object"
    });

    const expected = {
      type: updateMarketsDataReducer.UPDATE_MARKETS_DATA,
      marketsData: {
        test: "object"
      }
    };

    assert.deepEqual(actual, expected, `didn't return the expected value`);
  });

  it("`clearMarketsData` should return the expected object", () => {
    const actual = updateMarketsDataReducer.clearMarketsData();

    const expected = {
      type: updateMarketsDataReducer.CLEAR_MARKETS_DATA
    };

    assert.deepEqual(actual, expected, `didn't return the expected value`);
  });

  it("`updateMarketCategory` should return the expected object", () => {
    const actual = updateMarketsDataReducer.updateMarketCategory(
      "0xMarket1",
      "cat1"
    );

    const expected = {
      type: updateMarketsDataReducer.UPDATE_MARKET_CATEGORY,
      marketId: "0xMarket1",
      category: "cat1"
    };

    assert.deepEqual(actual, expected, `didn't return the expected value`);
  });

  it("`updateMarketsData` should return the expected object", () => {
    const actual = updateMarketsDataReducer.updateMarketRepBalance(
      "0xMarket1",
      10
    );

    const expected = {
      type: updateMarketsDataReducer.UPDATE_MARKET_REP_BALANCE,
      marketId: "0xMarket1",
      repBalance: 10
    };

    assert.deepEqual(actual, expected, `didn't return the expected value`);
  });

  it("`updateMarketFrozenSharesValue` should return the expected object", () => {
    const actual = updateMarketsDataReducer.updateMarketFrozenSharesValue(
      "0xMarket1",
      5
    );

    const expected = {
      type: updateMarketsDataReducer.UPDATE_MARKET_FROZEN_SHARES_VALUE,
      marketId: "0xMarket1",
      frozenSharesValue: 5
    };

    assert.deepEqual(actual, expected, `didn't return the expected value`);
  });
});
