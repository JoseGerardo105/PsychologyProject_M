import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPasswordForEnter from "./pages/ResetPasswordForEnter";
import MailForPassword from "./pages/MailForPassword";
import Home from "./pages/Home";
import ContentLayout from "./layout/ContentLayout";
import RegisterPatient from "./pages/RegisterPatient";
import SearchPatient from "./pages/SearchPatient";
import CreateHistory from "./pages/CreateHistory";
import SearchHistory from "./pages/SearchHistory";
import MyProfile from "./pages/MyProfile";
import Reports from "./pages/Reports";
import ConfirmAccount from "./pages/ConfirmAccount";
import ChangePasswordInAccount from "./pages/ChangePasswordInAccount";
import WatchHistory from "./pages/WatchHistory";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        {" "}
        <Route path="/" element={<AuthLayout />}>
          {" "}
          <Route index element={<Login />} />{" "}
          <Route path="register" element={<Register />} />{" "}
          <Route path="restore-account" element={<MailForPassword />} />{" "}
          <Route
            path="restore-account/:token"
            element={<ResetPasswordForEnter />}
          />{" "}
          <Route path="confirm-account/:token" element={<ConfirmAccount />} />{" "}
        </Route>{" "}
        <Route path="/home" element={<ContentLayout />}>
          {" "}
          <Route index element={<Home />} />{" "}
          <Route path="register-patients" element={<RegisterPatient />} />{" "}
          <Route path="search-patients" element={<SearchPatient />} />{" "}
          <Route path="create-history" element={<CreateHistory />} />{" "}
          <Route path="search-history" element={<SearchHistory />} />{" "}
          <Route path="my-profile" element={<MyProfile />} />{" "}
          <Route path="stats" element={<Reports />} />{" "}
          <Route path="change-password" element={<ChangePasswordInAccount />} />{" "}
          <Route path="watch-history" element={<WatchHistory />} />{" "}
        </Route>{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
