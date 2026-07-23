import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Notification from "./pages/Notification";

import Header from "./components/Header";

function Layout() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/create";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* 기본 페이지 */}
        <Route path="/" element={<Login />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 */}
        <Route path="/signup" element={<Signup />} />

        {/* 홈 */}
        <Route path="/home" element={<Home />} />

        {/* 프로필 */}
        <Route path="/profile" element={<Profile />} />

        {/* 게시글 작성 */}
        <Route path="/create" element={<CreatePost />} />

        {/* 알림 */}
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
