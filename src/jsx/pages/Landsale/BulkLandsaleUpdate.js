import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    // const [selectedLandSales, setSelectedLandSales] = useState(props.selectedLandSales);
    console.log("bulkselectedLandSales",selectedLandSales);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [LandsaleList, SetLandsaleList] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const params = useParams();
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));
    const navigate = useNavigate();

    const getsubdivisionlist = async () => {
        
        try {
          let response = await AdminSubdevisionService.index();
          let responseData = await response.json();
    
          SetSubdivisionList(responseData.data);
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
    
            setError(errorJson.message);
          }
        }
      };
      useEffect(() => {
        getsubdivisionlist();
      }, []);

    // const GetSubdivision = async (id) => {
    //     try {
    //         let responseData1 = await AdminLandsaleService.show(id).json()
    //         SetLandsaleList(responseData1);
    //         const response = await AdminSubdevisionService.index()
    //         const responseData = await response.json()
    //         let getdata = responseData.filter(function (item) {
    //             return item.id === responseData1.subdivision_id;
    //         });
    //         setSubdivisionCode(getdata)
    //         SetSubdivisionList(responseData.data);
    //     } catch (error) {
    //         if (error.name === 'HTTPError') {
    //             const errorJson = await error.response.json();
    //             setError(errorJson.message)
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (localStorage.getItem('usertoken')) {
    //         GetSubdivision(selectedLandSales);
    //     }
    //     else {
    //         navigate('/');
    //     }
    // }, [])



    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    }

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        try {
            var userData = {
                "seller": event.target.seller.value,
                "buyer": event.target.buyer.value,
                "location": event.target.location.value,
                "date": event.target.date.value,
                "parcel": event.target.parcel.value,
                "price": event.target.price.value,
                "typeofunit": event.target.typeofunit.value,
                "priceperunit": event.target.priceperunit.value,
                "noofunit": event.target.noofunit.value,
                "notes": event.target.notes.value,
                "doc": event.target.doc.value,
                "zoning": event.target.zoning.value,
                "lat": event.target.lat.value,
                "lng": event.target.lng.value,
                "area": event.target.area.value,
                "zip": event.target.zip.value,
                "subdivision_id": SubdivisionCode,
            }
            console.log(userData);
            const data = await AdminLandsaleService.bulkupdate(selectedLandSales, userData).json();
            if (data.status === true) {
                swal("Landsale Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
                        navigate('/landsalelist');
                    }
                })
                props.parentCallback();

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
            <Offcanvas show={addProduct} onHide={() => setAddProduct(false)} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddProduct(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Subdivision<span className="text-danger"></span></label>
                                    <Form.Group controlId="tournamentList">

                                        <Form.Select
                                            onChange={(e) => handleSubdivisionCode(e.target.value)}
                                            value={SubdivisionCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Subdivision</option>
                                            {
                                                SubdivisionList.map((element) => (
                                                    <option value={element.id}>{element.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Seller <span className="text-danger">*</span></label>
                                    <input type="text" name='seller' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Buyer <span className="text-danger">*</span></label>
                                    <input type="text" name='buyer' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Location <span className="text-danger">*</span></label>
                                    <input type="text" name='location' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Date <span className="text-danger">*</span></label>
                                    <input type="date" name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Parcel <span className="text-danger"></span></label>
                                    <input type="number" name='parcel' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Price <span className="text-danger"></span></label>
                                    <input type="number" name='price' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Type of Unit<span className="text-danger"></span></label>
                                    <input type="text" name='typeofunit' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Price Per Unit<span className="text-danger"></span></label>
                                    <input type="number" name='priceperunit' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">No. Of Unit<span className="text-danger"></span></label>
                                    <input type="number" name='noofunit' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput16" className="form-label">Notes<span className="text-danger"></span></label>
                                    <input type="text" name='notes' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Doc<span className="text-danger"></span></label>
                                    <input type="text" name='doc' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Zoning<span className="text-danger"></span></label>
                                    <input type="text" name='zoning' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Latitude<span className="text-danger"></span></label>
                                    <input type="text" name='lat' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Longitude <span className="text-danger"></span></label>
                                    <input type="text" name='lng' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Area <span className="text-danger"></span></label>
                                    <input type="text" name='area' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Zipcode <span className="text-danger"></span></label>
                                    <input type="number" name='zip' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>

                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => setAddProduct(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkLandsaleUpdate;