import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";

const ProductUpdate = () => {
  const [SubdivisionCode, setSubdivisionCode] = useState([]);
  const [Error, setError] = useState("");
  const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
  const [ProductList, SetProductList] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const GetSubdivision = async (id) => {
    try {
      let responseData = await AdminProductService.show(id).json();
      SetProductList(responseData);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const GetSubdivisionDropDownList = async () => {
    try {
      const response = await AdminSubdevisionService.subdivisionDropDown();
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      setSubdivisionListDropDown(formattedData);
    } catch (error) {
      console.log("Error fetching subdivision list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      GetSubdivision(params.id);
      GetSubdivisionDropDownList();
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (subdivisionListDropDown.length > 0 && ProductList != "") {
      let initialSubdivisionId = subdivisionListDropDown.find(
        (subID) => subID.value === ProductList.subdivision_id
      )
      handleSubdivisionCode(initialSubdivisionId);
    }
  }, [subdivisionListDropDown, ProductList]);

  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        website: event.target.website.value,
      };
      const data = await AdminProductService.update(params.id, userData).json();
      if (data.status === true) {
        swal("Product Update Succesfully").then((willDelete) => {
          if (willDelete) {
            navigate("/productlist");
          }
        });
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Edit Product</h4>
              </div>
              <div className="card-body">
                <div className="form-validation">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Subdivision<span className="text-danger">*</span>
                        </label>
                        <Form.Group controlId="tournamentList">
                          <Select
                            options={subdivisionListDropDown}
                            value={SubdivisionCode}
                            onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                color: 'black'
                              }),
                              menu: (provided) => ({
                                ...provided,
                                color: 'black'
                              }),
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput2"
                          className="form-label"
                        >
                          {" "}
                          Product Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={ProductList.product_code}
                          name="product_code"
                          className="form-control"
                          id="exampleFormControlInput2"
                          placeholder=""
                          disabled
                          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput3"
                          className="form-label"
                        >
                          {" "}
                          Name <span className="text-danger">*</span>
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
                          Stories
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
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="default-select form-control"
                          name="status"
                        >
                          {/* <option data-display="Select">Please select</option> */}
                          <option value="">All</option>
                          <option selected={ProductList.status == 1 ? true : false} value="1">Active</option>
                          <option selected={ProductList.status == 0 ? true : false} value="0">Sold Out</option>
                          <option selected={ProductList.status == 2 ? true : false} value="2">Future</option>
                          <option selected={ProductList.status == 3 ? true : false} value="3">Closed</option>
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
                          step="0.1"
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
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput18"
                          className="form-label"
                        >
                          Website
                        </label>
                        <input
                          type="text"
                          defaultValue={ProductList.website}
                          name="website"
                          className="form-control"
                          id="exampleFormControlInput18"
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductUpdate;
