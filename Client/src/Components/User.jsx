import { useParams } from "react-router-dom";

function User() {
  const { userId } = useParams();
  return (
    <div className="text-3xl p-4 bg-gray-600 text-white text-center">
      User : {userId}
    </div>
  );
}

export default User;
