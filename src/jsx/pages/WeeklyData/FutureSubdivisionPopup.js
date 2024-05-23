import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from "react-select";

const FutureSubdivisionPopup = ({ show, handleClose, handleSave, BuilderList, setBuilderId }) => {

    const filtered = BuilderList.filter(item => item.status == 2);
console.log("filtered",filtered);
    const HandleSelectChange = (selectedOption) => {
        setBuilderId(selectedOption.builder_id);
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
                        options={filtered}
                        onChange={HandleSelectChange}
                        getOptionValue={(option) => option.name}
                        getOptionLabel={(option) => option.name}
                        value={filtered.name}
                        name="builder_name"
                    ></Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FutureSubdivisionPopup;
