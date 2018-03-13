import { augur } from 'services/augurjs'
import speedomatic from 'speedomatic'
import logError from 'utils/log-error'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'

export const purchaseParticipationTokens = (amount, estimateGas = false, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.reporting.getFeeWindowCurrent({ universe: universe.id }, (err, currFeeWindowInfo) => {
    if (err) return callback(err)
    const feeWindowAddress = currFeeWindowInfo.feeWindow
    augur.api.FeeWindow.buy({
      tx: {
        meta: loginAccount.meta,
        to: feeWindowAddress,
        estimateGas,
      },
      _attotokens: speedomatic.fix(amount, 'hex'),
      onSent: () => {
        // if we aren't estimatingGas, close the modal once the transaction is sent.
        if (!estimateGas) dispatch(closeModal())
      },
      onSuccess: (res) => {
        if (estimateGas) {
          // if just a gas estimate, return the gas cost.
          const gasPrice = augur.rpc.getGasPrice()
          return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
        }
        // if not a gas estimate, just return res.
        return callback(null, res)
      },
      onFailed: err => callback(err),
    })
  })
}
