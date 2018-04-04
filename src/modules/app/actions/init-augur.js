import * as AugurJS from 'services/augurjs'
import { updateEnv } from 'modules/app/actions/update-env'
import { updateConnectionStatus, updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection'
import { updateContractAddresses } from 'modules/contracts/actions/update-contract-addresses'
import { updateFunctionsAPI, updateEventsAPI } from 'modules/contracts/actions/update-contract-api'
import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account'
import { logout } from 'modules/auth/actions/logout'
import { verifyMatchingNetworkIds } from 'modules/app/actions/verify-matching-network-ids'
import { loadUniverse } from 'modules/app/actions/load-universe'
import { registerTransactionRelay } from 'modules/transactions/actions/register-transaction-relay'
import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import getAllMarkets from 'modules/markets/selectors/markets-all'
import logError from 'utils/log-error'
import networkConfig from 'config/network'

import { isEmpty } from 'lodash'

import { MODAL_NETWORK_MISMATCH, MODAL_ESCAPE_HATCH } from 'modules/modal/constants/modal-types'

const ACCOUNTS_POLL_INTERVAL_DURATION = 3000
const NETWORK_ID_POLL_INTERVAL_DURATION = 3000
const ESCAPE_HATCH_POLL_INTERVAL_DURATION = 30000

const NETWORK_NAMES = {
  1: 'Mainnet',
  4: 'Rinkeby',
  12346: 'Private',
}

function pollForAccount(dispatch, getState) {
  const { env } = getState()
  loadAccount(dispatch, null, env, (err, loadedAccount) => {
    if (err) console.error(err)
    let account = loadedAccount
    setInterval(() => {
      loadAccount(dispatch, account, env, (err, loadedAccount) => {
        if (err) console.error(err)
        account = loadedAccount
      })
    }, ACCOUNTS_POLL_INTERVAL_DURATION)
  })
}

function loadAccount(dispatch, existing, env, callback) {
  AugurJS.augur.rpc.eth.accounts((err, accounts) => {
    if (err) return callback(err)
    let account = existing
    if (existing !== accounts[0]) {
      account = accounts[0]
      if (account && env['auto-login']) {
        dispatch(useUnlockedAccount(account))
      } else {
        dispatch(logout())
      }
    }
    callback(null, account)
  })
}

function pollForNetwork(dispatch, getState) {
  setInterval(() => {
    const { modal } = getState()
    dispatch(verifyMatchingNetworkIds((err, expectedNetworkId) => {
      if (err) return console.error('pollForNetwork failed', err)
      if (expectedNetworkId != null && isEmpty(modal)) {
        dispatch(updateModal({
          type: MODAL_NETWORK_MISMATCH,
          expectedNetwork: NETWORK_NAMES[expectedNetworkId] || expectedNetworkId,
        }))
      } else if (expectedNetworkId == null && modal.type === MODAL_NETWORK_MISMATCH) {
        dispatch(closeModal())
      }
    }))
  }, NETWORK_ID_POLL_INTERVAL_DURATION)
}

function pollForEscapeHatch(dispatch, getState) {
  setInterval(() => {
    const { modal } = getState()
    const modalShowing = !!modal.type && modal.type === MODAL_ESCAPE_HATCH
    AugurJS.augur.api.Controller.stopped((err, stopped) => {
      if (stopped && !modalShowing) {
        dispatch(updateModal({
          type: MODAL_ESCAPE_HATCH,
          markets: getAllMarkets(),
          disputeBonds: [],
          initialReports: [],
          shares: [],
          participationTokens: [],
        }))
      } else if (!stopped && modalShowing) {
        dispatch(closeModal())
      }
    })
  }, ESCAPE_HATCH_POLL_INTERVAL_DURATION)
}

export function connectAugur(history, env, isInitialConnection = false, callback = logError) {
  return (dispatch, getState) => {
    AugurJS.connect(env, (err, ConnectionInfo) => {
      if (err || !ConnectionInfo.augurNode || !ConnectionInfo.ethereumNode) {
        return callback(err, ConnectionInfo)
      }
      const ethereumNodeConnectionInfo = ConnectionInfo.ethereumNode
      dispatch(updateConnectionStatus(true))
      dispatch(updateContractAddresses(ethereumNodeConnectionInfo.contracts))
      dispatch(updateFunctionsAPI(ethereumNodeConnectionInfo.abi.functions))
      dispatch(updateEventsAPI(ethereumNodeConnectionInfo.abi.events))
      dispatch(updateAugurNodeConnectionStatus(true))
      dispatch(registerTransactionRelay())
      dispatch(loadUniverse(env.universe || AugurJS.augur.contracts.addresses[AugurJS.augur.rpc.getNetworkID()].Universe, history))
      dispatch(closeModal())
      if (isInitialConnection) {
        pollForAccount(dispatch, getState)
        pollForNetwork(dispatch, getState)
        pollForEscapeHatch(dispatch, getState)
      }
      callback()
    })
  }
}

export function initAugur(history, callback = logError) {
  return (dispatch, getState) => {
    const env = networkConfig[`${process.env.ETHEREUM_NETWORK}`]

    dispatch(updateEnv(env))
    connectAugur(history, env, true, callback)(dispatch, getState)
  }
}
