import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate , useSearchParams} from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";

const WeeklyDataOffcanvas = forwardRef((props, ref) => {

    const [BuilderCode, setBuilderCode] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [Error, setError] = useState('');
    const [addSubdivision, setAddSubdivision] = useState(false);
    const [BuilderList, setBuilderList] = useState([]);
    const getbuilderlist = async () => {
        try {
            let responseData = await AdminSubdevisionService.index().json()
            setBuilderList(responseData.data)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        getbuilderlist();
    }, [])

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddSubdivision(true)
        }
    }));
    const nav = useNavigate();
    const handleBuilderCode = code => {
        setBuilderCode(code.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (localStorage.getItem('enddate')) {
            var enddate=localStorage.getItem('enddate');
        }else{
            var enddate='2024-01-01'
        }
        try {
            var userData = {
                "subdivision_id":BuilderCode,
                'week_ending_date':enddate,
                "status": event.target.status.value,
                "weekly_traffic": event.target.weekly_traffic.value,
                "gross_sales": event.target.gross_sales.value,
                "cancelations": event.target.cancelations.value ? event.target.cancelations.value : '',
                "current_lots_released": event.target.current_lots_released.value ? event.target.current_lots_released.value : '',
                "current_un_sold_standing_inventory": event.target.current_un_sold_standing_inventory.value ? event.target.current_un_sold_standing_inventory.value : '',
            }
            const data = await AdminWeeklyDataService.store(userData).json();
            if (data.status === true) {
                setAddSubdivision(false)
                props.parentCallback();
            }
            else {
                var error;
                if (error.name === 'HTTPError') {
                    const errorJson = await error.response.json();
                    setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                }
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
            }
        }
    }
    return (
        <>
            <Offcanvas show={addSubdivision} onHide={setAddSubdivision} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddSubdivision(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-12 mb-3">
                                    <label className="form-label">Subdivision Code <span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={handleBuilderCode}
                                            value={BuilderCode}
                                            className="default-select form-control"
                                            name="subdivision_id"
                                        >
                                            <option value=''>Select Subdivision</option>
                                            {
                                                BuilderList.map((element) => (
                                                    <option value={element.id}>{element.subdivision_code}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Status <span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            className="default-select form-control"
                                            name="status"
                                        >
                                            <option value='1'>True</option>
                                            <option value='0'>False</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Weekly Traffic <span className="text-danger">*</span></label>
                                    <input type="number" name='weekly_traffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales <span className="text-danger">*</span></label>
                                    <input type="number" name='gross_sales' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Cancelations <span className="text-danger">*</span></label>
                                    <input type="number" name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Current Lots Released <span className="text-danger"></span></label>
                                    <input type="number" name='current_lots_released' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Current Un Sold Standing Inventory<span className="text-danger"></span></label>
                                    <input type="number" name='current_un_sold_standing_inventory' className="form-control" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => setAddSubdivision(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default WeeklyDataOffcanvas;