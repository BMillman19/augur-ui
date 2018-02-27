import { augur } from 'services/augurjs'
import { updateIsLoggedAndLoadAccountData } from 'modules/auth/actions/update-is-logged-and-load-account-data'
import isMetaMask from 'modules/auth/helpers/is-meta-mask'
import logError from 'utils/log-error'

const { ACCOUNT_TYPES } = augur.rpc.constants

// Use unlocked local account or MetaMask account
export const useUnlockedAccount = (unlockedAddress, callback = logError) => (dispatch) => {
  if (unlockedAddress == null) return callback('no account address')
  if (isMetaMask()) {
    dispatch(updateIsLoggedAndLoadAccountData(unlockedAddress, ACCOUNT_TYPES.META_MASK))
    return callback(null)
  }
  augur.rpc.isUnlocked(unlockedAddress, (isUnlocked) => {
    if (isUnlocked == null || isUnlocked.error) return callback(isUnlocked || 'error calling augur.rpc.isUnlocked')
    if (isUnlocked === false) {
      console.warn(`account ${unlockedAddress} is locked`)
      return callback(null)
    }
    dispatch(updateIsLoggedAndLoadAccountData(unlockedAddress, ACCOUNT_TYPES.UNLOCKED_ETHEREUM_NODE))
    callback(null)
  })
}
