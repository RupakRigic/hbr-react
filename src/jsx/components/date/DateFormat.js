import React from 'react';

const DateComponent = ({ date }) => {
  // Check if the date prop is empty or not a valid date
  if (!date || isNaN(new Date(date).getTime())) {
    return <span></span>;
  }

  // Formatting date as MM/DD/YYYY using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));

  return <span>{formattedDate}</span>;
};

export default DateComponent;
