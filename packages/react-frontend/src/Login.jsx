import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login(props) {
  const [creds, setCreds] = useState({
    calpoly_email: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds((prevCreds) => ({ ...prevCreds, [name]: value }));
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ calpoly_email: "", password: "" });
  }

  return (
    <div>
      <form>
        <label htmlFor="calpoly_email">Cal Poly Email</label>
        <input
          type="text"
          name="calpoly_email"
          id="calpoly_email"
          value={creds.calpoly_email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={creds.password}
          onChange={handleChange}
        />
        <input
          type="button"
          value={props.buttonLabel || "Log In"}
          onClick={submitForm}
        />
      </form>

      {props.buttonLabel === "Sign Up" ? (
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      ) : (
        <p>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      )}

      {props.message && <p>{props.message}</p>}
    </div>
  );
}
export default Login;
