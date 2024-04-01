import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from "sweetalert";
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import WeeklyDataOffcanvas from "./WeeklyDataOffcanvas";

import MainPagetitle from '../../layouts/MainPagetitle';
const WeeklyDataIndex = () => {
    const [Error, setError] = useState('');
    const [BuilderList, setBuilderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = BuilderList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(BuilderList.length / recordsPage)
    const number = [...Array(npage + 1).keys()].slice(1);
    const subdivision = useRef();
    const handleCallback = () => {
        getWeeklyList()
    }
    const navigate = useNavigate();
    function prePage() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage(id) {
        setCurrentPage(id);
    }
    function nextPage() {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1)
        }
    }
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            getWeeklyList()
        }
        else {
            navigate('/');
        }

    }, []);
    const getWeeklyList = async () => {
        try {
            let responseData = await AdminWeeklyDataService.index().json()
            setBuilderList(responseData.data)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    const handleDelete = async (e) => {
        try {
            let responseData = await AdminWeeklyDataService.destroy(e).json()
            if (responseData.status === true) {
                getWeeklyList();
            }
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }
    return (
        <>
           <MainPagetitle mainTitle="Weekly Data" pageTitle="Weekly Data" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <h4 className="heading mb-0">Weekly Data List</h4>
                                        <div>

                                            <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                                                onClick={() => subdivision.current.showEmployeModal()}
                                            >+ Add Weekly Data</Link>

                                        </div>
                                    </div>
                                    <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                                        <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr style={{ textAlign: 'center' }}>
                                                    <th >
                                                        <strong> Week Ending</strong>
                                                    </th>
                                                    <th>
                                                        <strong> Status</strong>
                                                    </th>
                                                    <th>
                                                        <strong>  Subdivision</strong>
                                                    </th>
                                                    <th>
                                                        <strong> Weekly Traffic </strong>
                                                    </th>
                                                    <th>
                                                        <strong> Gross Sales </strong>
                                                    </th>
                                                    <th>
                                                        <strong> - </strong>
                                                    </th>
                                                    <th>
                                                        <strong> cancelations </strong>
                                                    </th>
                                                    <th>
                                                        <strong> = </strong>
                                                    </th>
                                                    <th>
                                                        <strong> Net Sales</strong>
                                                    </th>
                                                    <th>
                                                        <strong> Current Lots Released </strong>
                                                    </th>
                                                    <th>
                                                        <strong> Current Unsold Standing Inventory</strong>
                                                    </th>
                                                    <th> <strong> Action </strong>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'center' }}>

                                                {
                                                    records.map((element, index) => {

                                                        return (
                                                            <tr style={{ textAlign: 'center' }}>
                                                                <td>
                                                                    {element.week_ending_date}
                                                                </td>
                                                                <td>
                                                                    {element.status}

                                                                </td>
                                                                <td>
                                                                    {element.subdivision_id}
                                                                </td>
                                                                <td>{element.weekly_traffic}</td>
                                                                <td>{element.gross_sales}</td>
                                                                <td></td>
                                                                <td>{element.cancelations}</td>
                                                                <td></td>
                                                                <td>{element.gross_sales-element.cancelations}</td>
                                                                <td>{element.current_lots_released}</td>
                                                                <td>{element.current_un_sold_standing_inventory}</td>
                                                                <td style={{ textAlign: 'center' }}>
                                                                    <div>
                                                                        <Link
                                                                            onClick={() =>
                                                                                swal({
                                                                                    title: "Are you sure?",

                                                                                    icon: "warning",
                                                                                    buttons: true,
                                                                                    dangerMode: true,
                                                                                }).then((willDelete) => {
                                                                                    if (willDelete) {
                                                                                        (handleDelete(element.id));
                                                                                    }
                                                                                })
                                                                            }

                                                                            className="btn btn-danger shadow btn-xs sharp"
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </tbody>

                                        </table>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center">
                                            <div className='dataTables_info'>
                                                Showing {lastIndex - recordsPage + 1} to{" "}
                                                {BuilderList.length < lastIndex ? BuilderList.length : lastIndex}
                                                {" "}of {BuilderList.length} entries
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
                                                    {number.map((n, i) => (
                                                        <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
                                                            onClick={() => changeCPage(n)}
                                                        >
                                                            {n}

                                                        </Link>
                                                    ))}
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
                </div>
            </div>
            <WeeklyDataOffcanvas
                ref={subdivision}
                Title="Add Subdivision"
                parentCallback={handleCallback}
            />
        </>
    );
};

export default WeeklyDataIndex;
