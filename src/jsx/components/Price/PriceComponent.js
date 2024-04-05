import React from 'react';

const PriceComponent = ({ price }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

  return <span>{formattedPrice}</span>;
};

export default PriceComponent;