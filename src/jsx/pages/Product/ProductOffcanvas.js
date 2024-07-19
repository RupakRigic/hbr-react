import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas, Form } from "react-bootstrap";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import swal from "sweetalert";
import Select from "react-select";

const ProductOffcanvas = forwardRef((props, ref) => {
  const { SubdivisionList } = props;
  const navigate = useNavigate();
  const [Error, setError] = useState("");
  const [addProduct, setAddProduct] = useState(false);
  const [SubdivisionCode, setSubdivisionCode] = useState("");

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddProduct(true);
    },
  }));

  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        subdivision_id: SubdivisionCode,
        product_code: event.target.product_code.value,
        name: event.target.name.value,
        status: event.target.status.value,
        stories: event.target.stories.value ? event.target.stories.value : "",
        garage: event.target.garage.value,
        pricechange: event.target.pricechange.value,
        bathroom: event.target.bathroom.value,
        recentprice: event.target.recentprice.value,
        bedroom: event.target.bedroom.value,
        recentpricesqft: event.target.recentpricesqft.value,
        sqft: event.target.sqft.value,
      };
      const data = await AdminProductService.store(userData).json();
      if (data.status === true) {
        swal("Product Create Succesfully").then((willDelete) => {
          if (willDelete) {
            setAddProduct(false);
            props.parentCallback();
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
    <>
      <Offcanvas
        show={addProduct}
        onHide={setAddProduct}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            {props.Title}
          </h5>
          <button
            type="button"
            className="btn-close"
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
                  <label className="form-label">Subdivision</label>
                  <Form.Group controlId="tournamentList">
                    <Select
                      options={SubdivisionList}
                      onChange={handleSubdivisionCode}
                      getOptionValue={(option) => option.name}
                      getOptionLabel={(option) => option.label}
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
                    Product Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
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
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
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
                  <select className="default-select form-control" name="status">
                    <option value="">All</option>
                    <option value="1">Active</option>
                    <option value="0">Sold Out</option>
                    <option value="2">Future</option>
                  </select>{" "}
                </div>

                <div className="col-xl-6 mb-3">
                  <label
                    htmlFor="exampleFormControlInput6"
                    className="form-label"
                  >
                    {" "}
                    Garage <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    Price Change <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    Bathroom<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    Recent Price<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    Bedroom<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    Recent Price SQFT<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                    SQFT<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
                  to={"#"}
                  onClick={() => setAddProduct(false)}
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

export default ProductOffcanvas;
