import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './login/Login';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './admin_dashboard/admin_dashboard.js';
import Reviews from './admin_dashboard/reviews/reviews.js';
import EmployeeDashboard from './employee_dashboard/employee_dashboard.js';
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}/>
        <Route path="admin/review_list" element = {<Reviews/>}/>
        <Route path="employee_dashboard/:employeeId" element={<EmployeeDashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
