import React, { Component } from "react";
type OutcomeTradeActionState = {
  isConfirming: boolean,
  isConfirming: boolean,
  isConfirming: boolean
};
export default class OutcomeTradeAction extends Component<
  {},
  OutcomeTradeActionState
> {
  constructor(props) {
    super(props);
    this.state = {
      isConfirming: false
    };
  }
  render() {
    const p = this.props;
    const s = this.state;
    return (
      <div className="outcome-trade-action">
        {!s.isConfirming && (
          <button
            className="trade-action"
            disabled={p.disabled}
            onClick={() => {
              this.setState({ isConfirming: true });
            }}
          >
            Place Trade
          </button>
        )}
        {s.isConfirming && (
          <div className="trade-confirmation">
            <span>Are you sure?</span>
            <div className="trade-confirmation-actions">
              <button
                className="cancel"
                onClick={() => {
                  this.setState({ isConfirming: false });
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  p.submitTrade(p.selectedID);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
