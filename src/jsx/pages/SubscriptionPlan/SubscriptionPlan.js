import React, { useEffect, useState } from 'react';
import './SubscriptionPlan.css';
import AdminSubscriberService from '../../../API/Services/AdminService/AdminSubscriberService';
import ClipLoader from 'react-spinners/ClipLoader';
import PriceComponent from '../../components/Price/PriceComponent';
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom';
import DateComponent from '../../components/date/DateFormat';

const SubscriptionPlan = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(localStorage.getItem("subscriptionActivePlan") ? localStorage.getItem("subscriptionActivePlan") : false);
    console.log("subscriptionActivePlan", activePlan);
    
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState([]);
    
    const [isSubscribed, setIsSubscribed] = useState(localStorage.getItem("is_subscribed") ? JSON.parse(localStorage.getItem("is_subscribed")) : "");

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetSubscriptionList();
            GetActivePlanDetails();
        } else{
            navigate("/");
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

    const GetActivePlanDetails = async() => {
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.getActiveSubscriptionPlan();
            const responseData = await response.json();
            if (responseData.status === true) {
                setActiveSubscriptionPlan(responseData.data);
                setActivePlan(true);
                localStorage.setItem("subscriptionActivePlan", true);
                localStorage.setItem("is_subscribed", 1);
                setIsLoading(false);
            } else {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        setActivePlan(false);
                        localStorage.removeItem("subscriptionActivePlan");
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

    const handleBack = () => {
        navigate("/subscriptionlist");
    };

    const HandleCancelSubscription = async(Id) => {
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.subscribCancel(Id);
            const responseData = await response.json();
            if (responseData.status === true) {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        setIsLoading(false);
                        GetSubscriptionList();
                        GetActivePlanDetails();
                    }
                });
            } else {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        setIsLoading(false);
                        GetSubscriptionList();
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
                    {activePlan &&
                    <div className="profile-detail d-flex">
                        <div className="profile-info">
                            <div style={{ color: "black" }}>You have subscribed <b>{activeSubscriptionPlan.subscription_title}</b></div>&nbsp;
                            <div style={{ color: "black" }}>, Active till <b><DateComponent date={activeSubscriptionPlan.subscription_end_at} /></b></div>&nbsp;
                            {activeSubscriptionPlan.subscription_cancelled_at != null && <div style={{ color: "black" }}>You have intiated request to cancel this plan. It will be cancelled on - <b><DateComponent date={activeSubscriptionPlan.subscription_cancelled_at} /></b></div>}
                        </div>
                        {activeSubscriptionPlan.subscription_cancelled_at == null && <div className="close-button">
                            <button
                                className="btn btn-primary"
                                aria-label="Close"
                                onClick={() => HandleCancelSubscription(activeSubscriptionPlan?.id)}
                                style={{ height: "30px", paddingTop: "5px" }}
                            > Cancel Subscription</button>
                        </div>}
                    </div>}
                    <div className="card-container">
                        {subscriptionList.length > 0 && subscriptionList.map((data) => (
                            <div className="subscription-card">
                                <h2>{data.title}</h2>
                                <p style={{ color: "black" }}>Price: {<PriceComponent price={data.price} />}</p>
                                <div className="features">
                                    <ul>
                                        <li style={{ color: "black" }}>{data.content}</li>
                                    </ul>
                                </div>
                                &nbsp;
                                <button className='subscribe-btn' onClick={() => handleSubcriptionPlan(data.price_id)}>Subscribe</button>
                            </div>
                        ))}
                    </div>
                    {(isSubscribed == 1 || activeSubscriptionPlan?.id != null) && <div style={{marginTop: "30px"}}>
                        <button className="btn btn-primary btn-sm me-1" onClick={handleBack}>
                            Go Back
                        </button>
                    </div>}
                </>
            )}
        </div>
    );
}

export default SubscriptionPlan;
