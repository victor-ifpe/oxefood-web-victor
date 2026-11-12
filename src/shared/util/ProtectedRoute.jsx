import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../../features/authentication/service/authenticationService";

const ProtectedRoute = ({ children }) => {

    if (!isUserLoggedIn()) {
        return <Navigate to="/" replace />;
    }

    return children;

};

export default ProtectedRoute;