import Router from "./app/router";
import { setupAxiosInterceptors } from "./features/authentication/service/authenticationService";

export default function App() {
  setupAxiosInterceptors();
  return <Router />;
}