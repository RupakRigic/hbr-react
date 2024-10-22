import React from 'react';
import './SubscriptionPlan.css';

const SubscriptionPlan = () => {
    return (
        <div className="subscription-container">
            <h1>Choose Your Subscription Plan</h1>
            <div className="card-container">
                <div className="subscription-card">
                    <h2>Basic</h2>
                    <p>Price: Free</p>
                    <div className="features">
                        <p>Features:</p>
                        <ul>
                            <li>Access to basic features</li>
                            <li>Community support</li>
                        </ul>
                    </div>
                    <button className='subscribe-btn'>Subscribe</button>
                </div>
                <div className="subscription-card">
                    <h2>Standard</h2>
                    <p>Price: $9.99/month</p>
                    <div className="features">
                        <p>Features:</p>
                        <ul>
                            <li>Access to all basic features</li>
                            <li>Priority support</li>
                            <li>Access to exclusive content</li>
                        </ul>
                    </div>
                    <button className='subscribe-btn'>Subscribe</button>
                </div>
                <div className="subscription-card">
                    <h2>Premium</h2>
                    <p>Price: $19.99/month</p>
                    <div className="features">
                        <p>Features:</p>
                        <ul>
                            <li>Access to all features</li>
                            <li>24/7 support</li>
                            <li>Personalized content</li>
                        </ul>
                    </div>
                    <button className='subscribe-btn'>Subscribe</button>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionPlan;
