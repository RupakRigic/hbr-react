import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';


const BulkPriceUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    // const [selectedLandSales, setSelectedLandSales] = useState(props.selectedLandSales);
    console.log("bulkselectedLandSales",selectedLandSales);
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [ProductList, setProductList] = useState([]);
    const [ProductCode, setProductCode] = useState("");
    const [PriceList, setPriceList] = useState("");


    const params = useParams();
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));
    const handleProductCode = (code) => {
        setProductCode(code.target.value);
    };
    const navigate = useNavigate();

    const getProductList = async () => {

        try {

            const response = await AdminProductService.index()
            const responseData = await response.json()
            setProductList(responseData.data)

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        getProductList();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(selectedLandSales.length === 0)
            {
                setError('No selected records'); return false
            } 
        try {
            var userData = {
                product_id: ProductCode,
                baseprice: event.target.baseprice.value,
                date: event.target.date.value,
            };
            console.log(userData);
            const data = await AdminPriceService.bulkupdate(selectedLandSales, userData).json();
            if (data.status === true) {
                swal("Closing Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
                        navigate('/priceList');
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
                            <label className="form-label">
                            Product<span className="text-danger">*</span>
                            </label>
                            <Form.Group controlId="tournamentList">
                            <Form.Select
                                onChange={handleProductCode}
                                value={ProductCode}
                                className="default-select form-control"

                            >
                                <option>Select Product</option>
                                {Array.isArray(ProductList) && ProductList.length > 0 ? (
        ProductList.map((element) => (
          <option key={element.id} value={element.id}>
            {element.name}
          </option>
        ))
      ) : (
        <option value="">No products available</option>
      )}
                            </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-xl-6 mb-3">
                            <label
                            htmlFor="exampleFormControlInput2"
                            className="form-label"
                            >
                            {" "}
                            Base Price: <span className="text-danger">*</span>
                            </label>
                            <input
                            type="number"
                            name="baseprice"
                            className="form-control"
                            id="exampleFormControlInput2"
                            placeholder=""
                            defaultValue={PriceList.baseprice}
                            />
                        </div>
                        <div className="col-xl-6 mb-3">
                            <label
                            htmlFor="exampleFormControlInput9"
                            className="form-label"
                            >
                            {" "}
                            Date <span className="text-danger"></span>
                            </label>
                            <input
                            type="date"
                            name="date"
                            className="form-control"
                            id="exampleFormControlInput9"
                            placeholder=""
                            defaultValue={PriceList.date}
                            />
                        </div>

                        <p className="text-danger fs-12">{Error}</p>
                        </div>
                        <div>
                        <button type="submit" className="btn btn-primary me-1">
                            Submit
                        </button>
                        <Link to={"/priceList"} className="btn btn-danger light ms-1">
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

export default BulkPriceUpdate;