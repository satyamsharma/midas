import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StockPrice extends Component {
    static propTypes = {
      stockPrice: PropTypes.number.isRequired
    }

    render() {
      return (
        <li>{"$" + this.props.stockPrice}</li>
      );
    }
  }
