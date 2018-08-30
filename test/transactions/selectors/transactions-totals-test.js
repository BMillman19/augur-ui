import {
  PENDING,
  SUCCESS,
  FAILED,
  INTERRUPTED
} from "modules/transactions/constants/statuses";
import transactionsTotalsAssertions from "assertions/transactions-totals";

describe(`modules/transactions/selectors/transactions-totals.js`, () => {
  let actual;
  let expected;

  test(`should return the transaction totals for a blank state`, () => {
    const Transactions = {
      selectTransactions: () => []
    };
    const selector = jest.mock(
      "../../../src/modules/transactions/selectors/transactions-totals",
      {
        "./transactions": Transactions
      }
    );
    actual = selector.selectTransactionsTotals({});
    expected = {
      numWorking: 0,
      numPending: 0,
      numComplete: 0,
      numWorkingAndPending: 0,
      numTotal: 0,
      title: "0 Transactions",
      transactions: undefined,
      shortTitle: "0 Total"
    };
    expect(actual).toEqual(expected);
  });

  test(`should properly return total info on transactions`, () => {
    const Transactions = {
      selectTransactions: () => [
        {
          id: "fake",
          status: PENDING
        },
        {
          id: "example",
          status: SUCCESS
        },
        {
          id: "test",
          status: FAILED
        },
        {
          id: "mock",
          status: INTERRUPTED
        }
      ]
    };
    const selector = jest.mock(
      "../../../src/modules/transactions/selectors/transactions-totals",
      {
        "./transactions": Transactions
      }
    );
    actual = selector.selectTransactionsTotals({});
    expected = {
      numWorking: 0,
      numPending: 1,
      numComplete: 3,
      numWorkingAndPending: 1,
      numTotal: 4,
      title: "Transaction Working",
      transactions: undefined,
      shortTitle: "1 Working"
    };
    transactionsTotalsAssertions(actual);
    expect(actual).toEqual(expected);
  });
});
