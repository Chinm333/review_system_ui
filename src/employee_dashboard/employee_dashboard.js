// design same as cretaeed
import React,{useEffect, useState} from "react";
import { Table } from "react-bootstrap";
import { useParams } from 'react-router-dom'; //// Access data from state
import { Modal, Form, Button } from "react-bootstrap";
function EmployeeDashboard() {
    const [reviewOptions, setReviewOptions] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedReview, setSelectedReview] = useState();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const { employeeId } = useParams();

    const get_all_reviews_by_id = async () =>{
        try {
            const url = `http://localhost:4000/api/admin/get_review_reviewerId/${employeeId}`;

            const response = await fetch(url,{
                method:"GET",
                headers:{"Content-Type":"application/json"}
            });
            const data = await response.json();

            // adding employee name in review and combine
            const employeePromises = data.map(review=> fetch(`http://localhost:4000/api/admin/get_employee_id/${review.employeeId
        }`));
            const employeeResponses = await Promise.all(employeePromises); 
            const employeeData = await Promise.all(employeeResponses.map(response=>response.json()));

            const reviewWithName = data.map(review=>{
                const employee = employeeData.find(emp=>emp.employeeId === review.employeeId);
                return {...review,employeeName:employee.name};
            })
            setReviewOptions(reviewWithName);
        } catch (error) {
            console.log(error);
        }
    }
    const ratingOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
    ];
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
                status:"completed",
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
    useEffect(()=>{
        get_all_reviews_by_id();
    },[]);

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                        <th>Status</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewOptions.map((review) => (
                        <tr key={review.reviewId}>
                            <td>{review.employeeId}</td>
                            <td>{review.employeeName}</td>
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
                        <Form.Label>Employee Id</Form.Label>
                        <Form.Control type="text" value={selectedReview?.employeeId} disabled />
                    </Form.Group>
                    <Form.Group controlId="employeeName">
                        <Form.Label>Employee Name</Form.Label>
                        <Form.Control type="text" value={selectedReview?.employeeName} disabled />
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

export default EmployeeDashboard;