import PropTypes from 'prop-types'

import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'

import { ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW } from 'modules/routes/constants/views'

export default class AccountInnerNav extends BaseInnerNav {
  static propTypes = {
    ...BaseInnerNav.propTypes,
    privateKey: PropTypes.string,
  }

  getMainMenuData() {
    return [
      {
        label: 'Deposit',
        visible: true,
        isSelected: (this.props.currentBasePath === ACCOUNT_DEPOSIT),
        link: {
          pathname: ACCOUNT_DEPOSIT,
        },
      },
      {
        label: 'Withdraw',
        visible: true,
        isSelected: (this.props.currentBasePath === ACCOUNT_WITHDRAW),
        link: {
          pathname: ACCOUNT_WITHDRAW,
        },
      },
    ]
  }
}
