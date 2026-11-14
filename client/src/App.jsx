
import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import ClubSignup from './pages/ClubSignup'
import SearchPage from './pages/SearchPage.jsx';
import ClubPage from './pages/ClubPage.jsx';
import RequireAuth from './auth/RequireAuth.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clubs" replace />} />
      <Route path="/clubs" element={<SearchPage />} />
      <Route path="/clubs/:id" element={<ClubPage />} />
      <Route path="/club/signup" element={<ClubSignup />}></Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<main className="page"><p className="status">Page not found</p></main>} />
    </Routes>
  );
}

export default App;
