import { Navigate, useRoutes } from "react-router-dom";
import LayoutFrontend from "./layouts/frontend/Main";
import LayoutBackend from "./layouts/backend";
import NotFound from "./pages/NotFound";
import RouterFrontend from "./router/RouterFrontend";
import RouterBackend from "./router/RouterBackend";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {element}
    </GoogleOAuthProvider>
  );
}

export default App;
