import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that returns node if code value is an empty string or the original children otherwise
 * @param {Node} children Original portal children
 * @return {JSX|null}
 */
const CouponCode = ({ children }) => {
  const { props: childProps } = children || {};
  if (childProps && childProps.hasOwnProperty('value') && childProps.value === '') {
    return null;
  }
  return children;
};

CouponCode.propTypes = {
  children: PropTypes.node,
};

CouponCode.defaultProps = {
  children: null,
};

export default CouponCode;
