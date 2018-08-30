import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  loadPendingLiquidityOrders,
  addMarketLiquidityOrders,
  clearMarketLiquidityOrders,
  updateLiquidityOrder,
  removeLiquidityOrder,
  startOrderSending,
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS,
  __RewireAPI__ as liquidityManagementRequireAPI
} from "modules/create-market/actions/liquidity-management";

import { augur } from "services/augurjs";
import { YES_NO } from "modules/markets/constants/market-types";

describe(`modules/create-market/actions/liquidity-management.js`, () => {
  const mockStore = configureMockStore([thunk]);
  const stateData = {
    marketsData: {
      marketId: {
        numTicks: "10000",
        marketType: YES_NO,
        minPrice: "0",
        maxPrice: "1"
      }
    },
    pendingLiquidityOrders: {},
    loginAccount: {
      meta: {
        test: "object"
      },
      address: "0x1233"
    }
  };

  afterAll(() => {
    liquidityManagementRequireAPI.__ResetDependency__("augur");
  });

  const oldtest = t =>
    test(t.description, () => {
      liquidityManagementRequireAPI.__Rewire__("augur", {
        ...augur,
        api: {
          ...augur.api,
          CreateOrder: {
            publicCreateOrder: params => {
              params.onSent({ hash: "0xdeadbeef", callReturn: "0x1" });
              params.onSuccess({});
            }
          }
        }
      });
      const store = mockStore(t.state || {});
      t.assertions(store);
    });

  test({
    description: "should handle loadPendingLiquidityOrders",
    state: stateData,
    assertions: store => {
      store.dispatch(loadPendingLiquidityOrders({}));
      expect(store.getActions()).toEqual([
        { type: LOAD_PENDING_LIQUIDITY_ORDERS, data: {} }
      ]);
    }
  });

  test({
    description: "should handle addMarketLiquidityOrders",
    state: stateData,
    assertions: store => {
      const data = {
        marketId: "marketId",
        liquidityOrders: {
          1: [
            { quantity: "3", price: "0.5", type: "bid", estimatedCost: "1.5" }
          ]
        }
      };
      store.dispatch(addMarketLiquidityOrders(data));
      expect(store.getActions()).toEqual([
        { type: ADD_MARKET_LIQUIDITY_ORDERS, data }
      ]);
    }
  });

  test({
    description: "should handle clearMarketLiquidityOrders",
    state: stateData,
    assertions: store => {
      const data = "marketId";
      store.dispatch(clearMarketLiquidityOrders(data));
      expect(store.getActions()).toEqual([
        { type: CLEAR_ALL_MARKET_ORDERS, data }
      ]);
    }
  });

  test({
    description: "should handle updateLiquidityOrder",
    state: stateData,
    assertions: store => {
      const data = {
        marketId: "marketId",
        outcomeId: 1,
        order: {
          quantity: "5",
          price: "0.7",
          type: "ask",
          estimatedCost: "1.5",
          index: 2
        },
        updates: { onSent: true, txHash: "0xdeadbeef", orderId: "0xOrderId" }
      };
      store.dispatch(updateLiquidityOrder(data));
      expect(store.getActions()).toEqual([
        { type: UPDATE_LIQUIDITY_ORDER, data }
      ]);
    }
  });

  test({
    description: "should handle removeLiquidityOrder",
    state: {
      ...stateData,
      pendingLiquidityOrders: {
        marketId: {
          1: [
            {
              quantity: "3",
              price: "0.5",
              type: "bid",
              estimatedCost: "1.5",
              index: 0
            }
          ]
        }
      }
    },
    assertions: store => {
      const data = {
        marketId: "marketId",
        outcomeId: 1,
        orderId: 0
      };
      store.dispatch(removeLiquidityOrder(data));
      expect(store.getActions()).toEqual([
        { type: REMOVE_LIQUIDITY_ORDER, data }
      ]);
    }
  });

  test({
    description: "should handle startOrderSending",
    state: {
      ...stateData,
      pendingLiquidityOrders: {
        marketId: {
          1: [
            {
              quantity: "3",
              price: "0.5",
              type: "bid",
              estimatedCost: "1.5",
              index: 0
            }
          ]
        }
      }
    },
    assertions: store => {
      const data = {
        marketId: "marketId",
        log: null
      };
      store.dispatch(startOrderSending(data));
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_LIQUIDITY_ORDER",
          data: {
            marketId: "marketId",
            order: {
              quantity: "3",
              price: "0.5",
              type: "bid",
              estimatedCost: "1.5",
              index: 0
            },
            orderId: 0,
            outcomeId: 1,
            updates: {
              onSent: true,
              txhash: "0xdeadbeef",
              orderId: "0x1"
            }
          }
        },
        {
          type: "REMOVE_LIQUIDITY_ORDER",
          data: {
            marketId: "marketId",
            orderId: 0,
            outcomeId: 1
          }
        }
      ]);
    }
  });
});
