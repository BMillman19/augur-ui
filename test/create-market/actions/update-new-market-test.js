import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  invalidateMarketCreation,
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/create-market/actions/update-new-market";

// import { NEW_MARKET_REVIEW } from 'modules/create-market/constants/new-market-creation-steps'

describe("modules/create-market/actions/update-new-market.js", () => {
  const test = t => {
    test(t.description, () => {
      t.assertions();
    });
  };

  test(
    `should dispatch the expected actions from 'invalidateMarketCreation'`,
    () => {
      const middlewares = [thunk];
      const mockStore = configureMockStore(middlewares);
      const store = mockStore();

      store.dispatch(invalidateMarketCreation("testing"));

      const actions = store.getActions();

      const expectedActions = [
        {
          type: UPDATE_NEW_MARKET,
          data: {
            isValid: false
          }
        }
      ];

      assert.deepEqual(
        actions,
        expectedActions,
        `Didn't dispatch the expected actions`
      );
    }
  );

  test(`should return the expected object for 'addOrderToNewMarket'`, () => {
    const action = addOrderToNewMarket({ test: "test" });

    const expected = {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        test: "test"
      }
    };

    assert.deepEqual(action, expected, `Didn't return the expected object`);
  });

  test(
    `should return the expected object for 'removeOrderFromNewMarket'`,
    () => {
      const action = removeOrderFromNewMarket({ test: "test" });

      const expected = {
        type: REMOVE_ORDER_FROM_NEW_MARKET,
        data: {
          test: "test"
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  );

  test(`should return the expected object for 'updateNewMarket'`, () => {
    const action = updateNewMarket({ test: "test" });

    const expected = {
      type: UPDATE_NEW_MARKET,
      data: {
        test: "test"
      }
    };

    assert.deepEqual(action, expected, `Didn't return the expected object`);
  });

  test(`should return the expected object for 'clearNewMarket'`, () => {
    const action = clearNewMarket();

    const expected = {
      type: CLEAR_NEW_MARKET
    };

    assert.deepEqual(action, expected, `Didn't return the expected object`);
  });
});
