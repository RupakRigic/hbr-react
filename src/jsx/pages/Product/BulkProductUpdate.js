import React, { useState, forwardRef, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import swal from "sweetalert";
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import Select from "react-select";
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';

const BulkLandsaleUpdate = forwardRef((props) => {
  const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

  const [SubdivisionCode, setSubdivisionCode] = useState([]);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [Error, setError] = useState('');

  useEffect(() => {
    if (canvasShowEdit) {
      GetSubdivisionDropDownList();
    }
  }, [canvasShowEdit]);

  const GetSubdivisionDropDownList = async () => {
    try {
      const response = await AdminSubdevisionService.subdivisionDropDown();
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      SetSubdivisionList(formattedData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedLandSales.length === 0) {
      setError('No selected records'); return false
    }
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          var userData = {
            subdivision_id: SubdivisionCode?.value,
            name: event.target.name.value,
            status: event.target.status.value,
            sqft: event.target.sqft.value,
            stories: event.target.stories.value,
            bedroom: event.target.bedroom.value,
            bathroom: event.target.bathroom.value,
            garage: event.target.garage.value,
            website: event.target.website.value
          };

          const data = await AdminProductService.bulkupdate(selectedLandSales, userData).json();

          if (data.status === true) {
            swal("Records Updated Successfully").then((willDelete) => {
              if (willDelete) {
                HandleUpdateCanvasClose();
                props.parentCallback();
              }
            })
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
  };

  const HandleUpdateCanvasClose = () => {
    seCanvasShowEdit(false);
    setError('');
    setSubdivisionCode([]);
  };

  return (
    <Fragment>
      <Offcanvas show={canvasShowEdit} onHide={() => HandleUpdateCanvasClose()} className="offcanvas-end customeoff" placement='end'>
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
          <button type="button" className="btn-close"
            onClick={() => HandleUpdateCanvasClose()}
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
                      onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
                      placeholder={"Select Subdivision..."}
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
                  <label htmlFor="exampleFormControlInput3" className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="exampleFormControlInput3"
                    placeholder=""
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput5" className="form-label">Status</label>
                  <select className="default-select form-control" name="status">
                    <option value="" disabled selected>Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Sold Out</option>
                    <option value="2">Future</option>
                    <option value="3">Closed</option>
                  </select>
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput17" className="form-label">SQFT</label>
                  <input
                    type="number"
                    name="sqft"
                    className="form-control"
                    id="exampleFormControlInput17"
                    placeholder=""
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput4" className="form-label">Stories</label>
                  <input
                    type="number"
                    name="stories"
                    className="form-control"
                    id="exampleFormControlInput4"
                    placeholder=""
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput12" className="form-label">Bedroom</label>
                  <input
                    type="number"
                    name="bedroom"
                    className="form-control"
                    id="exampleFormControlInput12"
                    placeholder=""
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput10" className="form-label">Bathroom</label>
                  <input
                    type="number"
                    name="bathroom"
                    className="form-control"
                    id="exampleFormControlInput10"
                    placeholder=""
                    step="0.1"
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput6" className="form-label">Garage</label>
                  <input
                    type="number"
                    name="garage"
                    className="form-control"
                    id="exampleFormControlInput6"
                    placeholder=""
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput18" className="form-label">Website</label>
                  <input
                    type="text"
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
                  to={"#"}
                  onClick={() => HandleUpdateCanvasClose()}
                  className="btn btn-danger light ms-1"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </Fragment>
  );
});

export default BulkLandsaleUpdate;