import React, { Component } from "react";
import classNames from "classnames";
import TransactionMeta from "modules/portfolio/containers/transaction-meta";
import { ChevronDown } from "modules/common/components/icons/icons";
import toggleHeight from "utils/toggle-height/toggle-height";
import Styles from "modules/portfolio/components/transaction-linked/transaction-linked.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";
type LinkedTransactionState = {
  isOpen: boolean,
  isOpen: boolean
};
export default class LinkedTransaction extends Component<
  {},
  LinkedTransactionState
> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  render() {
    const s = this.state;
    const p = this.props;
    return (
      <div>
        <button
          className={Styles.LinkedTransaction__message}
          onClick={() => {
            toggleHeight(this.metaWrapper, s.isOpen, () => {
              this.setState({ isOpen: !s.isOpen });
            });
          }}
        >
          <div>
            {p.transaction.open && (
              <h5 className={Styles.LinkedTransaction__status}>Open Order</h5>
            )}
            <span className={Styles["LinkedTransaction__message-text"]}>
              {p.transaction.message}
            </span>
          </div>
          <span
            className={classNames(
              Styles["LinkedTransaction__message-chevron"],
              { [`${Styles["is-open"]}`]: s.isOpen }
            )}
          >
            {ChevronDown}
          </span>
        </button>
        <div
          ref={metaWrapper => {
            this.metaWrapper = metaWrapper;
          }}
          className={ToggleHeightStyles["toggle-height-target"]}
        >
          <TransactionMeta meta={p.transaction.meta} />
        </div>
      </div>
    );
  }
}
