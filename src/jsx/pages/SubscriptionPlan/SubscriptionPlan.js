import React, { Fragment, useEffect, useState } from 'react';
import './SubscriptionPlan.css';
import AdminSubscriberService from '../../../API/Services/AdminService/AdminSubscriberService';
import ClipLoader from 'react-spinners/ClipLoader';
import PriceComponent from '../../components/Price/PriceComponent';
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom';
import DateComponent from '../../components/date/DateFormat';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { MultiSelect } from 'react-multi-select-component';

const SubscriptionPlan = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(localStorage.getItem("subscriptionActivePlan") ? localStorage.getItem("subscriptionActivePlan") : false);

    const [isSubscribed, setIsSubscribed] = useState(localStorage.getItem("is_subscribed") ? JSON.parse(localStorage.getItem("is_subscribed")) : "");
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [subscriptionDataTypeList, setSubscriptionDataTypeList] = useState([]);
    const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [numberOfSeat, setNumberOfSeat] = useState("");
    const [dataTypeLimit, setDataTypeLimit] = useState("");
    const [dataTypeLimitMessage, setDataTypeLimitMessage] = useState("");
    const [planID, setPlanID] = useState("");

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetSubscriptionList();
            GetSubscriptionDataType();
            GetActivePlanDetails();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        setSelectedOptions([]);
        setDataTypeLimitMessage("");
    }, [dataTypeLimit]);

    const GetSubscriptionList = async () => {
        setIsLoading(true);
        try {
            const responseData = await AdminSubscriberService.getSubscriptionPlanList().json();
            if (responseData.status === true) {
                setSubscriptionList(responseData.data);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
            }
        }
    };

    const GetSubscriptionDataType = async () => {
        setIsLoading(true);
        try {
            const responseData = await AdminSubscriberService.getSubscriptionDataType().json();
            if (responseData.status === true) {
                const subscriptionDataTypeList = responseData.data.map(item => ({
                    label: item.title,
                    value: item.id
                }));
                setSubscriptionDataTypeList(subscriptionDataTypeList);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
            }
        }
    };

    const GetActivePlanDetails = async () => {
        setIsLoading(true);
        const subscription_end_at = JSON.parse(localStorage.getItem("subscription_end_at"));
        const subscriptionEndDate = new Date(subscription_end_at);
        const currentDate = new Date();
        if (currentDate >= subscriptionEndDate) {
            setActivePlan(false);
            setIsSubscribed(0);
            setIsLoading(false);
            swal("No Active Subscription found");
            return
        }
        try {
            const responseData = await AdminSubscriberService.getActiveSubscriptionPlan().json();
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
            setIsLoading(false);
            if (error.name === "HTTPError") {
            }
        }
    };

    const handleSubcriptionPlan = (id, login_limit, data_type_limit) => {
        setShowModal(!showModal);
        setPlanID(id);
        setNumberOfSeat(login_limit);
        setDataTypeLimit(data_type_limit);
    };

    const handleSubscribeConfirm = async () => {
        setIsLoading(true);
        try {
            let DataType = selectedOptions.map(option => String(option.value))
            var userData = {
                payment_period:planFrequency,
                plan_id: planID,
                seats: numberOfSeat,
                data_types: DataType
            }

            const responseData = await AdminSubscriberService.subscribPaln(userData).json();
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
            setIsLoading(false);
            if (error.name === "HTTPError") {
            }
        }
    };

    const handleBack = () => {
        navigate("/subscriptionlist");
    };

    const HandleCancelSubscription = async (Id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminSubscriberService.subscribCancel(Id).json();
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
            setIsLoading(false);
            if (error.name === "HTTPError") {
            }
        }
    };

    const handleSelectDataTypeChange = (selectedItems) => {
        if (selectedItems.length > dataTypeLimit) {
            setDataTypeLimitMessage(`You can only select up to ${dataTypeLimit} data type(s).`);
            return;
        } else {
            setSelectedOptions(selectedItems);
            setDataTypeLimitMessage("");
        }
    };

    const handleNumberofSeatChange = (seat) => {
        setNumberOfSeat(seat);
    };

    const [planFrequency, setPlanFreQuency] = useState('monthly');
    const handleFrequencyChange=(e)=>{
        setPlanFreQuency(e.target.value);
    }

    return (
        <Fragment>
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
                                {activeSubscriptionPlan.subscription_status == "active" ? 
                                    <div className="profile-info">
                                        <div style={{ color: "black" }}>You have subscribed <b>{activeSubscriptionPlan?.subscription?.title}</b></div>&nbsp;
                                        <div style={{ color: "black" }}>, Active till <b><DateComponent date={activeSubscriptionPlan.subscription_end_at} /></b></div>&nbsp;
                                        {activeSubscriptionPlan.subscription_cancelled_at != null && <div style={{ color: "black" }}>You have intiated request to cancel this plan. It will be cancelled on - <b><DateComponent date={activeSubscriptionPlan.subscription_cancelled_at} /></b></div>}
                                    </div>
                                    : 
                                    <div className="profile-info">
                                        <div style={{ color: "black" }}><b>Your subscription has been created but it is still in progress. Please check after a while or contact to administrator.</b></div>&nbsp;
                                    </div>
                                }
                                
                                {activeSubscriptionPlan.subscription_cancelled_at == null && activeSubscriptionPlan.subscription_status == "active" && <div className="close-button">
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
                                <div className="subscription-card" key={data.id}>
                                    <h2 style={{ textAlign: "left" }}>{data.title}</h2>
                                    <h4 style={{ color: "black", fontWeight: "bold", textAlign: "left" }}>Price: <PriceComponent price={data.price} />/month</h4>
                                    <h4 style={{ color: "black", fontWeight: "bold", textAlign: "left" }}>Price: <PriceComponent price={data.price * 11} />/Year</h4>

                                    <div className="features">
                                        <ul>
                                            {data.content.split(',').map((item, index) => (
                                                <li key={index} style={{ color: "black", textAlign: "left" }}>
                                                    <div className='d-flex'>
                                                        <div>
                                                            <i
                                                                className="fa-solid fa-check"
                                                                style={{
                                                                    color: "green",
                                                                    fontSize: "12px",
                                                                    marginRight: "8px"
                                                                }}
                                                            />
                                                        </div>
                                                        <div>{item.trim()}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button className='subscribe-btn' style={{ marginTop: "10px" }} onClick={() => handleSubcriptionPlan(data.id, data.login_limit, data.data_type_limit)}>Subscribe</button>
                                </div>
                            ))}
                        </div>
                        {(isSubscribed == 1 || activeSubscriptionPlan?.id != null || activePlan) && <div style={{ marginTop: "30px" }}>
                            <button className="btn btn-primary btn-sm me-1" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>}
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal &&
                <Modal show={showModal} onHide={() => setShowModal(true)}>
                    <Modal.Header>
                        <Modal.Title>Choose Data Types</Modal.Title>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </Modal.Header>
                    <Modal.Body>
                        {dataTypeLimitMessage && <div style={{ color: "red", padding: "5px" }}>{dataTypeLimitMessage}</div>}
                        <div className="row">
                        <div className="col-md-6 mt-3 w-100">
                            <div className='d-flex justify-content-start'>
                                <div className='me-5'>
                                <label className="form-label me-3">Monthly</label>
                                <input
                                    type="radio"
                                    value="monthly"
                                    name="plan_frequency"
                                    defaultChecked={true}
                                    onChange={handleFrequencyChange}

                                />
                                </div>
                                <div>
                                <label className="form-label me-3">Yearly</label>
                                <input
                                    type="radio"
                                    value="yearly"
                                    name="plan_frequency"
                                    onChange={handleFrequencyChange}
                                />
                                </div>
                         
                            </div>
                            </div>
                            <div className="col-md-6 mt-3 w-100">
                                <label className="form-label">Number of Seat:</label>
                                <input
                                    type="number"
                                    value={numberOfSeat}
                                    name="number_of_seat"
                                    className="form-control"
                                    onChange={handleNumberofSeatChange}
                                />
                            </div>
                            <div className="col-md-6 mt-3 w-100">
                                <label className="form-label">Select Data Type:</label>
                                <MultiSelect
                                    name="data_type"
                                    options={subscriptionDataTypeList}
                                    value={selectedOptions}
                                    onChange={handleSelectDataTypeChange}
                                    isOptionDisabled={() => selectedOptions.length >= dataTypeLimit}
                                    placeholder="Select data types..."
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(!showModal)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubscribeConfirm}>
                            Confirm Subscription
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </Fragment>
    );
};

export default SubscriptionPlan;
