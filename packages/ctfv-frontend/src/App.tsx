import { AuthProvider, useAuth } from "@/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import SendEmail from "@/pages/SendEmail";
import VerifyEmail from "@/pages/VerifyEmail";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { CreateChallenge } from "@/pages/admin/CreateChallenge";
import { EditChallenge } from "@/pages/admin/EditChallenge";
import { Challenges } from "@/pages/user/Challenges";
import { Home } from "@/pages/user/Home";
import { LeaderBoard } from "@/pages/user/LeaderBoard";
import Personal from "@/pages/user/Personal";
import { Profile } from "@/pages/user/Profile";
import { Teams } from "@/pages/user/Teams";
import { Users } from "@/pages/user/Users";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const theme = localStorage.getItem("theme") || "light";
  const [isDarkMode, setIsDarkMode] = React.useState(theme === "dark");

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
        <Router>
          <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/personal/:userId" element={<Personal />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/send-email" element={<SendEmail />} />
              {user?.isAdmin === true && (
                <>
                  <Route
                    path="/admin/challenges/create"
                    element={<CreateChallenge />}
                  />
                  <Route
                    path="/admin/challenges/edit"
                    element={<EditChallenge />}
                  />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/challenges" element={<Challenges />} />
                </>
              )}
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
