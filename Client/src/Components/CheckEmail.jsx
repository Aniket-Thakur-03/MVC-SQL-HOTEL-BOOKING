import React from "react";
import { useLocation } from "react-router-dom";

function CheckEmail() {
  const location = useLocation();
  const {responseemail} = location.state();
  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="h1 text-center text-accent">
          Please check your inbox for email verification!
          Your Email: {`${responseemail}`};
        </h1>
      </div>
    </>
  );
}

export default CheckEmail;
