import { constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import unpackTransactionParameters from 'modules/transactions/actions/unpack-transaction-parameters'
import { addNotification, updateNotification } from 'modules/notifications/actions/update-notifications'

import makePath from 'modules/routes/helpers/make-path'

import { TRANSACTIONS } from 'modules/routes/constants/views'

export const constructRelayTransaction = tx => (dispatch, getState) => {
  const { notifications } = getState()
  const { hash } = tx
  const { status } = tx
  const unpackedParams = unpackTransactionParameters(tx)
  // console.log('unpacked:', JSON.stringify(unpackedParams, null, 2))
  const timestamp = tx.response.timestamp || parseInt(Date.now() / 1000, 10)
  const blockNumber = tx.response.blockNumber && parseInt(tx.response.blockNumber, 16)
  if (notifications.filter(notification => notification.id === hash).length) {
    dispatch(updateNotification(hash, {
      ...unpackedParams,
      id: hash,
      timestamp,
      blockNumber,
      title: `${unpackedParams.type} - ${status}`,
      description: unpackedParams._description || '',
      linkPath: makePath(TRANSACTIONS),
      seen: false, // Manually set to false to ensure notification
    }))
  } else {
    dispatch(addNotification({
      ...unpackedParams,
      id: hash,
      timestamp,
      blockNumber,
      title: `${unpackedParams.type} - ${status}`,
      description: unpackedParams._description || '',
      linkPath: makePath(TRANSACTIONS),
    }))
  }
  return {
    [hash]: dispatch(constructBasicTransaction(hash, status, blockNumber, timestamp, tx.response.gasFees)),
  }
}
