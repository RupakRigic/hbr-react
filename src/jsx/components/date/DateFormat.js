import React from 'react';

const DateComponent = ({ date }) => {
  // Check if the date prop is empty or not a valid date
  if (!date || isNaN(new Date(date).getTime())) {
    return <span></span>;
  }

  // Create a new Date object in UTC to avoid timezone conversion issues
  const utcDate = new Date(date);
  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = utcDate.getUTCMonth() + 1; // Months are 0-indexed, so add 1
  const utcDay = utcDate.getUTCDate();

  // Format the date as MM/DD/YYYY
  //  const formattedDate = new Intl.DateTimeFormat('en-US', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit'
  // }).format(new Date(date));
  const formattedDate = `${String(utcMonth).padStart(2, '0')}/${String(utcDay).padStart(2, '0')}/${utcYear}`;

  return <span>{formattedDate}</span>;
};

export default DateComponent;
