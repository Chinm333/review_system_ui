import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from "react-bootstrap";
import '../App.css';

function EmployeeModel({ show, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");

    const departmentOptions = [
        { value: 'HR', label: 'Human Resources' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Product Management', label: 'Product Management' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Customer Success', label: 'Customer Success' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Design', label: 'Design' },
        { value: 'Legal', label: 'Legal' },
    ];

    const designationOptions = [
        { value: 'Intern', label: 'Intern' },
        { value: 'Junior', label: 'Junior' },
        { value: 'Associate', label: 'Associate' },
        { value: 'Mid-Level', label: 'Mid-Level' },
        { value: 'Senior', label: 'Senior' },
        { value: 'Lead', label: 'Lead' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Director', label: 'Director' },
        { value: 'VP', label: 'Vice President' },
        { value: 'C-Suite', label: 'C-Suite' },
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:4000/api/admin/create_employee";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, department, designation }),
        });
        const data = await response.json();
        console.log("Employee created successfully:", data);
        // onSubmit(data);
        clearForm();
        toast.success("Employee created successfully!", { position: "top-center" });
    };
    const clearForm = () => {
        onClose();
        setName("");
        setEmail("");
        setDepartment("");
        setDesignation("");
        window.location.reload();
    };
    return (
        <Modal show={show} onHide={() => { clearForm(); onClose(); }}>
            <Modal.Header closeButton>
                <Modal.Title>Create Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="employeeName">
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control type="text"
                        id="name"
                        placeholder="Enter employee name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        id="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                        aria-label="Department Select"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        {departmentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Designation</Form.Label>
                    <Form.Select
                        aria-label="Designation Select"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                    >
                        <option value="">Select Designation</option>
                        {designationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button className="custom-cancel-button" onClick={() => { clearForm(); onClose(); }}>
                    Cancel
                </Button>
                <Button className="custom-confirm-button" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default EmployeeModel;