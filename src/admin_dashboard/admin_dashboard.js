// page liek the design and employee or reviews accordingly
import React,{useState} from "react";
import EmployeeModel from "../models/employee_model";
import ReviewModel from "../models/review_model";
import { useNavigate } from "react-router";
import EmployeeTable from "./employees/employees";
import "../App.css";

function AdminDashboard() {
    const [showCreateEmployee, setShowCreateEmployee] = useState(false);
    const [showCreateReview, setShowCreateReview] = useState(false);
    const navigate = useNavigate();
    const handleCreateEmployee = () => {
        setShowCreateEmployee(true);
        setShowCreateReview(false);
    }

    const handleCreateReview = () => {  
        setShowCreateReview(true);
        setShowCreateEmployee(false);
    }

    const navigateToReviewList = ()=>{
        navigate("/admin/review_list");
    }
    
    return (
        <div className="admin-dashboard">
            <h1 className="title">Admin Dashboard</h1>
            <button className="custom-confirm-button" onClick={handleCreateEmployee}>Create Employee</button>
            <button className="custom-confirm-button" onClick={handleCreateReview}>Create Review</button>
            <button className="custom-confirm-button" onClick={navigateToReviewList}>Review List</button>
            {showCreateEmployee && <EmployeeModel show={showCreateEmployee} onClose={() => setShowCreateEmployee(false)}/>}
            {showCreateReview && <ReviewModel show={showCreateReview} onClose={() => setShowCreateReview(false)}/>}
            <EmployeeTable/>
        </div>
    )
}
export default AdminDashboard;