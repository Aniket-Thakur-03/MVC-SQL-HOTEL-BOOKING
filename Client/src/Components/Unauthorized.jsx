import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="text-center text-3xl">Unauthorized Access</h1>
      <h1 className="text-center">You don't have rights to access this</h1>
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Click Me
        </button>
      </div>
    </>
  );
}

export default Unauthorized;
