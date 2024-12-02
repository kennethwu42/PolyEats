import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/Login.scss";

function Login(props) {
  const [creds, setCreds] = useState({
    calpoly_email: "",
    password: "",
    firstname: "",
    lastname: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds((prevCreds) => ({ ...prevCreds, [name]: value }));
  }

  function submitForm() {
    const { firstname, lastname, calpoly_email, password } = creds;
    //conditionally include the name in the submitted credentials for signup
    const userCreds =
      props.buttonLabel === "Sign Up"
        ? { firstname, lastname, calpoly_email, password }
        : { calpoly_email, password };
    props.handleSubmit(userCreds);
    setCreds({ calpoly_email: "", password: "", firstname: "", lastname: "" });
  }

  return (
    <div className="login-page">
      <form>
        {props.buttonLabel === "Sign Up" && (
          <div>
            <>
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={creds.firstname}
                onChange={handleChange}
              />
            </>
            <>
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={creds.lastname}
                onChange={handleChange}
              />
            </>
          </div>
        )}
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
    </div>
  );
}
export default Login;
