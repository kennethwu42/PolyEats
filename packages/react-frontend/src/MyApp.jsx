import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/App.scss";
import { FiltersProvider } from "./Components/Restaurant/FiltersContext.jsx";
import Login from "./Login.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import ComplexList from "./Components/ComplexList.jsx";
import RestaurantList from "./Components/Restaurant/RestaurantList.jsx";
import RestaurantReviews from "./Components/Restaurant/RestaurantReviews.jsx";
import ImageList from "./Components/Restaurant/ImageList.jsx";
import BottomNavBar from "./Components/BottomNavBar.jsx";
import AccountPage from "./Components/AccountPage.jsx";
import FavoritesPage from "./Components/FavoritesPage.jsx";
import WelcomePage from "./Components/WelcomePage.jsx";

function MyApp() {
  const API_PREFIX = "http://localhost:8000";
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || INVALID_TOKEN
  );
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
            toast.success("Login successful");
          });
        } else {
          response.text().then((text) => {
            toast.error(`${text}`);
          });
        }
      })
      .catch((error) => {
        toast.error(`${error.message}`);
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
          toast.success("Signup successful. Email verification sent");
        } else {
          response.text().then((text) => {
            toast.error(`${text}`);
          });
        }
      })
      .catch((error) => {
        toast.error(`${error}`);
      });

    return promise;
  }

  function logoutUser(showLogoutMessage = true) {
    setToken(INVALID_TOKEN);
    if (showLogoutMessage) {
      toast.info("You have been logged out");
    }
  }

  return (
    <div className="container">
      <FiltersProvider>
        <Router>
          <div
            style={{ paddingBottom: token !== INVALID_TOKEN ? "68px" : "0" }}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route
                path="/login"
                element={
                  token === INVALID_TOKEN ? (
                    <Login handleSubmit={loginUser} />
                  ) : (
                    <Navigate to="/complexes" replace />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  token === INVALID_TOKEN ? (
                    <Login handleSubmit={signupUser} buttonLabel="Sign Up" />
                  ) : (
                    <Navigate to="/complexes" replace />
                  )
                }
              />
              <Route
                path="/complexes"
                element={
                  token === INVALID_TOKEN ? (
                    <Navigate to="/" replace />
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
                  <RestaurantReviews
                    API_PREFIX={API_PREFIX}
                    addAuthHeader={addAuthHeader}
                  />
                }
              />
              <Route
                path="/restaurant/:id/images"
                element={
                  <ImageList
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
                    <Navigate to="/" replace />
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
                    <Navigate to="/" replace />
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
      </FiltersProvider>
      <ToastContainer />
    </div>
  );
}
export default MyApp;
