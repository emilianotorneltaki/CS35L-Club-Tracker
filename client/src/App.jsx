import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import ClubSignup from './pages/ClubSignup'
import SearchPage from './pages/SearchPage.jsx';
import ClubPage from './pages/ClubPage.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clubs" replace />} />
      <Route path="/clubs" element={<SearchPage />} />
      <Route path="/clubs/:id" element={<ClubPage />} />
      <Route path="/club/signup" element={<ClubSignup />}></Route>
      <Route path="*" element={<main className="page"><p className="status">Page not found</p></main>} />
    </Routes>
  );
}

export default App;
