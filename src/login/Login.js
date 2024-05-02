import React,{useState,useEffect} from "react";
import {toast} from "react-toastify";
import "./Login.css";
import { useNavigate } from "react-router";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("employee");
    const navigate = useNavigate();
    const loginEmployee = async (email, password) => {
        const url = `http://localhost:4000/api/admin/employee_login`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        if (response.status === 401) { 
          toast.error("Invalid email or password!", { position: "top-center" });
          // throw new Error("Admin login failed");
        }
        const data = await response.json();
        return data; 
      };
      const loginAdmin = async (password) => {
        const url = "http://localhost:4000/api/admin/admin_login";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (response.status === 401) { 
          toast.error("Invalid password!", { position: "top-center" });
          // throw new Error("Admin login failed");
        }
    
        const data = await response.json();
        console.log(data);
        return data; 
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const isAuthenticated = userType === "admin" ? await loginAdmin(password) : await loginEmployee(email, password);
          if (isAuthenticated) {
            // Handle successful login (e.g., redirect to appropriate dashboard) 
            console.log("Login successful!");
            // if admin, redirect to admin dashboard
            // else, redirect to employee dashboard
            clearForm();
            toast.success("Login successful!", { position: "top-center" });
            if(userType==="admin"){
              navigate("/admin-dashboard");
            }else{
              console.log(isAuthenticated);
              navigate(`/employee_dashboard/${isAuthenticated.employeeId}`);
            }
          } else {
            toast.error("Invalid email or password!", { position: "top-center" });
          }
        } catch (err) {
          console.error("Error during login:", err);
        }
      };
    
      const clearForm = () => {
        setEmail("");
        setPassword("");
        setUserType("employee");
      };

      useEffect(() => {
        setEmail(userType === "admin" ? "admin@gmail.com" : "");
      }, [userType]);
    
    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label className="form-check-label">User Type</label>
                <div className="options">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="admin" value="admin" checked={userType==="admin"} onChange={(e) => setUserType(e.target.value)}/>
                        <label className="form-check-label" htmlFor="admin">
                            Admin
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="employee" id="employee" value="employee" onChange={(e) => setUserType(e.target.value)} checked={userType==="employee"} />
                        <label className="form-check-label" htmlFor="employee">
                            Employee
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={userType==="admin"}/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="buttons">
                <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}
export default Login;