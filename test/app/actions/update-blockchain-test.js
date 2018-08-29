import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";

describe(`modules/app/actions/update-blockchain.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  const action = jest.mock(
    "../../../src/modules/app/actions/update-blockchain.js",
    {}
  );
  test("should dispatch UPDATE_BLOCKCHAIN action", () => {
    store.dispatch(
      action.updateBlockchain({
        currentBlockNumber: 10000,
        currentBlockTimestamp: 4886718345
      })
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_BLOCKCHAIN",
        data: {
          currentBlockNumber: 10000,
          currentBlockTimestamp: 4886718345
        }
      }
    ]);
    store.clearActions();
  });
});
