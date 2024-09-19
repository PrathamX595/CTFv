import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ChallengeList } from "./pages/admin/ChallengeList";
import { Challenges } from "./pages/user/Challenges";
import { Home } from "./pages/user/Home";
import { Profile } from "./pages/user/Profile";
import { Scoreboard } from "./pages/user/Scoreboard";
import { Teams } from "./pages/user/Teams";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
        <Router>
          <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/scoreboard" element={<Scoreboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {user?.isAdmin === true && (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/challenges" element={<ChallengeList />} />
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
