// review table
import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { Modal, Form, Button } from "react-bootstrap";
function Reviews() {
    const [reviewOptions, setReviewOptions] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedReview, setSelectedReview] = useState();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState("pending");

    const ratingOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
    ];
    const statusOptions = [
        {value: "pending", label: "Pending"},
        {value: "completed",label:"Completed"},
    ];
    const get_all_reviews = async () => {
        try {
            const url = "http://localhost:4000/api/admin/get_review_reviewId";
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            // Getting name with review
            const employeePromises = data.map(review => fetch(`http://localhost:4000/api/admin/get_employee_id/${review.employeeId}`));
            const employeeResponses = await Promise.all(employeePromises);
            const employeeData = await Promise.all(employeeResponses.map(response => response.json()));
            const reviewerPromises = data.map(review => fetch(`http://localhost:4000/api/admin/get_employee_id/${review.reviewerEmployeeId}`));
            const reviewerResponses = await Promise.all(reviewerPromises);
            const reviewerData = await Promise.all(reviewerResponses.map(response => response.json()));

            const reviewWithName = data.map(review => {
                const employee = employeeData.find(emp => emp.employeeId === review.employeeId);
                const reviewer = reviewerData.find(emp => emp.employeeId === review.reviewerEmployeeId);
                return { ...review, employeeName: employee.name, reviewerEmployeeName: reviewer.name };
            });
            console.log(reviewWithName);
            setReviewOptions(reviewWithName);
        } catch (error) {
            console.log(error);
        }
    }
    const openEditModal = (review) => {
        console.log(review);
        setShowEdit(true);
        setSelectedReview(review);
        console.log(selectedReview);
    }
    const closeEditModal = () => {
        setShowEdit(false);
    }
    const handleEditReview = async (e) => {
        e.preventDefault();
        try {
            const updatedReview = {
                ...selectedReview,
                rating: rating,
                feedback: feedback,
                status:status,
            };
            const updateData = await submitEditReview(updatedReview);
            console.log(updateData, updatedReview);
            if (updateData) {
                setReviewOptions(reviewOptions.map(review => review.reviewId === updateData.reviewId ? updateData : review));
                setShowEdit(false);
            } else {
                console.error("Error updating review");
            }

        } catch (error) {
            console.log("Review not found!", error);
        }
    }
    const submitEditReview = async (updatedReview) => {
        try {
            console.log(updatedReview);
            const url = `http://localhost:4000/api/admin/update_review/${updatedReview.reviewId}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedReview),
            });
            const data = await response.json();
            data.employeeName = selectedReview.employeeName;
            data.reviewerEmployeeName = selectedReview.reviewerEmployeeName;
            console.log(data);
            return data;
        } catch (error) {
            console.error("Submiting review failed!", error);

        }
    }
    useEffect(() => {
        get_all_reviews();
    }, []);
    return (
        <div className="table">
            <h1>Reviews</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Reviewed Employee Id</th>
                        <th>Reviewed Employee Name</th>
                        <th>Reviewer Employee Id</th>
                        <th>Reviewer Employee Name</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewOptions.map((review) => (
                        <tr key={review.reviewId}>
                            <td>{review.employeeId}</td>
                            <td>{review.employeeName}</td>
                            <td>{review.reviewerEmployeeId}</td>
                            <td>{review.reviewerEmployeeName}</td>
                            <td>{review.rating}</td>
                            <td>{review.feedback}</td>
                            <td>{review.status}</td>
                            <td>
                                <button className="custom-confirm-button" onClick={() => openEditModal(review)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showEdit && selectedReview} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="employeeId">
                        <Form.Label>Reviewed Employee Id</Form.Label>
                        <Form.Control type="text" value={selectedReview?.employeeId} disabled />
                    </Form.Group>
                    <Form.Group controlId="employeeName">
                        <Form.Label>Reviewed Employee Name</Form.Label>
                        <Form.Control type="text" value={selectedReview?.employeeName} disabled />
                    </Form.Group>
                    <Form.Group controlId="reviewerEmployeeId">
                        <Form.Label>Reviewer Employee Id</Form.Label>
                        <Form.Control type="text" value={selectedReview?.reviewerEmployeeId} disabled />
                    </Form.Group>
                    <Form.Group controlId="reviewerEmployeeName">
                        <Form.Label>Reviewer Employee Name</Form.Label>
                        <Form.Control type="text" value={selectedReview?.reviewerEmployeeName} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                            aria-label="Rating Select"
                            // value={selectedReview?.rating}
                            onChange={(e) => setRating(e.target.value)}
                            defaultValue={selectedReview?.rating}
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
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            aria-label="Status Select"
                            // value={selectedReview?.rating}
                            onChange={(e) => setStatus(e.target.value)}
                            defaultValue={selectedReview?.status}
                        >
                            <option value="">Select Status</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="feedback">
                        <Form.Label>Feedback</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            // value={selectedReview?.feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            defaultValue={selectedReview?.feedback}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="custom-cancel-button" onClick={closeEditModal}>
                        Cancel
                    </Button>
                    <Button className="custom-confirm-button" type="submit" onClick={handleEditReview}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Reviews;