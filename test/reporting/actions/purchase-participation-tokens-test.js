import mockStore from "test/mockStore";
import speedomatic from "speedomatic";
import { formatGasCostToEther } from "utils/format-number";

import {
  purchaseParticipationTokens,
  __RewireAPI__ as ReWireModule
} from "modules/reporting/actions/purchase-participation-tokens";

describe("purchase participation tokens tests", () => {
  const test = t => test(t.description, done => t.assertions(done));
  const { store } = mockStore;

  const ACTIONS = {
    CLOSE_MODAL: { type: "CLOSE_MODAL" }
  };
  const mockRPC = { getGasPrice: () => "0x2fdaf" };

  afterEach(() => {
    store.clearActions();
  });

  test({
    description: "It should handle buying 10.25 participation tokens",
    assertions: done => {
      ReWireModule.__Rewire__("augur", {
        api: {
          FeeWindow: {
            buy: p => {
              const { tx, _attotokens, onSent, onSuccess, onFailed } = p;
              expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: false });
              expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
              assert.isFunction(onSent);
              assert.isFunction(onSuccess);
              assert.isFunction(onFailed);
              onSent();
              onSuccess({});
            }
          }
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            expect(p).toEqual({ universe: store.getState().universe.id });
            assert.isFunction(cb);
            cb(null, { feeWindow: "0xfeeWindow01" });
          }
        },
        rpc: mockRPC
      });

      store.dispatch(
        purchaseParticipationTokens("10.25", false, (err, res) => {
          assert.isNull(err);
          assert.isObject(res);
          const expectedActions = [ACTIONS.CLOSE_MODAL];
          expect(store.getActions()).toEqual(expectedActions);
          done();
        })
      );
    }
  });

  test({
    description:
      "It should handle estimating gas for buying participation tokens",
    assertions: done => {
      ReWireModule.__Rewire__("augur", {
        api: {
          FeeWindow: {
            buy: p => {
              const { tx, _attotokens, onSent, onSuccess, onFailed } = p;
              expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: true });
              expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
              assert.isFunction(onSent);
              assert.isFunction(onSuccess);
              assert.isFunction(onFailed);
              onSent();
              onSuccess("0xdeadbeef");
            }
          }
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            expect(p).toEqual({ universe: store.getState().universe.id });
            assert.isFunction(cb);
            cb(null, { feeWindow: "0xfeeWindow01" });
          }
        },
        rpc: mockRPC
      });

      store.dispatch(
        purchaseParticipationTokens("10.25", true, (err, res) => {
          assert.isNull(err);
          const expectedResponse = formatGasCostToEther(
            "0xdeadbeef",
            { decimalsRounded: 4 },
            "0x2fdaf"
          );
          expect(res).toEqual(expectedResponse);
          const expectedActions = [];
          expect(store.getActions()).toEqual(expectedActions);
          done();
        })
      );
    }
  });

  test({
    description:
      "It should handle an error from estimating gas for buying participation tokens",
    assertions: done => {
      ReWireModule.__Rewire__("augur", {
        api: {
          FeeWindow: {
            buy: p => {
              const { tx, _attotokens, onSent, onSuccess, onFailed } = p;
              expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: true });
              expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
              assert.isFunction(onSent);
              assert.isFunction(onSuccess);
              assert.isFunction(onFailed);
              onSent();
              onFailed({ error: 1000, message: "Uh-Oh!" });
            }
          }
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            expect(p).toEqual({ universe: store.getState().universe.id });
            assert.isFunction(cb);
            cb(null, { feeWindow: "0xfeeWindow01" });
          }
        },
        rpc: mockRPC
      });

      store.dispatch(
        purchaseParticipationTokens("10.25", true, (err, res) => {
          assert.isUndefined(res);
          expect(err).toEqual({ error: 1000, message: "Uh-Oh!" });
          const expectedActions = [];
          expect(store.getActions()).toEqual(expectedActions);
          done();
        })
      );
    }
  });

  test({
    description: "It should handle an error from getting the Fee Window",
    assertions: done => {
      ReWireModule.__Rewire__("augur", {
        api: {
          FeeWindow: {
            buy: p => {
              assert.isNull("we should never hit this.");
            }
          }
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            expect(p).toEqual({ universe: store.getState().universe.id });
            assert.isFunction(cb);
            cb({ error: 1000, message: "Uh-Oh!" });
          }
        },
        rpc: mockRPC
      });

      store.dispatch(
        purchaseParticipationTokens("10.25", true, (err, res) => {
          assert.isUndefined(res);
          expect(err).toEqual({ error: 1000, message: "Uh-Oh!" });
          const expectedActions = [];
          expect(store.getActions()).toEqual(expectedActions);
          done();
        })
      );
    }
  });

  test({
    description: "It should handle an null current Fee Window",
    assertions: done => {
      ReWireModule.__Rewire__("augur", {
        api: {
          FeeWindow: {
            buy: p => {
              assert.isNull("we should never hit this.");
            }
          },
          Universe: {
            buyParticipationTokens: p => {
              p.onSuccess("10.25");
            }
          }
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            expect(p).toEqual({ universe: store.getState().universe.id });
            assert.isFunction(cb);
            cb(null);
          }
        },
        rpc: mockRPC
      });

      store.dispatch(
        purchaseParticipationTokens("10.25", false, (err, res) => {
          assert.isNull(err);
          expect(res).toEqual("10.25");
          const expectedActions = [];
          expect(store.getActions()).toEqual(expectedActions);
          done();
        })
      );
    }
  });
});
