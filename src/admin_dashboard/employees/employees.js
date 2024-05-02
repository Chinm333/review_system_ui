// employee table
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Form, Modal, Button } from "react-bootstrap";

function EmployeeTable() {
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [department, setDepartment] = useState();
    const [designation, setDesignation] = useState();


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
    const get_all_employees = async () => {
        try {
            const url = "http://localhost:4000/api/admin/get_employee_id";

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            const data = await response.json();
            setEmployeeOptions(data);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    const handleDelete = async (employee) => {
        try {
            const url = `http://localhost:4000/api/admin/delete_employee/${employee.employeeId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            get_all_employees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };
    const openEditModal = (employee) => {
        setShowEdit(true);
        setSelectedEmployee(employee);
    }
    const closeEditModal = () => {
        setShowEdit(false);
    }
    const handleEditEmployee = async (e) => {
        e.preventDefault();
        try {
            const updatedEmployee = {
                ...selectedEmployee,
                department: department,
                designation: designation
            }
            const updatedData = await submitEditEmployee(updatedEmployee);
            if (updatedData) {
                setEmployeeOptions(employeeOptions.map(employee => employee.employeeId === updatedData.employeeId ? updatedData : employee));
                setShowEdit(false);
            } else {
                console.error("Employee update failed");
            }
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };
    const submitEditEmployee = async (updatedEmployee) => {

        try {
            const url = `http://localhost:4000/api/admin/update_employee/${updatedEmployee.employeeId}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEmployee),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    useEffect(() => {
        get_all_employees();
    }, []);
    return (
        <div className="table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeOptions.map((employee) => (
                        <tr key={employee.employeeId}>
                            <td>{employee.employeeId}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.department}</td>
                            <td>{employee.designation}</td>
                            <td>
                                <button className="custom-confirm-button" onClick={() => openEditModal(employee)}>Edit</button>
                                <button className="custom-cancel-button" onClick={() => handleDelete(employee)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showEdit && selectedEmployee} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="employeeName">
                        <Form.Label>Employee Name</Form.Label>
                        <Form.Control type="text" value={selectedEmployee?.name} disabled />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="mail" value={selectedEmployee?.email} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Select
                            aria-label="Department Select"
                            // value={selectedEmployee?.rating}
                            onChange={(e) => setDepartment(e.target.value)}
                            defaultValue={selectedEmployee?.department}
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
                            // value={selectedEmployee?.rating}
                            onChange={(e) => setDesignation(e.target.value)}
                            defaultValue={selectedEmployee?.designation}
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
                    <Button className="custom-cancel-button" onClick={closeEditModal}>
                        Cancel
                    </Button>
                    <Button className="custom-confirm-button" type="submit" onClick={handleEditEmployee}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EmployeeTable;