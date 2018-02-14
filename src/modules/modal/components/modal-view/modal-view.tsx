import React, { Component } from "react";
// TODO -- generalize modals where possible
import ModalLedger from "modules/modal/components/modal-ledger/modal-ledger";
import ModalUport from "modules/modal/components/modal-uport/modal-uport";
import ModalNetworkMismatch from "modules/modal/components/modal-network-mismatch/modal-network-mismatch";
import ModalNetworkDisconnected from "modules/modal/components/modal-network-disconnected/modal-network-disconnected";
import debounce from "utils/debounce";
import getValue from "utils/get-value";
import {
  MODAL_LEDGER,
  MODAL_UPORT,
  MODAL_NETWORK_MISMATCH,
  MODAL_NETWORK_DISCONNECTED
} from "modules/modal/constants/modal-types";
import Styles from "modules/modal/components/modal-view/modal-view.styles";
type ModalViewProps = {
  modal: object,
  closeModal: (...args: any[]) => any
};
type ModalViewState = {
  modalWidth: any,
  modalHeight: any,
  modalWidth: number,
  modalHeight: number
};
export default class ModalView extends Component<
  ModalViewProps,
  ModalViewState
> {
  constructor(props) {
    super(props);
    this.state = {
      modalWidth: 0,
      modalHeight: 0
    };
    this.updateModalDimensions = this.updateModalDimensions.bind(this);
    this.debounceUpdateModalDimensions = debounce(
      this.updateModalDimensions.bind(this)
    );
  }
  componentDidMount() {
    this.updateModalDimensions();
    window.addEventListener("resize", this.debouncedSetQRSize);
  }
  updateModalDimensions() {
    this.setState({
      modalWidth: getValue(this, "modal.clientWidth") || 0,
      modalHeight: getValue(this, "modal.clientHeight") || 0
    });
  }
  render() {
    const s = this.state;
    const p = this.props;
    return (
      <section
        ref={modal => {
          this.modal = modal;
        }}
        className={Styles.ModalView}
      >
        <div className={Styles.ModalView__content}>
          {p.modal.type === MODAL_LEDGER && <ModalLedger {...p.modal} />}
          {p.modal.type === MODAL_UPORT && (
            <ModalUport
              {...p.modal}
              modalWidth={s.modalWidth}
              modalHeight={s.modalHeight}
            />
          )}
          {p.modal.type === MODAL_NETWORK_MISMATCH && (
            <ModalNetworkMismatch {...p.modal} />
          )}
          {p.modal.type === MODAL_NETWORK_DISCONNECTED && (
            <ModalNetworkDisconnected {...p} />
          )}
          {p.modal.canClose && (
            <button className={Styles.ModalView__button} onClick={p.closeModal}>
              Close
            </button>
          )}
        </div>
      </section>
    );
  }
}
