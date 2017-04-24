import React, { Component, PropTypes } from 'react';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';
import Paginator from 'modules/common/components/paginator';

import getValue from 'utils/get-value';

export default class TransactionsView extends Component {
  static propTypes = {
    branch: PropTypes.object,
    currentBlockNumber: PropTypes.number,
    loginAccount: PropTypes.object,
    transactions: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      transactionsPerPage: 5, // -- Update this value to change pagination size
      nullMessage: 'No Transaction Data',
      lowerIndex: null,
      upperIndex: null,
      currentPage: 1,
      pagination: {},
      paginatedTransactions: []
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.paginateTransactions = this.paginateTransactions.bind(this);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.transactions !== nextProps.transactions ||
      this.state.currentPage !== nextState.currentPage
    ) {
      this.updatePagination(nextProps, nextState, this.state.currentPage < nextState.currentPage);
    }
  }

  updatePagination(p, s) {
    const itemsPerPage = s.transactionsPerPage - 1; // Convert to zero index
    const lowerIndex = (s.currentPage - 1) * s.transactionsPerPage;
    const upperIndex = (p.transactions.length - 1) > lowerIndex + itemsPerPage ?
      lowerIndex + itemsPerPage :
      p.transactions.length - 1;

    this.setState({
      lowerIndex,
      upperIndex,
      pagination: {
        numUnpaginated: p.transactions.length,
        startItemNum: lowerIndex + 1,
        endItemNum: upperIndex + 1,
        previousPageLink: s.currentPage > 1 ?
        {
          onClick: () => {
            if (s.currentPage > 1) this.setState({ currentPage: s.currentPage - 1 });
          }
        } :
        null,
        nextPageLink: s.currentPage < Math.ceil(p.transactions.length / s.transactionsPerPage) ?
        {
          onClick: () => {
            if (upperIndex < p.transactions.length - 1) this.setState({ currentPage: s.currentPage + 1 });
          }
        } :
        null
      }
    }, () => {
      this.paginateTransactions(this.props, this.state);
    });
  }

  paginateTransactions(p, s) {
    // Filter Based on Pagination
    const paginatedTransactions = p.transactions.slice(s.lowerIndex, s.upperIndex + 1);

    if (paginatedTransactions !== s.paginatedTransactions) {
      this.setState({ paginatedTransactions });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const hasRep = !!getValue(p, 'loginAccount.rep.value');
    const hasBranch = !!getValue(p, 'branch.id');

    return (
      <section id="transactions_view">
        {hasRep && hasBranch &&
          <Branch {...p.branch} />
        }

        <div className="view-header">
          <h2>Transactions</h2>
        </div>

        <Transactions
          paginatedTransactions={s.paginatedTransactions}
          currentBlockNumber={p.currentBlockNumber}
        />
        {!!p.transactions.length &&
          <Paginator {...s.pagination} />
        }
      </section>
    );
  }
}
