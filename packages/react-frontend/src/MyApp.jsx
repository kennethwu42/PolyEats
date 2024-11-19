import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import "./Styles/App.scss";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail.jsx";
import ComplexList from "./Components/ComplexList.jsx";
import RestaurantList from "./Components/Restaurant/RestaurantList.jsx";
import RestaurantDetails from "./Components/Restaurant/RestaurantDetails.jsx";
import BottomNavBar from "./Components/BottomNavBar.jsx"
import AccountPage from "./Components/AccountPage.jsx"
import FavoritesPage from "./Components/FavoritesPage.jsx"

function MyApp() {
  const API_PREFIX = "polyeats-b6d9cdecaygmgpa0.westus3-01.azurewebsites.net";
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || INVALID_TOKEN
  );
  const [message, setMessage] = useState("");
  const [complexes, setComplexes] = useState([]);

  useEffect(() => {
    //save token to localStorage whenever it updates
    if (token && token !== INVALID_TOKEN) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  function addAuthHeader(otherHeaders = {}) {
    return token === INVALID_TOKEN
      ? otherHeaders
      : { ...otherHeaders, Authorization: `Bearer ${token}` };
  }

  function fetchComplexes() {
    const promise = fetch(`${API_PREFIX}/complexes`, {
      headers: addAuthHeader()
    });

    return promise;
  }

  useEffect(() => {
    if (token !== INVALID_TOKEN) {
      fetchComplexes()
        .then((res) => (res.status === 200 ? res.json() : undefined))
        .then((json) => setComplexes(json ? json.complexes_list : null))
        .catch((error) => {
          console.log(error);
        });
    }
  }, [token]);

  function loginUser(creds) {
    const promise = fetch(`${API_PREFIX}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((payload) => {
            setToken(payload.token);
            setMessage("Login successful");
          });
        } else {
          response.text().then((text) => {
            setMessage(`Login Error ${response.status}: ${text}`);
          });
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error.message}`);
      });

    return promise;
  }

  function signupUser(creds) {
    const promise = fetch(`${API_PREFIX}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then((payload) => setToken(payload.token));
          setMessage("Signup successful. Email verfication sent.");
        } else {
          response.text().then((text) => {
            setMessage(`Signup Error ${response.status}: ${text}`);
          });
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });

    return promise;
  }

  function logoutUser() {
    setToken(INVALID_TOKEN);
    setMessage("You have been logged out");
  }

  return (
    <div className="container">
      <Router>
        <div style={{ paddingBottom: token !== INVALID_TOKEN ? "60px" : "0" }}>
          <Routes>
            <Route
              path="/login"
              element={
                token === INVALID_TOKEN ? (
                  <Login handleSubmit={loginUser} message={message} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/signup"
              element={
                token === INVALID_TOKEN ? (
                  <Login
                    handleSubmit={signupUser}
                    buttonLabel="Sign Up"
                    message={message}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                token === INVALID_TOKEN ? (
                  <Navigate to="/login" replace />
                ) : (
                  <ComplexList complexes={complexes} />
                )
              }
            />
            <Route
              path="/complex/:complexId"
              element={
                <RestaurantList
                  API_PREFIX={API_PREFIX}
                  addAuthHeader={addAuthHeader}
                />
              }
            />
            <Route
              path="/restaurant/:id"
              element={
                <RestaurantDetails
                  API_PREFIX={API_PREFIX}
                  addAuthHeader={addAuthHeader}
                />
              }
            />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route
              path="/account"
              element={
                token === INVALID_TOKEN ? (
                  <Navigate to="/login" replace />
                ) : (
                  <AccountPage
                    API_PREFIX={API_PREFIX}
                    addAuthHeader={addAuthHeader}
                    logoutUser={logoutUser}
                  />
                )
              }
            />
            <Route
              path="/favorites"
              element={
                token === INVALID_TOKEN ? (
                  <Navigate to="/login" replace />
                ) : (
                  <FavoritesPage
                    API_PREFIX={API_PREFIX}
                    addAuthHeader={addAuthHeader}
                  />
                )
              }
            />
          </Routes>
          {token !== INVALID_TOKEN && <BottomNavBar />}
        </div>
      </Router>
    </div>
  );
}
export default MyApp;
