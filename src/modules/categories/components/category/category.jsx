import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import Styles from 'modules/categories/components/category/category.styles'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { CATEGORY_VOLUME_INCREASED, CATEGORY_VOLUME_DECREASED } from 'modules/categories/constants/category-popularity-change'
import { MARKETS } from 'modules/routes/constants/views'
import { CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'

export default class Category extends Component {
  static propTypes = {
    popularity: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      popularityChange: null,
    }

    this.updatePopularity = this.updatePopularity.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.popularity !== nextProps.popularity) this.updatePopularity(nextProps.popularity > this.props.popularity ? CATEGORY_VOLUME_INCREASED : CATEGORY_VOLUME_DECREASED)
  }

  updatePopularity(popularityChange) {
    this.setState({ popularityChange })
  }

  render() {
    const p = this.props
    const s = this.state

    const isNullCategory = p.category === 'null-category' && p.popularity === 0
    const roundedPop = new BigNumber(p.popularity.toString()).integerValue(BigNumber.ROUND_HALF_EVEN)
    let popString = roundedPop.toNumber() === 1 ? ' SHARE' : ' SHARES'
    if (roundedPop > 1000) {
      const thousands = roundedPop / 1000
      const truncatedThousands = thousands.toString().split('').slice(0, 3).join('')
      popString = truncatedThousands + 'K ' + popString
    } else {
      popString = roundedPop + popString
    }

    return (
      <Link
        to={{
          pathname: makePath(MARKETS),
          search: makeQuery({
            [CATEGORY_PARAM_NAME]: p.category,
          }),
        }}
        className={isNullCategory ? Styles['Category__link-hidden'] : Styles.Category__link}
      >
        <div
          ref={(categoryNameContainer) => { this.categoryNameContainer = categoryNameContainer }}
        >
          <div className={Styles.Category__name} >
            <span ref={(categoryName) => { this.categoryName = categoryName }}>
              {p.category.toUpperCase()}
            </span>
          </div>
          <div className={Styles.Category__separator} />
          <div className={Styles.Category__popularity} >
            <span
              className={classNames({
                'bounce-up-and-flash': s.popularityChange === CATEGORY_VOLUME_INCREASED,
                'bounce-down-and-flash': s.popularityChange === CATEGORY_VOLUME_DECREASED,
              })}
              data-tip
              data-for="category-volume-tooltip"
            >
              {popString}
            </span>
          </div>
        </div>
      </Link>
    )
  }
}
