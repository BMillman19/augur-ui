import React, { Component } from "react";
// import FilterSort from 'modules/filter-sort/containers/filter-sort-controller'
// import FilterSearch from 'modules/filter-sort/containers/filter-search'
// import FilterMarketState from 'modules/filter-sort/containers/filter-market-state'
// import SortMarketParam from 'modules/filter-sort/containers/sort-market-param'
import parseQuery from "modules/routes/helpers/parse-query";
import parsePath from "modules/routes/helpers/parse-path";
import { MARKETS } from "modules/routes/constants/views";
import { CATEGORY_PARAM_NAME } from "modules/filter-sort/constants/param-names";
import Styles from "modules/markets/components/markets-header/markets-header.styles";
type MarketsHeaderProps = {
  isLogged: boolean,
  location: object
};
type MarketsHeaderState = {
  headerTitle: any,
  headerTitle: any,
  headerTitle: null
};
// NOTE -- commented out state due to temp lack of utilization + linting
export default class MarketsHeader extends Component<
  MarketsHeaderProps,
  MarketsHeaderState
> {
  constructor(props) {
    super(props);
    this.state = {
      headerTitle: null
    };
    this.setHeaderTitle = this.setHeaderTitle.bind(this);
    // this.setPathDependentFilters = this.setPathDependentFilters.bind(this)
  }
  componentWillMount() {
    this.setHeaderTitle(this.props.location);
    // this.setPathDependentFilters(this.props.location)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setHeaderTitle(nextProps.location);
      // this.setPathDependentFilters(nextProps.location)
    }
  }
  setHeaderTitle(location) {
    const searchParams = parseQuery(location.search);
    if (searchParams[CATEGORY_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[CATEGORY_PARAM_NAME]
      });
    } else {
      const path = parsePath(location.pathname);
      if (path[0] === MARKETS) {
        this.setState({
          headerTitle: path[0]
        });
      }
    }
  }
  // setPathDependentFilters(location) {
  //   const path = parsePath(location.pathname)[0]
  //
  //   const filterByMarketFavorites = path === FAVORITES
  //   this.setState({ filterByMarketFavorites })
  // }
  render() {
    // const p = this.props
    const s = this.state;
    return (
      <article className={Styles.MarketsHeader}>
        <div className={Styles.MarketsHeader__search} />
        <div className={Styles.MarketsHeader__wrapper}>
          <h1 className={Styles.MarketsHeader__heading}>{s.headerTitle}</h1>
          <div className={Styles.MarketsHeader__filters} />
        </div>
      </article>
    );
  }
}
