import React, { useEffect, useState } from 'react';
import './SubscriptionPlan.css';
import AdminSubscriberService from '../../../API/Services/AdminService/AdminSubscriberService';
import ClipLoader from 'react-spinners/ClipLoader';
import PriceComponent from '../../components/Price/PriceComponent';
import swal from "sweetalert";

const SubscriptionPlan = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionList, setSubscriptionList] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetSubscriptionList();
        }
    }, []);

    const GetSubscriptionList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.getSubscriptionPlanList();
            const responseData = await response.json();
            if (responseData.status === true) {
                setSubscriptionList(responseData.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const handleSubcriptionPlan = async (price_id) => {
        setIsLoading(true);
        try {
            var userData = {
                plan_price_id: price_id
            }
            const response = await AdminSubscriberService.subscribPaln(userData);
            const responseData = await response.json();
            if (responseData.status === true) {
                window.open(responseData.url, '_blank');
                setIsLoading(false);
            } else {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        GetSubscriptionList();
                        setIsLoading(false);
                    }
                });
            }
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
                                <p style={{ color: "black" }}>Price: {<PriceComponent price={data.price} />}</p>
                                <div className="features">
                                    <p style={{ color: "black" }}>Content:</p>
                                    <ul>
                                        <li style={{ color: "black" }}>{data.content}</li>
                                    </ul>
                                </div>
                                &nbsp;
                                <button className='subscribe-btn' onClick={() => handleSubcriptionPlan(data.price_id)}>Subscribe</button>
                            </div>
                        ))}
                    </div>
                </>)}
        </div>
    );
}

export default SubscriptionPlan;
