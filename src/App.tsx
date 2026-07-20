import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
