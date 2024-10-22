import React, { useEffect, useState } from 'react';
import './SubscriptionPlan.css';
import AdminSubscriberService from '../../../API/Services/AdminService/AdminSubscriberService';
import ClipLoader from 'react-spinners/ClipLoader';
import PriceComponent from '../../components/Price/PriceComponent';

const SubscriptionPlan = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionList, setSubscriptionList] = useState([]);

    useEffect(() => {
        GetSubscriberList();
    }, []);

    const GetSubscriberList = async () => {
        debugger
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.getSubscriberList();
            const responseData = await response.json();
            setSubscriptionList(responseData.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    return (
        <div className="subscription-container">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center mb-5">
                    <ClipLoader color="#4474fc" />
                </div>
            ) : (
                <>
                    <h1>Choose Your Subscription Plan</h1>
                    <div className="card-container">
                        {subscriptionList.length > 0 && subscriptionList.map((data) => (
                            <div className="subscription-card">
                                <h2>{data.title}</h2>
                                <p>Price: {<PriceComponent price={data.price} />}</p>
                                <div className="features">
                                    <p>Content:</p>
                                    <ul>
                                        <li>{data.content}</li>
                                    </ul>
                                </div>
                                <button className='subscribe-btn'>Subscribe</button>
                            </div>
                        ))}
                    </div>
                </>)}
        </div>
    );
}

export default SubscriptionPlan;
