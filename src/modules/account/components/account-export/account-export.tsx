import React, { Component } from "react";
import classNames from "classnames";
import QRCode from "qrcode.react";
import { Export as ExportIcon } from "modules/common/components/icons/icons";
import Styles from "modules/account/components/account-export/account-export.styles";
type AccountExportProps = {
  privateKey: string
};
type AccountExportState = {
  blurred: boolean
};
export default class AccountExport extends Component<
  AccountExportProps,
  AccountExportState
> {
  constructor() {
    super();
    this.state = {
      blurred: true
    };
  }
  render() {
    const p = this.props;
    return (
      <section className={Styles.AccountExport}>
        <div className={Styles.AccountExport__heading}>
          <h1>Account: Export</h1>
          {ExportIcon}
        </div>
        <div className={Styles.AccountExport__main}>
          <div className={Styles.AccountExport__description}>
            <p>Export your account private key.</p>
          </div>
          <div className={Styles.AccountExport__qrZone}>
            {this.state.blurred && (
              <span className={Styles.AccountExport__blurText}>Reveal QR</span>
            )}
            <button
              className={classNames(Styles.AccountExport__qrBlur, {
                [Styles["AccountExport__qrBlur-blurred"]]: this.state.blurred
              })}
              onClick={() => this.setState({ blurred: false })}
            >
              <QRCode value={p.privateKey} size={124} />
            </button>
          </div>
          <div className={Styles.AccountExport__keystore}>
            <a
              className={Styles.AccountExport__keystoreButton}
              href={p.downloadAccountDataString}
              download={p.downloadAccountFileName}
            >
              Download Keystore
            </a>
          </div>
        </div>
      </section>
    );
  }
}
