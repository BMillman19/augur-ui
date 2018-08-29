import React from "react";

import { shallow } from "enzyme";
import {
  NoMarketsFound,
  ReportSection
} from "src/modules/reporting/components/reporting-report-markets/reporting-report-markets";
import ConnectedMarketPreview from "src/modules/reporting/containers/market-preview";

describe("reporting-report-markets", () => {
  describe("props", () => {
    let cmp;
    let exampleTitle;

    beforeEach(() => {
      exampleTitle = "some title";
      cmp = shallow(<ReportSection title={exampleTitle} items={[]} />);
    });

    test("should display the passed in title", () => {
      assert.include(cmp.text(), exampleTitle);
    });

    describe("when items array is empty", () => {
      test("should render no markets found component", () => {
        assert.lengthOf(cmp.find(NoMarketsFound), 1);
      });
    });

    describe("when items array is not empty", () => {
      test("should render markets component", () => {
        const items = [
          {
            id: 1,
            endTime: { timestamp: 1 }
          },
          {
            id: 2,
            endTime: { timestamp: 1 }
          },
          {
            id: 3,
            endTime: { timestamp: 1 }
          }
        ];

        cmp = shallow(
          <ReportSection
            title={exampleTitle}
            items={items}
            lower={1}
            boundedLength={3}
          />
        );
        assert.lengthOf(cmp.find(ConnectedMarketPreview), 3);
      });
    });

    describe("when items array is already sorted", () => {
      test("should render markets in given order (timestamp)", () => {
        const items = [
          {
            id: 1,
            endTime: { timestamp: 5 }
          },
          {
            id: 2,
            endTime: { timestamp: 1 }
          },
          {
            id: 3,
            endTime: { timestamp: 4 }
          }
        ];

        cmp = shallow(
          <ReportSection
            title={exampleTitle}
            items={items}
            lower={1}
            boundedLength={3}
          />
        );
        const sections = cmp.find(ConnectedMarketPreview);
        const result = sections.map(x => x.props().id);
        expect([1, 2, 3]).toEqual(result);
      });
    });
  });

  describe("NoMarketFound", () => {
    test("should display the message passed in", () => {
      const message = "some message";
      const cmp = shallow(
        <NoMarketsFound message={message} lower={1} boundedLength={3} />
      );

      assert.include(cmp.text(), message);
    });
  });
});
