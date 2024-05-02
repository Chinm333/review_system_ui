import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ReviewModel({ show, onClose }) {
    const [employeeId, setEmployeeId] = useState("");
    const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [employeeOptions, setEmployeeOptions] = useState([]);

    const ratingOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:4000/api/admin/assign_review";
            if (employeeId !== reviewerEmployeeId) {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ employeeId, reviewerEmployeeId, rating, feedback }),
                });
                const data = await response.json();
                console.log(data);
                clearForm();
                toast.success("Review assigned successfully!", { position: "top-center" });
            } else {
                toast.error("Reviewer and Employee cannot be same!", { position: "top-center" });
            }
        } catch (error) {
            console.log(error);
        }
    }
    const clearForm = () => {
        setEmployeeId("");
        setReviewerEmployeeId("");
        setRating(0);
        setFeedback("");
        // onClose();
    }
    const getAllEmployeeNames = async () => {
        try {
            const url = "http://localhost:4000/api/admin/get_employee_id";

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            const data = await response.json();
            const options = data.map((employee) => (
                <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.name}
                </option>
            ));
            setEmployeeOptions(options);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    useEffect(() => {
        getAllEmployeeNames();
    }, [])


    return (
        <Modal show={show} onHide={() => { clearForm(); onClose(); }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create Review
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Employee</Form.Label>
                        <Form.Select
                            aria-label="Employee Select"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employeeOptions}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Reviewer</Form.Label>
                        <Form.Select
                            aria-label="Reviewer Select"
                            value={reviewerEmployeeId}
                            onChange={(e) => setReviewerEmployeeId(e.target.value)}
                            required
                        >
                            <option value="">Select Reviewer</option>
                            {employeeOptions}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                            aria-label="Rating Select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">Select Rating</option>
                            {ratingOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>

                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </Form.Group>
                    <Button className="custom-confirm-button" type="submit">
                        Submit Review
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}
export default ReviewModel;