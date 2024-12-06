import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [passowrd, setPassword] = useState("");
  const [error, setError] = useState("");
  const [uid, setUId] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const verifyUser = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/forget/password/${id}`
      );
      if (response.status == 200) {
        setStatus("success");
        setMessage(response.data.message);
        setUId(response.data.id);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data.message || error.message);
    }
  };
  useEffect(() => {
    if (!id) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    verifyUser(id);
  }, []);

  return (
    <div className="text-center mt-12">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <div>
          <h2 className="h2">Email Verified!</h2>
          <label htmlFor="password">Please type your new password</label>
          <input
            type="password"
            name="password"
            id="passowrd"
            placeholder="New Password"
            value={passowrd}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500">{error}</div>}
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const response = await axios.post(
                  "http://localhost:8000/api/users/forget/password",
                  {
                    password: passowrd,
                    id: uid,
                  }
                );
                if (response.status == 200) {
                  navigate("/login");
                  setError("");
                }
              } catch (error) {
                setError(`${error.response?.data.message || error.message}`);
              }
            }}
          >
            Update
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
}

export default ResetPassword;
