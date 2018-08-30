import {
  generateOutcomePositionSummary,
  generateMarketsPositionsSummary,
  generatePositionsSummary
} from "modules/my-positions/selectors/my-positions-summary";

import { formatEther, formatShares, formatNumber } from "utils/fo1rmat-number";

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {
  describe("generateOutcomePositionSummary", () => {
    const test = t => {
      test(t.description, () => {
        t.assertions();
      });
    };

    test(`should return the expected value when adjusted positions are undefined`, () => {
      const actual = generateOutcomePositionSummary(undefined);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return the expected value when adjusted positions are defined AND position is zero`, () => {
      const actual = generateOutcomePositionSummary([]);

      const expected = {
        numPositions: formatNumber(0, {
          decimals: 0,
          decimalsRounded: 0,
          denomination: "Positions",
          positiveSign: false,
          zeroStyled: false
        }),
        netPosition: formatShares(0),
        qtyShares: formatShares(0),
        purchasePrice: formatEther(0),
        realizedNet: formatEther(0),
        unrealizedNet: formatEther(0),
        totalNet: formatEther(0),
        isClosable: false
      };

      // More verbose since a `deepEqual` can't properly check equality w/ objects containing functions
      expect(actual.numPositions).toEqual(expected.numPositions);
      expect(actual.netPosition).toEqual(expected.netPosition);
      expect(actual.qtyShares).toEqual(expected.qtyShares);
      expect(actual.purchasePrice).toEqual(expected.purchasePrice);
      expect(actual.realizedNet).toEqual(expected.realizedNet);
      expect(actual.unrealizedNet).toEqual(expected.unrealizedNet);
      expect(actual.totalNet).toEqual(expected.totalNet);
      expect(actual.isClosable).toBe(expected.isClosable);
      expect(typeof actual.closePosition).toBe("function");
    });

    test(`should return the expected value when adjusted positions are defined AND position is non-zero`, () => {
      const actual = generateOutcomePositionSummary([
        {
          averagePrice: 0.2,
          marketId: "marketId",
          numSharesAdjustedForUserIntention: 8,
          numShares: 10,
          outcome: 3,
          realizedProfitLoss: 0.1,
          unrealizedProfitLoss: 0.5
        }
      ]);

      const expected = {
        numPositions: formatNumber(1, {
          decimals: 0,
          decimalsRounded: 0,
          denomination: "Positions",
          positiveSign: false,
          zeroStyled: false
        }),
        netPosition: formatShares(8),
        qtyShares: formatShares(10),
        purchasePrice: formatEther(0.2),
        realizedNet: formatEther(0.1),
        unrealizedNet: formatEther(0.5),
        totalNet: formatEther(0.6),
        isClosable: true
      };

      // More verbose since a `deepEqual` can't properly check equality w/ objects containing functions
      expect(actual.numPositions).toEqual(expected.numPositions);
      expect(actual.netPosition).toEqual(expected.netPosition);
      expect(actual.qtyShares).toEqual(expected.qtyShares);
      expect(actual.purchasePrice).toEqual(expected.purchasePrice);
      expect(actual.realizedNet).toEqual(expected.realizedNet);
      expect(actual.unrealizedNet).toEqual(expected.unrealizedNet);
      expect(actual.totalNet).toEqual(expected.totalNet);
      expect(actual.isClosable).toBe(expected.isClosable);
      expect(typeof actual.closePosition).toBe("function");
    });
  });

  describe("generateMarketsPositionsSummary", () => {
    const test = t => {
      test(t.description, () => {
        t.assertions();
      });
    };

    test(`should return the expected value when markets are undefined`, () => {
      const actual = generateMarketsPositionsSummary([]);

      const expected = null;

      expect(actual).toBe(expected);
    });

    test(`should return the expected object if there ARE markets with positions AND no outcomes have position object`, store => {
      const actual = generateMarketsPositionsSummary([
        {
          id: "0xMARKETID1",
          myPositionsSummary: {
            numPositions: formatNumber(1, {
              decimals: 0,
              decimalsRounded: 0,
              denomination: "Positions",
              positiveSign: false,
              zeroStyled: false
            }),
            netPosition: formatShares(0),
            qtyShares: formatShares(1),
            purchasePrice: formatEther(0.2),
            realizedNet: formatEther(0),
            unrealizedNet: formatEther(0),
            totalNet: formatEther(0)
          },
          outcomes: [{}]
        }
      ]);

      const expected = {
        numPositions: formatNumber(0, {
          decimals: 0,
          decimalsRounded: 0,
          denomination: "Positions",
          positiveSign: false,
          zeroStyled: false
        }),
        netPosition: formatShares(0),
        qtyShares: formatShares(0),
        purchasePrice: formatEther(0),
        realizedNet: formatEther(0),
        unrealizedNet: formatEther(0),
        totalNet: formatEther(0),
        positionOutcomes: []
      };

      expect(actual).toEqual(expected);
    });

    test(`should return the expected object if there ARE markets with positions AND outcomes have position`, store => {
      const actual = generateMarketsPositionsSummary([
        {
          id: "0xMARKETID1",
          myPositionsSummary: {
            numPositions: formatNumber(1, {
              decimals: 0,
              decimalsRounded: 0,
              denomination: "Positions",
              positiveSign: false,
              zeroStyled: false
            }),
            netPosition: formatShares(0),
            qtyShares: formatShares(1),
            purchasePrice: formatEther(0.2),
            realizedNet: formatEther(0),
            unrealizedNet: formatEther(0),
            totalNet: formatEther(0)
          },
          outcomes: [
            {
              position: {
                numPositions: formatNumber(1, {
                  decimals: 0,
                  decimalsRounded: 0,
                  denomination: "Positions",
                  positiveSign: false,
                  zeroStyled: false
                }),
                netPosition: formatShares(0),
                qtyShares: formatShares(1),
                purchasePrice: formatEther(0.2),
                realizedNet: formatEther(10),
                unrealizedNet: formatEther(-1),
                totalNet: formatEther(9),
                isClosable: true
              }
            }
          ]
        }
      ]);

      const expected = {
        numPositions: formatNumber(1, {
          decimals: 0,
          decimalsRounded: 0,
          denomination: "Positions",
          positiveSign: false,
          zeroStyled: false
        }),
        netPosition: formatShares(0),
        qtyShares: formatShares(1),
        purchasePrice: formatEther(0),
        realizedNet: formatEther(10),
        unrealizedNet: formatEther(-1),
        totalNet: formatEther(9),
        positionOutcomes: [
          {
            position: {
              numPositions: formatNumber(1, {
                decimals: 0,
                decimalsRounded: 0,
                denomination: "Positions",
                positiveSign: false,
                zeroStyled: false
              }),
              netPosition: formatShares(0),
              qtyShares: formatShares(1),
              purchasePrice: formatEther(0.2),
              realizedNet: formatEther(10),
              unrealizedNet: formatEther(-1),
              totalNet: formatEther(9),
              isClosable: true
            }
          }
        ]
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("generatePositionsSummary", () => {
    const test = t => {
      test(t.description, () => {
        t.assertions();
      });
    };

    test(`should return the expected object`, () => {
      const actual = generatePositionsSummary(10, -2, 2, 0.2, 10, -1);

      const expected = {
        numPositions: formatNumber(10, {
          decimals: 0,
          decimalsRounded: 0,
          denomination: "Positions",
          positiveSign: false,
          zeroStyled: false
        }),
        netPosition: formatShares(-2),
        qtyShares: formatShares(2),
        purchasePrice: formatEther(0.2),
        realizedNet: formatEther(10),
        unrealizedNet: formatEther(-1),
        totalNet: formatEther(9)
      };

      expect(actual).toEqual(expected);
    });
  });
});
