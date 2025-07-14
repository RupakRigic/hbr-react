import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from "react-select";
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const FutureSubdivisionPopup = ({ show, handleClose, getWeeklyList }) => {
    const [Error, setError] = useState('');
    const [builderId, setBuilderId] = useState('');
    const navigate = useNavigate();
    const [BuilderList, setBuilderList] = useState([]);
    
    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetFutureBuilderList();
        } else {
            navigate("/");
        }
    }, []);

    const GetFutureBuilderList = async () => {
        try {
            const response = await AdminSubdevisionService.getByBuilderId(localStorage.getItem('builderId'));
            const responseData = await response.json();
            setBuilderList(responseData);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const HandleSelectChange = (e) => {
        setBuilderId(e.id);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "status": true,
                "reporting": true
            }
            const data = await AdminSubdevisionService.bulkupdate(builderId, userData).json();
            if (data.status === true) {
                swal("Subdivision Added Succesfully").then((willDelete) => {
                    if (willDelete) {
                        handleClose();
                        getWeeklyList();
                        GetFutureBuilderList();
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
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Future Subdivision</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="form-label">
                    Future Subdivision List:{" "}
                </label>
                <Form.Group controlId="subdivisionList">
                    <Select
                        getOptionValue={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        options={BuilderList}
                        onChange={(e) => HandleSelectChange(e)}
                        value={BuilderList.id}
                        name="builder_name"
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
                    ></Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FutureSubdivisionPopup;
