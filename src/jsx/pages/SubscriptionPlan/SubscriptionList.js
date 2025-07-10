import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainPagetitle from '../../layouts/MainPagetitle';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminSubscriberService from '../../../API/Services/AdminService/AdminSubscriberService';
import PriceComponent from '../../components/Price/PriceComponent';
import swal from "sweetalert";
import DateComponent from '../../components/date/DateFormat';

const SubscriptionList = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 100;
    const lastIndex = currentPage * recordsPage;
    const [npage, setNpage] = useState(0);
    const number = [...Array(npage + 1).keys()].slice(1);
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [subscriptionListCount, setSubscriptionListCount] = useState("");

    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changeCPage = (id) => {
        setCurrentPage(id);
    };

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const is_subscribed = JSON.parse(localStorage.getItem("is_subscribed"));
        const subscription_end_at = JSON.parse(localStorage.getItem("subscription_end_at"));
        
        if (localStorage.getItem("usertoken")) {
            if (is_subscribed == 1) {
                const subscriptionEndDate = new Date(subscription_end_at);
                const currentDate = new Date();
                if (currentDate >= subscriptionEndDate) { 
                    navigate("/subscriptionplan");
                } else {
                    GetSubscriptionList();
                }
            } else {
                navigate("/subscriptionplan");
            }
        } else {
            navigate("/");
        }
    }, [currentPage]);

    const GetSubscriptionList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.getSubscriptionList();
            const responseData = await response.json();
            if (responseData.status === true) {
                setSubscriptionList(responseData.data);
                setNpage(Math.ceil(responseData.data.length / recordsPage));
                setSubscriptionListCount(responseData.data.length);
                setIsLoading(false);
            } else {
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

    const handleSubscribePLan = () => {
        navigate("/subscriptionplan");
    };

    const HandleCancelSubscriptionList = async(Id) => {
        setIsLoading(true);
        try {
            const response = await AdminSubscriberService.subscribCancel(Id);
            const responseData = await response.json();
            if (responseData.status === true) {
                GetSubscriptionList();
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
        <Fragment>
            <MainPagetitle mainTitle="Subscription List" pageTitle="Subscription List" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                                        <div className="d-flex text-nowrap justify-content-between align-items-center">
                                            <h4 className="heading mb-0">Subscription List</h4>
                                        </div>
                                        {SyestemUserRole == "Data Uploader" || SyestemUserRole == "Tester" || SyestemUserRole == "User" || SyestemUserRole == "Standard User" ?
                                            <div className="d-flex justify-content-between">
                                                <button 
                                                    className="btn btn-success btn-sm me-1" 
                                                    style={{
                                                        color: "white", 
                                                        fontWeight: "bolder", 
                                                        background: "black", 
                                                        border: "none"
                                                    }} 
                                                    onClick={handleSubscribePLan} 
                                                    title="Subscription Plan"
                                                >
                                                    Subscription Plan
                                                </button>
                                            </div> 
                                            : (
                                                ("")
                                            )
                                        }
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {subscriptionListCount} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                to="#"
                                                onClick={prePage}
                                            >
                                                <i className="fa-solid fa-angle-left" />
                                            </Link>
                                            <span>
                                                {number.map((n, i) => {
                                                    if (number.length > 4) {
                                                        if (
                                                            i === 0 ||
                                                            i === number.length - 1 ||
                                                            Math.abs(currentPage - n) <= 1 ||
                                                            (i === 1 && n === 2) ||
                                                            (i === number.length - 2 &&
                                                                n === number.length - 1)
                                                        ) {
                                                            return (
                                                                <Link
                                                                    className={`paginate_button ${currentPage === n ? "current" : ""
                                                                        } `}
                                                                    key={i}
                                                                    onClick={() => changeCPage(n)}
                                                                >
                                                                    {n}
                                                                </Link>
                                                            );
                                                        } else if (i === 1 || i === number.length - 2) {
                                                            return <span key={i}>...</span>;
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return (
                                                            <Link
                                                                className={`paginate_button ${currentPage === n ? "current" : ""
                                                                    } `}
                                                                key={i}
                                                                onClick={() => changeCPage(n)}
                                                            >
                                                                {n}
                                                            </Link>
                                                        );
                                                    }
                                                })}
                                            </span>

                                            <Link
                                                className="paginate_button next"
                                                to="#"
                                                onClick={nextPage}
                                            >
                                                <i className="fa-solid fa-angle-right" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div
                                        id="employee-tbl_wrapper"
                                        className="dataTables_wrapper no-footer"
                                    >
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center mb-5">
                                                <ClipLoader color="#4474fc" />
                                            </div>
                                        ) : (
                                            <table
                                                id="empoloyees-tblwrapper"
                                                className="table ItemsCheckboxSec dataTable no-footer mb-0 subscriber-table"
                                            >
                                                <thead>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <th>No.</th>
                                                        <th>Name</th>
                                                        <th>Last Name</th>
                                                        <th>Email</th>
                                                        <th>Subscription Title</th>
                                                        <th>Subscription Type</th>
                                                        <th>Subscription Status</th>
                                                        <th>Subscription Price</th>
                                                        <th>Payment Status</th>
                                                        <th>Subscription Start</th>
                                                        <th>Subscription Renewed</th>
                                                        <th>Subscription Content</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subscriptionList !== null && subscriptionList.length > 0 ? (
                                                        subscriptionList.map((element, index) => (
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td>{index + 1}</td>
                                                                <td>{element.user_name}</td>
                                                                <td>{element.user_last_name}</td>
                                                                <td>{element.user_email}</td>
                                                                <td>{element.subscription.title}</td>
                                                                <td>{element.subscription.type}</td>
                                                                <td>{element.subscription_status}</td>
                                                                <td>{<PriceComponent price={element.price} />}</td>
                                                                <td>{element.payment_status}</td>
                                                                <td><DateComponent date={element.subscription_start_at} /></td>
                                                                <td><DateComponent date={element.subscription_renewed_at} /></td>
                                                                <td>{element.subscription_content}</td>
                                                                <td>
                                                                    <Link
                                                                        onClick={() =>
                                                                            swal({
                                                                                title: "Are you sure?",
                                                                                icon: "warning",
                                                                                buttons: true,
                                                                                dangerMode: true,
                                                                            }).then((willDelete) => {
                                                                                if (willDelete) {
                                                                                    HandleCancelSubscriptionList(element.id);
                                                                                }
                                                                            })
                                                                        }
                                                                        className="btn btn-danger shadow btn-xs sharp"
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))) : (
                                                        <tr>
                                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                                No data found
                                                            </td>
                                                        </tr>)}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                                <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                    <div className="dataTables_info">
                                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                        {subscriptionListCount} entries
                                    </div>
                                    <div
                                        className="dataTables_paginate paging_simple_numbers justify-content-center"
                                        id="example2_paginate"
                                    >
                                        <Link
                                            className="paginate_button previous disabled"
                                            to="#"
                                            onClick={prePage}
                                        >
                                            <i className="fa-solid fa-angle-left" />
                                        </Link>
                                        <span>
                                            {number.map((n, i) => {
                                                if (number.length > 4) {
                                                    if (
                                                        i === 0 ||
                                                        i === number.length - 1 ||
                                                        Math.abs(currentPage - n) <= 1 ||
                                                        (i === 1 && n === 2) ||
                                                        (i === number.length - 2 &&
                                                            n === number.length - 1)
                                                    ) {
                                                        return (
                                                            <Link
                                                                className={`paginate_button ${currentPage === n ? "current" : ""
                                                                    } `}
                                                                key={i}
                                                                onClick={() => changeCPage(n)}
                                                            >
                                                                {n}
                                                            </Link>
                                                        );
                                                    } else if (i === 1 || i === number.length - 2) {
                                                        return <span key={i}>...</span>;
                                                    } else {
                                                        return null;
                                                    }
                                                } else {
                                                    return (
                                                        <Link
                                                            className={`paginate_button ${currentPage === n ? "current" : ""
                                                                } `}
                                                            key={i}
                                                            onClick={() => changeCPage(n)}
                                                        >
                                                            {n}
                                                        </Link>
                                                    );
                                                }
                                            })}
                                        </span>

                                        <Link
                                            className="paginate_button next"
                                            to="#"
                                            onClick={nextPage}
                                        >
                                            <i className="fa-solid fa-angle-right" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SubscriptionList;
