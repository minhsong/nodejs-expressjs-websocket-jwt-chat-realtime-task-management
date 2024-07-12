import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ".//services/fontAwesome";
import Store from "./Redux/store";
import Page404 from "./pages/Page404";
import Login from "./pages/Login";
import Layout from "./components/Layout.jsx";
import Register from "./pages/Register/index.jsx";
import { loadUser } from "./services/userService.js";
import { useEffect } from "react";
import AccessCodeLogin from "./pages/AccessCodeLogin/index.jsx";
import VerifyAccessCodeLogin from "./pages/VerifyAccessCodeLogin/index.jsx";

function App() {
  useEffect(() => {
    loadUser(Store.dispatch);
  }, []);
  return (
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route exact path="/code-login" element={<AccessCodeLogin />} />
          <Route
            exact
            path="//verify-access-code"
            element={<VerifyAccessCodeLogin />}
          />
          <Route exact path="/*" element={<Layout />} />
          <Route component={Page404} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
