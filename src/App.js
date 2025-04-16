import { Navigate, useRoutes } from "react-router-dom";
import LayoutFrontend from "./layouts/frontend/Main";
import "./assets/scss/app.scss"
import LayoutBackend from "./layouts/backend";
import NotFound from "./pages/NotFound";
import RouterFrontend from "./router/RouterFrontend";
import RouterBackend from "./router/RouterBackend";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // kiểm tra thêm token

  // Nếu không có user hoặc token, hoặc không phải admin thì redirect về login
  if (!user || !token || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {

  let element = useRoutes([
    {
      path: "/",
      element: <LayoutFrontend />,
      children: RouterFrontend,
    },
    {
      path: "/admin",
      element: (
        <RequireAdmin>
        <LayoutBackend />
      </RequireAdmin>
      ),
      children: RouterBackend,
    },    
    { path: "admin/login", element: <Login /> },
    { path: "*", element: <NotFound /> },
    
  ]);
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      {element}
    </>
  );
}

export default App;
