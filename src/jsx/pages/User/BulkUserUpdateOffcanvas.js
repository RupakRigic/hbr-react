import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import Select from "react-select";
import { MultiSelect } from 'react-multi-select-component';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';

const BulkUserUpdateOffcanvas = forwardRef((props, ref) => {
  const { userSelectedUsers } = props;
  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState("");
  const [RoleCode, setRoleCode] = useState([]);
  const [standardRoleCode, setStandardRoleCode] = useState([]);
  const [RoleList, setRoleList] = useState([]);
  const [subRoleList, setSubRoleList] = useState([]);
  const [StandardUser, setStandardUser] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saveBtn, setSaveBtn] = useState(false);
  const [message, setMessage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    GetRoleList();
  }, []);

  const GetRoleList = async () => {
    try {
      let responseData = await AdminUserRoleService.roles().json();
      setRoleList(responseData.main_role);
      setSubRoleList(responseData.sub_role);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const roleOptions = RoleList.map(element => ({
    value: element.id,
    label: element.name
  }));

  const StandardUserOptions = subRoleList.map(element => ({
    value: element.id,
    label: element.name
  }));

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddUser(true);
    }
  }));

  const handleRoleCode = (code) => {
    const formattedRoles = [{
      value: code.value,
      label: code.label
    }];
    const selectedValues = formattedRoles.map(item => item.value);
    setRoleCode(selectedValues);
  };

  const handleStandardUser = (code) => {
    const selectedValues = code.map(item => item.value);
    setStandardRoleCode(selectedValues);
    setStandardUser(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userSelectedUsers.length === 0) {
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
          if (!company) {
            setShowPopup(true);
            setMessage("Please enter valid company.");
            return;
          }
          const FilterRoleCode = RoleCode == 9 && standardRoleCode.filter((id) => id === 11);
          if (FilterRoleCode == 11) {
            var userData = {
              "name": firstName,
              "company": company,
              "last_name": lastName,
            }
            const data = await AdminUserRoleService.checkBuilderForCompany(userData).json();
            if (data.status === true) {
              setBuilderCode(data.builder_id);
              setMessage("Selected users are the Data Uploader for " + data.builder_name + ".");
              setSaveBtn(true);
              setShowPopup(true);
            } else {
              setMessage(data.message);
              setShowPopup(true);
            }
          } else {
            var userData = {
              "role_id": RoleCode == 9 ? standardRoleCode : RoleCode,
              "name": firstName,
              "last_name": lastName,
              "email": email,
              "notes": notes,
              "company": company
            }
            const data = await AdminUserRoleService.bulkupdate(userSelectedUsers, userData).json();
            if (data.status === true) {
              swal("User Update Succesfully").then((willDelete) => {
                if (willDelete) {
                  setAddUser(false);
                  setRoleCode();
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setNotes("");
                  setCompany("");
                  setStandardUser([]);
                  props.parentCallback();
                  props.setSelectedUsers([]);
                }
              });
            }
          }
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(
              errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
            );
          }
        }
      }
    })
  };

  const handlePopupSave = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        "builder_id": BuilderCode,
        "role_id": RoleCode == 9 ? standardRoleCode : RoleCode,
        "name": firstName,
        "last_name": lastName,
        "email": email,
        "notes": notes,
        "company": company
      }
      const data = await AdminUserRoleService.bulkupdate(userSelectedUsers, userData).json();
      if (data.status === true) {
        setShowPopup(false);
        setSaveBtn(false);
        setRoleCode([]);
        setStandardUser([]);
        swal("User Update Succesfully").then((willDelete) => {
          if (willDelete) {
            setAddUser(false);
            setFirstName("");
            setLastName("");
            setEmail("");
            setNotes("");
            setCompany("");
            props.parentCallback();
            props.setSelectedUsers([]);
          }
        });
      }
    }
    catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
      }
    }
  };

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

  return (
    <>
      <Offcanvas show={addUser} onHide={() => { setAddUser(false); setError('') }} className="offcanvas-end customeoff" placement='end'>
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
          <button type="button" className="btn-close"
            onClick={() => { setAddUser(false); setRoleCode(); setBuilderCode(""); setError(''); setStandardUser([]); }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput2" className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-control"
                    id="exampleFormControlInput2"
                    placeholder=""
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput3" className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-control"
                    id="exampleFormControlInput3"
                    placeholder=""
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput4" className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="exampleFormControlInput4"
                    placeholder=""
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput4" className="form-label">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    className="form-control"
                    id="exampleFormControlInput4"
                    placeholder=""
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput5" className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    id="exampleFormControlInput5"
                    placeholder=""
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label className="form-label">Role</label>
                  <Select
                    options={roleOptions}
                    onChange={(selectedOption) => handleRoleCode(selectedOption)}
                    placeholder="Select Role"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '100%',
                        color: 'black'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: '100%',
                        color: 'black'
                      }),
                    }}
                  />
                </div>

                {RoleCode == 9 && <div className="col-xl-6 mb-3">
                  <label className="form-label">Standard User<span className="text-danger">*</span></label>
                  <MultiSelect
                    options={StandardUserOptions}
                    onChange={(selectedOption) => handleStandardUser(selectedOption)}
                    value={StandardUser}
                    placeholder="Select Role"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '100%',
                        color: 'black'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: '100%',
                        color: 'black'
                      }),
                    }}
                  />
                </div>}

                <p className="text-danger fs-12">{Error}</p>
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">
                  Submit
                </button>
                <Link to={"#"} onClick={() => { setAddUser(false); setError(''); setRoleCode(); setStandardUser([]); }} className="btn btn-danger light ms-1">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>

      {/* Popup */}
      <Modal show={showPopup} onHide={HandlePopupDetailClick}>
        <Modal.Header handlePopupClose>
          <Modal.Title>Confirmation</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handlePopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePopupClose}>
            Close
          </Button>
          {saveBtn && <Button variant="primary" onClick={(e) => handlePopupSave(e)}>
            Okay
          </Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default BulkUserUpdateOffcanvas;