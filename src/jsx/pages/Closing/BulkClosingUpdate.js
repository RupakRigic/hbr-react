import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { isEmptyArray } from 'formik';

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    // const [selectedLandSales, setSelectedLandSales] = useState(props.selectedLandSales);
    console.log("bulkselectedLandSales",selectedLandSales);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [ClosingList, SetClosingList] = useState([]);
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
    //         let responseData1 = await AdminClosingService.show(id).json()
    //         SetClosingList(responseData1);
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



    const handleSubdivisionCode = (e) => {
        setSubdivisionCode(e.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(selectedLandSales.length === 0)
            {
                setError('No selected records'); return false
            } 
            swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then(async (willDelete) => {
                if(willDelete){
                    try {
                        var userData = {
                            "subdivision_id": SubdivisionCode,
                            "sellerleagal": event.target.sellerleagal.value,
                            "address": event.target.address.value,
                            "buyer": event.target.buyer.value,
                            "lender": event.target.lender.value,
                            "closingdate": event.target.closingdate.value,
                            "closingprice": event.target.closingprice.value,
                            "loanamount": event.target.loanamount.value,
                            "document": event.target.document.value,
                            "closing_type": event.target.closing_type.value,
                            "parcel": event.target.parcel.value,
                            "sublegal_name": event.target.sublegal_name.value,
                            "type": event.target.type.value
                        }
                        console.log(userData);
                        const data = await AdminClosingService.bulkupdate(selectedLandSales, userData).json();
                        if (data.status === true) {
                            swal("Closing Update Succesfully").then((willDelete) => {
                                if (willDelete) {
                                    setAddProduct(false);
                                    navigate('/closingsalelist');
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
            })
        
    }

    return (
        <>
            <Offcanvas show={addProduct} onHide={() => {setAddProduct(false); setError('')}} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => {setAddProduct(false);setError('')}}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">

              
                    <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Subdivision</label>
                                    <Form.Group controlId="tournamentList">

                                        <Form.Select
                                            onChange={handleSubdivisionCode}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Seller Legal Name</label>
                                    <input type="text" name='sellerleagal' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Address</label>
                                    <textarea rows="2" name='address' className="form-control"></textarea>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Buyer Name<span className="text-danger"></span></label>
                                    <input type="text" name='buyer' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Lender<span className="text-danger"></span></label>
                                    <input type="text" name='lender' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Closing Date</label>
                                    <input type="date" name='closingdate' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label">Closing Price</label>
                                    <input type="number" name='closingprice' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Loan Amount</label>
                                    <input type="number" name='loanamount' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>


                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Document<span className="text-danger"></span></label>
                                    <input type="text" name='document' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Closing Type</label>
                                    <input type="text" name='closing_type' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">Parcel Number</label>
                                    <input type="text" name='parcel' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput13" className="form-label">Sub Legal Name</label>
                                    <input type="text" name='sublegal_name' className="form-control" id="exampleFormControlInput13" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput14" className="form-label">Type</label>
                                    <input type="text" name='type' className="form-control" id="exampleFormControlInput14" placeholder="" />
                                </div>


                                <p className='text-danger fs-12'>{Error}</p>

                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => {setAddProduct(false);setError('')}} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                    </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkLandsaleUpdate;