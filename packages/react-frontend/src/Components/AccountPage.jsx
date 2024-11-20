import { useEffect, useState } from "react";
import "../Styles/AccountPage.scss";

const AccountPage = ({ API_PREFIX, addAuthHeader, logoutUser }) => {
  const [account, setAccount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Fetch account details
    fetch(`${API_PREFIX}/account/details`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
      })
      .catch((error) =>
        console.error("Error fetching account details:", error)
      );

    // Fetch account reviews
    fetch(`${API_PREFIX}/account/reviews`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [API_PREFIX, addAuthHeader]);

  // Handle file upload for profile picture
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const response = await fetch(`${API_PREFIX}/account/profile-pic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setAccount((prevAccount) => ({
          ...prevAccount,
          profile_pic: data.profile_pic
        }));
        alert("Profile picture updated successfully!");
      } else {
        alert(`Error updating profile picture: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading profile picture.");
    }
  };

  // Handle account deletion
  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_PREFIX}/account/delete`, {
        method: "DELETE",
        headers: addAuthHeader()
      });
      if (response.ok) {
        alert("Account deleted successfully.");
        logoutUser(); // Log the user out
      } else {
        alert("Error deleting account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account.");
    }
  };

  if (!account) {
    return <p>Loading account details...</p>;
  }

  return (
    <div className="account-page">
      <h2>Account</h2>
      <div className="account-header">
        <label htmlFor="profile-pic-upload">
          <img
            src={`${API_PREFIX}/${account.profile_pic}`}
            alt="Profile"
            className="profile-pic"
          />
        </label>
        <input
          type="file"
          id="profile-pic-upload"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <h2>
          {account.firstname} {account.lastname}
        </h2>
      </div>

      <div className="reviews-section">
        <h3>Reviews {reviews.length}</h3>
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <h4>{review.item}</h4>
            <div className="review-meta">
              <span>
                {account.firstname} {account.lastname}
              </span>
              <div className="stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
            <p>{review.review}</p>
          </div>
        ))}
      </div>

      <div className="account-actions">
        <button onClick={logoutUser}>Sign Out</button>
        <button onClick={() => setShowDeleteModal(true)}>Delete Account</button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete your account?</p>
            <button onClick={deleteAccount}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
