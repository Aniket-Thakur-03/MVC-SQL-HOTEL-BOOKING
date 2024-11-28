import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/verifyemail?token=${token}`
      );
      setStatus("success");
      setMessage(response.data.message);
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.message);
    }
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    token;
    verifyEmail(token);
  }, []);

  return (
    <div className="text-center mt-12">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <div>
          <h2 className="h2">🎉 Email Verified!</h2>
          <p>{message}</p>
          <p>Click to back on Login Page</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
      {status === "error" && (
        <div>
          <h2 className="h2">❌ Verification Failed</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
