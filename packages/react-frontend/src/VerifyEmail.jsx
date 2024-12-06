import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// check email credentials and send user an email
export function VerifyEmail({ API_PREFIX }) {
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // check verification status and display appropriate response
      fetch(`${API_PREFIX}/auth/verify-email?token=${token}`)
        .then((response) => {
          if (response.ok) {
            setMessage("Email successfully verified! Redirecting...");
            //redirect after a delay
            setTimeout(() => {
              navigate("/");
            }, 2000); //2-second delay for feedback
          } else {
            setMessage("Invalid or expired verification token");
          }
        })
        .catch(() => {
          setMessage("An error occurred while verifying your email");
        });
    } else {
      setMessage("No verification token provided");
    }
  }, [navigate]);

  return <div>{message}</div>;
}

export default VerifyEmail;
