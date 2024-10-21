import React from 'react';
import './SubscriptionPlan.css';
// import { loadStripe } from '@stripe/stripe-js';
// import axios from "axios";

const SubscriptionPlan = () => {

    // const MakePayment = async() => {
    //     const stripe = await loadStripe("..........Publish_Key...........");

    //     const reportdata = {
    //         products: "..........Data in array........."
    //     }
    //     // const headers = {
    //     //     "Content-Type":"application/json"
    //     // }
    //     // const response = await fetch("api/admin/......", {
    //     //     method:"POST",
    //     //     headers:headers,
    //     //     body:JSON.stringify(body)
    //     // });
    //     const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
    //     const response = await axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/...........`,
    //         reportdata,
    //         {
    //             responseType: "arraybuffer",
    //             headers: {
    //                 "Content-Type":"application/json",
    //                 Accept: "application/json",
    //                 Authorization: `Bearer ${bearerToken}`,
    //             },
    //           }
    //         );

    //     const session = await response.json();

    //     const result = stripe.redirectToCheckout({
    //         sessionId:session.id
    //     });

    //     if(result.error) {
    //         console.log(result.error);
            
    //     }
    // };

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
