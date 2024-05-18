import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from "sweetalert";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import RechartJs from "../../components/charts/rechart";
import MainPagetitle from '../../layouts/MainPagetitle';
import './WeeklyData.css'
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import { Form } from "react-bootstrap";

const BuilderTable = () => {
    const [Error, setError] = useState('');
    var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL
    const [weekEndDates, setWeekEndDates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
   
    const navigate = useNavigate();
    const [selectedEndDate,setSelectedEndDate] = useState();
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            getWeekEndDate()
        }
        else {
            navigate('/');
        }

    }, [])
    const handleSelectChange=(event)=>{
        setSelectedEndDate(event.target.value);
        localStorage.setItem('enddate', event.target.value);
        
    }
    const getWeekEndDate = async () => {
        try {
            let responseData = await AdminWeeklyDataService.getdate().json()
            setWeekEndDates(responseData.dates)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    const handleBuilderCode = code => {
        
        setBuilderCode(code.target.value);
        console.log(code.target.value);
        localStorage.setItem('builderId',code.target.value);

    }
    const [BuilderList, setBuilderList] = useState([]);
    const [BuilderCode, setBuilderCode] = useState('');
    
    const getbuilderlist = async () => {
    
      try {
    
          const response = await AdminBuilderService.index();
          const responseData = await response.json();
          setBuilderList(responseData.data)
    
      } catch (error) {
          console.log(error)
          if (error.name === 'HTTPError') {
              const errorJson = await error.response.json();
    
              setError(errorJson.message)
          }
      }
    }
    useEffect(() => {
      getbuilderlist();
    }, [])
    return (
        <>
            <MainPagetitle mainTitle="Data Reporting" pageTitle="Data Reporting" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card weekly-card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-center text-wrap align-items-center">
                                        <h4 className="heading mb-0">Enter Data Reporting</h4>
                                    </div> 
                                   <div className='dataTables_wrapper no-footer'>
                                    <p className='text-center'>Select Week ending date and click continue</p>
                                    <div className="d-flex justify-content-center mb-5">
                                    <select onChange={handleSelectChange}>
                                    { weekEndDates && weekEndDates.map((item) =>
                                       
                                        <option>{item}</option>
                                    )}
                                    </select>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                    <select onChange={handleBuilderCode}>
                                    { BuilderList && BuilderList.map((element) =>
                                       
                                       <option value={element.id}>{element.name}</option>
                                    )}
                                    </select>
                                    </div>
                                    <Link className='mt-4' to={"/weekly-data-index"}>Continue</Link>
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

export default BuilderTable;
