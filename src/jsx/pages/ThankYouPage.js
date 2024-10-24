import React from 'react';

const ThankYouPage = () => {
    const handleSubcriptionPlan = async () => {
        if (window.opener) {
            window.opener.location.href = "/subscriptionplan";
            window.close();
        } else {
            window.location.href = "/subscriptionplan";
        }
    };
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Transaction Successful!</h1>
            <p style={styles.paragraph}>
                Your transaction has been processed successfully. Thank you for your payment!
            </p>
            <button className='subscribe-btn' onClick={handleSubcriptionPlan}>Go Back</button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '50px',
        fontFamily: 'Arial, sans-serif'
    },
    heading: {
        fontSize: '36px',
        color: '#4CAF50'
    },
    paragraph: {
        fontSize: '18px',
        margin: '20px 0'
    },
    link: {
        textDecoration: 'none',
        color: '#4CAF50',
        fontSize: '16px'
    }
};

export default ThankYouPage;