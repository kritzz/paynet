import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const auth = useAuth();

  // If auth is undefined (context not ready), show a loading state
  if (auth === undefined) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const { currentUser } = auth;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
