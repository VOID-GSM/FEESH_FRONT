import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Notification from "./pages/Notification";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* 회원가입 */}
        <Route path="/signup" element={<Signup />} />

        {/* 홈 */}
        <Route path="/home" element={<Home />} />

        {/* 게시글 작성 */}
        <Route path="/create" element={<CreatePost />} />

        {/* 게시글 상세 */}
        <Route path="/post/:id" element={<PostDetail />} />

        {/* 프로필 */}
        <Route path="/profile" element={<Profile />} />

        {/* 알림 */}
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
