import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EmotionLogger from "./components/EmotionLogger";
import JournalPage from "./pages/JournalPage";
import DashboardPage from "./pages/DashboardPage";
import Planner from "./components/Planner";
import Navigation from "./components/Navigation";
import OAuthCallback from "./components/OAuthCallback";
import { ThemeProvider } from "./context/ThemeContext";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/emotion" element={<ProtectedRoute><EmotionLogger /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
