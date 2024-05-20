import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import { isEmptyArray } from 'formik';
import Select from "react-select";

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    // const [selectedLandSales, setSelectedLandSales] = useState(props.selectedLandSales);
    console.log("bulkselectedLandSales",selectedLandSales);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [ClosingList, SetClosingList] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [ProductList, SetProductList] = useState([]);
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



    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(selectedLandSales.length === 0)
            {
                setError('No selected records'); return false
            } 
        try {
            var userData = {
                subdivision_id: SubdivisionCode.id
                  ? SubdivisionCode.id
                  : ProductList.subdivision_id,
                product_code: event.target.product_code.value,
                name: event.target.name.value,
                status: event.target.status.value,
                stories: event.target.stories.value,
                garage: event.target.garage.value,
                pricechange: event.target.pricechange.value,
                bathroom: event.target.bathroom.value,
                recentprice: event.target.recentprice.value,
                bedroom: event.target.bedroom.value,
                recentpricesqft: event.target.recentpricesqft.value,
                sqft: event.target.sqft.value,
              };

              const data = await AdminProductService.bulkupdate(selectedLandSales, userData).json();
            if (data.status === true) {
                swal("Product Updated Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
                        navigate('/productlist');
                    }
                })
            }
            props.parentCallback();

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
                        <label className="form-label">
                          Subdivision
                        </label>
                        <Form.Group controlId="tournamentList">
                          <Select
                            options={SubdivisionList}
                            onChange={handleSubdivisionCode}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={SubdivisionCode}
                          ></Select>
                        </Form.Group>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput2"
                          className="form-label"
                        >
                          {" "}
                          Product Code
                        </label>
                        <input
                          type="text"
                          defaultValue={ProductList.product_code}
                          name="product_code"
                          className="form-control"
                          id="exampleFormControlInput2"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput3"
                          className="form-label"
                        >
                          {" "}
                          Name
                        </label>
                        <input
                          type="text"
                          defaultValue={ProductList.name}
                          name="name"
                          className="form-control"
                          id="exampleFormControlInput3"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput4"
                          className="form-label"
                        >
                          Stories <span className="text-danger"></span>
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.stories}
                          name="stories"
                          className="form-control"
                          id="exampleFormControlInput4"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput5"
                          className="form-label"
                        >
                          {" "}
                          Status
                        </label>
                        <select
                          className="default-select form-control"
                          name="status"
                        >
                          {/* <option data-display="Select">Please select</option> */}
                          <option value="">All</option>
                          <option selected={ProductList.status ==1 ? true : false }  value="1">Active</option>
                          <option  selected={ProductList.status ==0 ? true : false } value="0">Sold Out</option>
                          <option  selected={ProductList.status ==2 ? true : false } value="2">Future</option>
                        </select>
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput6"
                          className="form-label"
                        >
                          {" "}
                          Garage
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.garage}
                          name="garage"
                          className="form-control"
                          id="exampleFormControlInput6"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput7"
                          className="form-label"
                        >
                          {" "}
                          Price Change
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.pricechange}
                          name="pricechange"
                          className="form-control"
                          id="exampleFormControlInput7"
                          placeholder=""
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput10"
                          className="form-label"
                        >
                          Bathroom
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.bathroom}
                          name="bathroom"
                          className="form-control"
                          id="exampleFormControlInput10"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput11"
                          className="form-label"
                        >
                          Recent Price
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.recentprice}
                          name="recentprice"
                          className="form-control"
                          id="exampleFormControlInput11"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput12"
                          className="form-label"
                        >
                          Bedroom
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.bedroom}
                          name="bedroom"
                          className="form-control"
                          id="exampleFormControlInput12"
                          placeholder=""
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput16"
                          className="form-label"
                        >
                          Recent Price SQFT
                          
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.recentpricesqft}
                          name="recentpricesqft"
                          className="form-control"
                          id="exampleFormControlInput16"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput17"
                          className="form-label"
                        >
                          SQFT
                        </label>
                        <input
                          type="number"
                          defaultValue={ProductList.sqft}
                          name="sqft"
                          className="form-control"
                          id="exampleFormControlInput17"
                          placeholder=""
                        />
                      </div>

                      <p className="text-danger fs-12">{Error}</p>
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary me-1">
                        Submit
                      </button>
                      <Link
                        to={"/productlist"}
                        className="btn btn-danger light ms-1"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkLandsaleUpdate;