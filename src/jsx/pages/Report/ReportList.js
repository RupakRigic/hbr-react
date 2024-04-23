import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import swal from "sweetalert";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import MainPagetitle from '../../layouts/MainPagetitle';
import AdminReportService from '../../../API/Services/AdminService/AdminReportService';
import axios from 'axios';
const ReportList = () => {
    const location = useLocation();
    const [Error, setError] = useState('');
    const navigate = useNavigate();
    const [reportList, setReportList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = reportList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(reportList.length / recordsPage)
    const number = [...Array(npage + 1).keys()].slice(1)
    const [pdfUrl, setPdfUrl] = useState('');

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

    const subdivision = useRef();

    const getreportlist = async () => {

        try {

            let responseData = await AdminReportService.reportList().json()
            setReportList(responseData.data)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {

            getreportlist();

        }
        else {
            navigate('/');
        }

       
    }, [])


    const handleDelete = async (e) => {
        try {
            let responseData = await AdminReportService.destroy(e).json()
            if (responseData.status === true) {
                getreportlist();
            }

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }
    const handleCallback = () => {
        // Update the name in the component's state
        getreportlist()

    }

    const handleExport = async (e) => {
       let startDate = localStorage.getItem('start_date')
       let endDate = localStorage.getItem('end_date')
       let reportType = localStorage.getItem('report_type')
        const reportdata = {
            type: reportType,
            start_date: startDate,
            end_date: endDate,
        };
        const bearerToken =  JSON.parse(localStorage.getItem('usertoken'));
        console.log(bearerToken)
        try {

            const response = await axios.post(
                `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`
                // 'https://hbrapi.rigicgspl.com/api/admin/report/export-reports'
                ,reportdata, {
            responseType: 'arraybuffer', 
            headers: {
                  'Accept': 'application/pdf', // Set Accept header to indicate that we expect a PDF response
                  'Authorization': `Bearer ${bearerToken}`
    
                }
              });
              handlePdfResponse(response);
        } catch (error) {
            console.log(error);
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }

    const handlePdfResponse = (response) => {
        console.log(response.data);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
    }
    return (
        <>
            <MainPagetitle mainTitle="Report" pageTitle="Report" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <h4 className="heading mb-0">
                                        {
                                        localStorage.getItem('start_date')+ ' To '
                                        + localStorage.getItem('end_date')
                                        }
                                        </h4>
                                        <a onClick={handleExport} className='btn btn-primary btn-sm'>
                                            Export
                                        </a>
                                    </div>
                                    <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                                        <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr style={{ textAlign: 'center' }}>
                                                    <th ></th>
                                                    <th >
                                                        <strong> No. Of Active projects</strong>
                                                    </th>
                                                    <th>
                                                        <strong> Traffic</strong>
                                                    </th>
                                                    <th>
                                                        <strong> Traffic/Project</strong>
                                                    </th>
                                                    <th>
                                                        <strong>New Sales </strong>
                                                    </th>
                                                    <th>
                                                        <strong>Cancellation</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Net Sales</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Net Sales/Project</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Cancellation %</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Conversion Ratio </strong>
                                                    </th>
                                                    <th>
                                                        <strong>Inventory Of Released Lots</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Inventory/Project</strong>
                                                    </th>
                                                    <th>
                                                        <strong>Mos. Of Inventory</strong>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody> 
                                                <tr>
                                                    <td><strong>EAST</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>HENDERSON</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr> 
                                                <tr>
                                                    <td><strong></strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>NORTH LAS VEGAS</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>NORTHWEST</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>PAHRUMP</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong></strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>  
                                                <tr>
                                                    <td><strong>SOUTHWEST</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>TOTALS</strong></td>
                                                    <td><strong>SOUTHWEST</strong></td>
                                                    <td>8</td>
                                                    <td>312</td>
                                                    <td>39</td>
                                                    <td>35</td>
                                                    <td>2</td>
                                                    <td>33</td>
                                                    <td>4.1</td>
                                                    <td>5.7%</td>
                                                    <td>11.2%</td>
                                                    <td>8.9</td>
                                                    <td>50</td>
                                                    <td>6</td>
                                                    <td>1.5</td>
                                                </tr>     
                                            </tbody>

                                        </table>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center">
                                            <div className='dataTables_info'>
                                                Showing {lastIndex - recordsPage + 1} to{" "}
                                                {reportList.length < lastIndex ? reportList.length : lastIndex}
                                                {" "}of {reportList.length} entries
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
           
        </>
    );
};

export default ReportList;
