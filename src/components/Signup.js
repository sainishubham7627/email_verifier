import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        // 🔹 Password confirmation check
        if (password !== cpassword) {
            props.showAlert("Passwords do not match", "danger");
            return;
        }

        try {
            const response = await fetch("https://noteify-h79j.onrender.com/api/auth/createuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const text = await response.text(); // Read response as text
            let json;
            try {
                json = JSON.parse(text); // Try parsing as JSON
            } catch {
                throw new Error(text); // If not JSON, throw error
            }

            console.log(json);

            if (json.success) {
                localStorage.setItem("token", json.authtoken);
                navigate("/");
                props.showAlert("Account Created Successfully", "success");
            } else {
                props.showAlert(json.error || "Invalid Credentials", "danger");
            }
        } catch (error) {
            console.error("Error:", error.message);
            props.showAlert("Server error occurred", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center flex-column mt-3">
            <h2>Signup to Noteify</h2>
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "700px" }}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={credentials.name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="cpassword"
                        name="cpassword"
                        value={credentials.cpassword}
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: "rgb(94, 63, 45)", borderRadius: "4px" }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Signup;
